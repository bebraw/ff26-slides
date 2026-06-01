import { describe, expect, it } from "vitest";
import { exampleRoutes } from "../app-routes";
import fallbackSlideData from "../break-slides.json";
import { emptySlideData, parseSlideData } from "../slide-data";
import { renderHomePage, renderSlideDeckPage } from "./home";

describe("renderHomePage", () => {
  it("renders an index of slide and print tools", () => {
    const html = renderHomePage(exampleRoutes);

    expect(html).toContain("Future Frontend 2026 Tools");
    expect(html).toContain("Organizer tools");
    expect(html).not.toContain('href="/"');
    expect(html).toContain('href="/slides"');
    expect(html).toContain('href="/opening"');
    expect(html).toContain('href="/schedule"');
    expect(html).toContain('href="/speaker-checkin"');
    expect(html).toContain("Future Frontend 2026 break slide deck");
    expect(html).toContain("Future Frontend 2026 opening slide deck");
    expect(html).toContain("Printable daily conference schedules");
    expect(html).toContain("Printable daily speaker check-in sheets");
    expect(html).not.toContain("/api/health");
    expect(html).not.toContain("/slides.js");
    expect(html).not.toContain("Stryker was here!");
  });
});

describe("renderSlideDeckPage", () => {
  it("renders the break slide deck and stylesheet wiring", () => {
    const html = renderSlideDeckPage(parseSlideData(fallbackSlideData, emptySlideData));

    expect(html).toContain("Future Frontend 2026 Break Slides");
    expect(html).toContain("FF26 – Day 1 (8.6.26)");
    expect(html).toContain("FF26 - Day 2 (9.6.26)");
    expect(html).toContain("divider-slide");
    expect(html).toContain("Next session");
    expect(html).toContain("Conference registration");
    expect(html).toContain("Welcome");
    expect(html).toContain("Break");
    expect(html).toContain("Lunch");
    expect(html).toContain("Ending of the day");
    expect(html).toContain("Designing futures");
    expect(html).toContain("Agentic use cases");
    expect(html).toContain("We Don&#39;t Have an Idea Problem. We Have a Permission Problem.");
    expect(html).toContain("talk-slide-speaker");
    expect(html).toContain("talk-title-dense");
    expect(html).toContain("talk-grid-3");
    expect(html).toContain("Ohjelmistofriikit");
    expect(html).toContain('src="/img/pasi.webp"');
    expect(html).toContain('src="/img/ohjelmistofriikit-black.svg"');
    expect(html).toContain("/assets/ff26-logo.svg");
    expect(html).toContain('type="module" src="/slides.js"');
    expect(html).toContain('rel="stylesheet" href="/styles.css"');
    expect(html).not.toContain("https://futurefrontend.com/img/");
    expect(html).not.toContain("slide-count");
    expect(html).not.toContain("Stryker was here!");
    expect(html.match(/data-break-slide/g)).toHaveLength(44);
  });
});
