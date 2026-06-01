import { describe, expect, it } from "vitest";
import fallbackSlideData from "../break-slides.json";
import { emptySlideData, parseSlideData } from "../slide-data";
import { renderSpeakerCheckInPage } from "./speaker-checkin";

describe("renderSpeakerCheckInPage", () => {
  it("renders one printable check-in sheet per talk day", () => {
    const html = renderSpeakerCheckInPage(parseSlideData(fallbackSlideData, emptySlideData));

    expect(html).toContain("Future Frontend 2026 Speaker Check-In");
    expect(html).toContain("Speaker check-in");
    expect(html).toContain("Monday, 8 June");
    expect(html).toContain("Tuesday, 9 June");
    expect(html).not.toContain("Wednesday, 10 June");
    expect(html).not.toContain("FF26 – Day 1 (8.6.26)");
    expect(html).not.toContain("FF26 - Day 2 (9.6.26)");
    expect(html).toContain("We Don&#39;t Have an Idea Problem. We Have a Permission Problem.");
    expect(html).toContain("Pasi Sillanpää");
    expect(html).toContain("Arrived");
    expect(html).toContain('aria-label="Arrived"');
    expect(html).toContain("Microphone checked");
    expect(html).toContain("Slides received");
    expect(html).toContain('class="schedule-sheet checkin-sheet"');
    expect(html).toContain("data-break-slide");
    expect(html).toContain('data-active-slide="true"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-slide-number="1"');
    expect(html).toContain('data-slide-number="2"');
    expect(html).toContain(
      '<section class="schedule-sheet checkin-sheet" data-active-slide="true" data-break-slide data-slide-number="1">',
    );
    expect(html).toContain('<section class="schedule-sheet checkin-sheet" aria-hidden="true" data-break-slide data-slide-number="2">');
    expect(html).toContain('type="module" src="/slides.js"');
    expect(html).not.toContain("Stryker was here!");
    expect(html.match(/class="schedule-sheet checkin-sheet"/g)).toHaveLength(2);
  });

  it("renders talk rows without schedule-only intervals", () => {
    const html = renderSpeakerCheckInPage({
      breakSlides: [
        { day: "Monday, 8 June", time: "08:00-08:50", session: "Conference registration" },
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
            {
              title: "Follow-up talk",
              speakers: [{ name: "Third Speaker", image: "/img/third.webp" }],
            },
          ],
        },
        { day: "Tuesday, 9 June", time: "08:00-08:50", session: "Conference registration" },
      ],
      sponsors: [],
    });

    expect(html).toContain("Opening talk");
    expect(html).toContain("Follow-up talk");
    expect(html).toContain("First Speaker, Second Speaker");
    expect(html).toContain("Third Speaker");
    expect(html).toContain('aria-label="Notes"');
    expect(html.match(/<tr>/g)).toHaveLength(3);
    expect(html).not.toContain("Conference registration");
    expect(html).not.toContain("/img/first.webp");
    expect(html).not.toContain("Stryker was here!");
  });
});
