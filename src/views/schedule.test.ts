import { describe, expect, it } from "vitest";
import fallbackSlideData from "../break-slides.json";
import { emptySlideData, parseSlideData } from "../slide-data";
import { renderSchedulePage } from "./schedule";

describe("renderSchedulePage", () => {
  it("renders one printable sheet per schedule day", () => {
    const html = renderSchedulePage(parseSlideData(fallbackSlideData, emptySlideData));

    expect(html).toContain("Future Frontend 2026 Schedule");
    expect(html).toContain("Daily schedule");
    expect(html).toContain("Monday, 8 June");
    expect(html).toContain("Tuesday, 9 June");
    expect(html).toContain("Conference registration");
    expect(html).not.toContain("FF26 – Day 1 (8.6.26)");
    expect(html).not.toContain("FF26 - Day 2 (9.6.26)");
    expect(html).toContain("We Don&#39;t Have an Idea Problem. We Have a Permission Problem.");
    expect(html).toContain("Pasi Sillanpää");
    expect(html).toContain('class="schedule-sheet"');
    expect(html).toContain("data-break-slide");
    expect(html).toContain('data-active-slide="true"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-slide-number="1"');
    expect(html).toContain('data-slide-number="4"');
    expect(html).toContain('type="module" src="/slides.js"');
    expect(html).not.toContain("Stryker was here!");
    expect(html.match(/class="schedule-sheet"/g)).toHaveLength(4);
  });

  it("renders schedule-only items without talk markup", () => {
    const html = renderSchedulePage({
      breakSlides: [
        { day: "Monday, 8 June", time: "08:00-08:50", session: "Conference registration" },
        { day: "Monday, 8 June", time: "", session: "FF26 – Day 1 (8.6.26)", variant: "divider" },
        {
          day: "Monday, 8 June",
          time: "09:00-10:00",
          session: "Talk session",
          talks: [
            {
              title: "Opening talk",
              speakers: [
                { name: "First Speaker", image: "/img/first.webp" },
                { name: "Second Speaker", image: "/img/second.webp" },
              ],
            },
          ],
        },
        { day: "Tuesday, 9 June", time: "08:00-08:50", session: "Conference registration" },
      ],
      sponsors: [],
    });

    const scheduleOnlyItem = html.slice(html.indexOf("Conference registration"), html.indexOf("Talk session"));

    expect(scheduleOnlyItem).not.toContain("schedule-talks");
    expect(html).toContain("Opening talk");
    expect(html).toContain("First Speaker");
    expect(html).toContain("Second Speaker");
    expect(html).toContain("/img/first.webp");
    expect(html).toContain("/img/second.webp");
    expect(html).not.toContain("https://futurefrontend.com/img/");
    expect(html).toContain('data-slide-number="2"');
    expect(html).not.toContain("Stryker was here!");
  });
});
