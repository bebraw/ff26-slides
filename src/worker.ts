import { createHealthResponse } from "./api/health";
import { exampleRoutes } from "./app-routes";
import { emptySlideData, parseSlideData, type SlideData } from "./slide-data";
import { renderHomePage, renderSlideDeckPage } from "./views/home";
import { renderNotFoundPage } from "./views/not-found";
import { renderClosingSlideDeckPage } from "./views/closing";
import { renderOpeningSlideDeckPage } from "./views/opening";
import { renderSchedulePage } from "./views/schedule";
import { renderSpeakerCheckInPage } from "./views/speaker-checkin";
import { assetResponse, cssResponse, htmlResponse, javascriptResponse } from "./views/shared";

export default {
  async fetch(request: Request): Promise<Response> {
    return await handleRequest(request);
  },
};

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/styles.css") {
    return cssResponse(await loadStylesheet());
  }

  if (url.pathname === "/slides.js") {
    return javascriptResponse(await loadClientScript());
  }

  if (url.pathname === "/assets/ff26-logo.svg") {
    return assetResponse(await loadLogo(), "image/svg+xml; charset=utf-8");
  }

  if (url.pathname === "/assets/tuuli-tiilikainen.jpeg") {
    return assetResponse(await loadTuuliTiilikainenPhoto(), "image/jpeg");
  }

  if (url.pathname.startsWith("/img/")) {
    return await loadConferenceImage(url);
  }

  if (url.pathname === "/fonts/FinlandicaHeadline-Regular.ttf") {
    return assetResponse(await loadFont(), "font/ttf");
  }

  if (url.pathname === "/") {
    return htmlResponse(renderHomePage(exampleRoutes));
  }

  if (url.pathname === "/slides") {
    return htmlResponse(renderSlideDeckPage(await loadSlideData()));
  }

  if (url.pathname === "/opening") {
    return htmlResponse(renderOpeningSlideDeckPage(await loadSlideData()));
  }

  if (url.pathname === "/closing") {
    return htmlResponse(renderClosingSlideDeckPage());
  }

  if (url.pathname === "/schedule") {
    return htmlResponse(renderSchedulePage(await loadSlideData()));
  }

  if (url.pathname === "/speaker-checkin") {
    return htmlResponse(renderSpeakerCheckInPage(await loadSlideData()));
  }

  if (url.pathname === "/api/health") {
    return createHealthResponse(exampleRoutes.map((route) => route.path));
  }

  return htmlResponse(renderNotFoundPage(url.pathname), 404);
}

async function loadStylesheet(): Promise<string> {
  // Stryker disable next-line ConditionalExpression,OptionalChaining: Environment probe selects Node fs in tests and bundled CSS in Workers.
  if (typeof process !== "undefined" && process.release?.name === "node") {
    const { readFile } = await import("node:fs/promises");
    return await readFile(new URL("../.generated/styles.css", import.meta.url), "utf8");
  }

  const styles = await import("../.generated/styles.css");
  return styles.default;
}

async function loadClientScript(): Promise<string> {
  // Stryker disable next-line ConditionalExpression,OptionalChaining: Environment probe selects Node fs in tests and bundled JS in Workers.
  if (typeof process !== "undefined" && process.release?.name === "node") {
    const { readFile } = await import("node:fs/promises");
    return await readFile(new URL("../.generated/client/slides.client.txt", import.meta.url), "utf8");
  }

  const script = await import("../.generated/client/slides.client.txt");
  return script.default;
}

async function loadSlideData(): Promise<SlideData> {
  const fallback = await loadFallbackSlideData();

  // Stryker disable next-line ConditionalExpression,OptionalChaining: Environment probe selects Node fs in tests and bundled JSON in Workers.
  if (typeof process !== "undefined" && process.release?.name === "node") {
    const { readFile } = await import("node:fs/promises");

    try {
      return parseSlideData(await readFile(new URL("../.generated/break-slides.json", import.meta.url), "utf8"), fallback);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        return fallback;
      }

      throw error;
    }
  }

  const slideData = await import("../.generated/break-slides.json");
  return parseSlideData(slideData.default, fallback);
}

async function loadFallbackSlideData(): Promise<SlideData> {
  // Stryker disable next-line ConditionalExpression,OptionalChaining: Environment probe selects Node fs in tests and bundled JSON in Workers.
  if (typeof process !== "undefined" && process.release?.name === "node") {
    const { readFile } = await import("node:fs/promises");
    return parseSlideData(await readFile(new URL("./break-slides.json", import.meta.url), "utf8"), emptySlideData);
  }

  const slideData = await import("./break-slides.json");
  return parseSlideData(slideData.default, emptySlideData);
}

async function loadLogo(): Promise<string> {
  // Stryker disable next-line ConditionalExpression,OptionalChaining: Environment probe selects Node fs in tests and bundled SVG in Workers.
  if (typeof process !== "undefined" && process.release?.name === "node") {
    const { readFile } = await import("node:fs/promises");
    return await readFile(new URL("./assets/ff26-logo.svg", import.meta.url), "utf8");
  }

  const logo = await import("./assets/ff26-logo.svg");
  return logo.default;
}

async function loadFont(): Promise<ArrayBuffer> {
  // Stryker disable next-line ConditionalExpression,OptionalChaining: Environment probe selects Node fs in tests and bundled font in Workers.
  if (typeof process !== "undefined" && process.release?.name === "node") {
    const { readFile } = await import("node:fs/promises");
    const font = await readFile(new URL("./assets/FinlandicaHeadline-Regular.ttf", import.meta.url));
    return font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength);
  }

  const font = await import("./assets/FinlandicaHeadline-Regular.ttf");
  return font.default;
}

async function loadTuuliTiilikainenPhoto(): Promise<ArrayBuffer> {
  // Stryker disable next-line ConditionalExpression,OptionalChaining: Environment probe selects Node fs in tests and bundled JPEG in Workers.
  if (typeof process !== "undefined" && process.release?.name === "node") {
    const { readFile } = await import("node:fs/promises");
    const image = await readFile(new URL("./assets/tuuli-tiilikainen.jpeg", import.meta.url));
    return image.buffer.slice(image.byteOffset, image.byteOffset + image.byteLength);
  }

  const image = await import("./assets/tuuli-tiilikainen.jpeg");
  return image.default;
}

async function loadConferenceImage(url: URL): Promise<Response> {
  const sourceUrl = new URL(`${url.pathname}${url.search}`, "https://futurefrontend.com");
  const response = await fetch(sourceUrl);

  if (!response.ok) {
    return new Response("Image not found", {
      status: response.status,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/octet-stream",
      "cache-control": "public, max-age=14400, must-revalidate",
    },
  });
}
