import { describe, expect, it } from "vitest";
import { exampleRoutes } from "../app-routes";
import fallbackSlideData from "../break-slides.json";
import { emptySlideData, parseSlideData } from "../slide-data";
import { renderHomePage } from "./home";

describe("renderHomePage", () => {
  it("renders the break slide deck and stylesheet wiring", () => {
    const html = renderHomePage(exampleRoutes, parseSlideData(fallbackSlideData, emptySlideData));

    expect(html).toContain("Future Frontend 2026 Break Slides");
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
    expect(html).toContain("/assets/ff26-logo.svg");
    expect(html).toContain('type="module" src="/slides.js"');
    expect(html).toContain('rel="stylesheet" href="/styles.css"');
    expect(html).not.toContain("slide-count");
    expect(html).not.toContain("Stryker was here!");
    expect(html.match(/data-break-slide/g)).toHaveLength(42);
  });
});
