import { describe, expect, it } from "vitest";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import worker, { handleRequest } from "./worker";
import { ensureGeneratedBreakSlides, ensureGeneratedClientScript, ensureGeneratedStylesheet } from "./test-support";

ensureGeneratedBreakSlides();
ensureGeneratedStylesheet();
ensureGeneratedClientScript();

describe("worker", () => {
  it("renders the break slide deck", async () => {
    const response = await handleRequest(new Request("http://example.com/"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(response.headers.get("cache-control")).toBe("no-store");

    const body = await response.text();
    expect(body).toContain("Future Frontend 2026 Break Slides");
    expect(body).toContain("Conference registration");
    expect(body).toContain("Welcome");
    expect(body).toContain("Break");
    expect(body).toContain("Designing futures");
    expect(body).toContain("/slides.js");
  });

  it("returns a JSON health response", async () => {
    const response = await handleRequest(new Request("http://example.com/api/health"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      ok: true,
      name: "vibe-template-worker",
      routes: ["/", "/api/health", "/slides.js"],
    });
  });

  it("returns a not found page for unknown routes", async () => {
    const response = await handleRequest(new Request("http://example.com/missing"));

    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");

    const body = await response.text();
    expect(body).toContain("Not Found");
    expect(body).toContain("/missing");
  });

  it("exposes the same behavior through the worker fetch entrypoint", async () => {
    const response = await worker.fetch(new Request("http://example.com/api/health"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });

  it("serves generated styles", async () => {
    const response = await handleRequest(new Request("http://example.com/styles.css"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/css");
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.text()).resolves.toContain("--color-app-canvas:#f3eee6");
  });

  it("renders generated break slide data when present", async () => {
    writeGeneratedBreakSlides({
      breakSlides: [
        {
          day: "Wednesday, 10 June",
          time: "10:00-10:30",
          session: "Generated session",
        },
      ],
      sponsors: [],
    });

    const response = await handleRequest(new Request("http://example.com/"));

    await expect(response.text()).resolves.toContain("Generated session");
    ensureGeneratedBreakSlides();
  });

  it("falls back to committed break slide data when generated data is missing or invalid", async () => {
    rmSync(join(".generated", "break-slides.json"), { force: true });
    const missingResponse = await handleRequest(new Request("http://example.com/"));

    await expect(missingResponse.text()).resolves.toContain("Designing futures");

    writeGeneratedBreakSlides({ breakSlides: [], sponsors: "not valid" });
    const invalidResponse = await handleRequest(new Request("http://example.com/"));

    await expect(invalidResponse.text()).resolves.toContain("Designing futures");
    ensureGeneratedBreakSlides();
  });

  it("serves the slide navigation module", async () => {
    const response = await handleRequest(new Request("http://example.com/slides.js"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/javascript");
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.text()).resolves.toContain("data-break-slide");
  });

  it("serves slide assets", async () => {
    const logoResponse = await handleRequest(new Request("http://example.com/assets/ff26-logo.svg"));
    const fontResponse = await handleRequest(new Request("http://example.com/fonts/FinlandicaHeadline-Regular.ttf"));

    expect(logoResponse.status).toBe(200);
    expect(logoResponse.headers.get("content-type")).toContain("image/svg+xml");
    await expect(logoResponse.text()).resolves.toContain("<svg");

    expect(fontResponse.status).toBe(200);
    expect(fontResponse.headers.get("content-type")).toContain("font/ttf");
    expect((await fontResponse.arrayBuffer()).byteLength).toBeGreaterThan(100_000);
  });
});

function writeGeneratedBreakSlides(value: unknown): void {
  mkdirSync(".generated", { recursive: true });
  writeFileSync(join(".generated", "break-slides.json"), JSON.stringify(value), "utf8");
}
