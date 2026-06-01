import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import worker, { handleRequest } from "./worker";
import { ensureGeneratedBreakSlides, ensureGeneratedClientScript, ensureGeneratedStylesheet } from "./test-support";

ensureGeneratedBreakSlides();
ensureGeneratedStylesheet();
ensureGeneratedClientScript();

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("worker", () => {
  it("renders the index page", async () => {
    const response = await handleRequest(new Request("http://example.com/"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(response.headers.get("cache-control")).toBe("no-store");

    const body = await response.text();
    expect(body).toContain("Future Frontend 2026 Tools");
    expect(body).toContain('href="/slides"');
    expect(body).toContain('href="/opening"');
    expect(body).toContain('href="/schedule"');
    expect(body).toContain('href="/speaker-checkin"');
    expect(body).not.toContain("data-break-slide");
  });

  it("renders the break slide deck", async () => {
    const response = await handleRequest(new Request("http://example.com/slides"));

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

  it("renders the opening slide deck", async () => {
    const response = await handleRequest(new Request("http://example.com/opening"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(response.headers.get("cache-control")).toBe("no-store");

    const body = await response.text();
    expect(body).toContain("Future Frontend 2026 Opening Slides");
    expect(body).toContain("Fourth edition");
    expect(body).toContain("Mobile Mates meetup");
    expect(body).toContain("qa.futurefrontend.com");
    expect(body).toContain("/slides.js");
  });

  it("returns a JSON health response", async () => {
    const response = await handleRequest(new Request("http://example.com/api/health"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      ok: true,
      name: "vibe-template-worker",
      routes: ["/", "/slides", "/opening", "/schedule", "/speaker-checkin", "/api/health", "/slides.js"],
    });
  });

  it("renders the printable schedule", async () => {
    const response = await handleRequest(new Request("http://example.com/schedule"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");

    const body = await response.text();
    expect(body).toContain("Future Frontend 2026 Schedule");
    expect(body).toContain("Daily schedule");
    expect(body).toContain("Monday, 8 June");
    expect(body).toContain("Tuesday, 9 June");
    expect(body).toContain("/slides.js");
  });

  it("renders the speaker check-in sheet", async () => {
    const response = await handleRequest(new Request("http://example.com/speaker-checkin"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");

    const body = await response.text();
    expect(body).toContain("Future Frontend 2026 Speaker Check-In");
    expect(body).toContain("Speaker check-in");
    expect(body).toContain("Pasi Sillanpää");
    expect(body).toContain("Arrived");
    expect(body).toContain("Slides received");
    expect(body).toContain("/slides.js");
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

    const response = await handleRequest(new Request("http://example.com/slides"));

    await expect(response.text()).resolves.toContain("Generated session");
    ensureGeneratedBreakSlides();
  });

  it("falls back to committed break slide data when generated data is missing or invalid", async () => {
    rmSync(join(".generated", "break-slides.json"), { force: true });
    const missingResponse = await handleRequest(new Request("http://example.com/slides"));

    await expect(missingResponse.text()).resolves.toContain("Designing futures");

    writeGeneratedBreakSlides({ breakSlides: [], sponsors: "not valid" });
    const invalidResponse = await handleRequest(new Request("http://example.com/slides"));

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
    const tuuliResponse = await handleRequest(new Request("http://example.com/assets/tuuli-tiilikainen.jpeg"));

    expect(logoResponse.status).toBe(200);
    expect(logoResponse.headers.get("content-type")).toContain("image/svg+xml");
    await expect(logoResponse.text()).resolves.toContain("<svg");

    expect(fontResponse.status).toBe(200);
    expect(fontResponse.headers.get("content-type")).toContain("font/ttf");
    expect((await fontResponse.arrayBuffer()).byteLength).toBeGreaterThan(100_000);

    expect(tuuliResponse.status).toBe(200);
    expect(tuuliResponse.headers.get("content-type")).toContain("image/jpeg");
    const tuuliBytes = new Uint8Array(await tuuliResponse.arrayBuffer());
    expect(tuuliBytes.byteLength).toBe(statSync("src/assets/tuuli-tiilikainen.jpeg").size);
    expect(Array.from(tuuliBytes.slice(0, 3))).toEqual([0xff, 0xd8, 0xff]);
  });

  it("serves conference images through the Worker", async () => {
    const fetchMock = vi.fn(async () => new Response("speaker image", { headers: { "content-type": "image/webp" } }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await handleRequest(new Request("http://example.com/img/pasi.webp"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/webp");
    expect(response.headers.get("cache-control")).toBe("public, max-age=14400, must-revalidate");
    await expect(response.text()).resolves.toBe("speaker image");
    expect(fetchMock).toHaveBeenCalledWith(new URL("https://futurefrontend.com/img/pasi.webp"));
  });

  it("returns the upstream status for missing conference images", async () => {
    vi.stubGlobal("fetch", async () => new Response("missing", { status: 404 }));

    const response = await handleRequest(new Request("http://example.com/img/missing.webp"));

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.text()).resolves.toBe("Image not found");
  });
});

function writeGeneratedBreakSlides(value: unknown): void {
  mkdirSync(".generated", { recursive: true });
  writeFileSync(join(".generated", "break-slides.json"), JSON.stringify(value), "utf8");
}
