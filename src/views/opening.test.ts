import { describe, expect, it } from "vitest";
import type { SlideData } from "../slide-data";
import fallbackSlideData from "../break-slides.json";
import { emptySlideData, parseSlideData } from "../slide-data";
import { renderOpeningSlideDeckPage } from "./opening";

describe("renderOpeningSlideDeckPage", () => {
  it("renders the opening slide deck from fixed and schedule-derived content", () => {
    const html = renderOpeningSlideDeckPage(parseSlideData(fallbackSlideData, emptySlideData));

    expect(html).toContain("Future Frontend 2026 Opening Slides");
    expect(html).toContain("Welcome to Future Frontend 2026");
    expect(html).toContain("Henrik Rinne and Tuuli Tiilikainen");
    expect(html).toContain('src="/img/henrik.webp"');
    expect(html).toContain('src="/assets/tuuli-tiilikainen.jpeg"');
    expect(html).toContain("Fourth edition");
    expect(html).toContain("~150 attendees");
    expect(html).toContain("2 workshops");
    expect(html).toContain("18 speakers");
    expect(html).toContain("Rachel-Lee Nabors");
    expect(html).toContain("Designing futures");
    expect(html).toContain("Agentic use cases");
    expect(html).toContain("Ohjelmistofriikit");
    expect(html).toContain('aria-label="Pac-Man rule"');
    expect(html).toContain("Tech sponsors");
    expect(html).toContain("Brand sponsor");
    expect(html).toContain("Mobile Mates meetup");
    expect(html).toContain("HelsinkiJS meetup");
    expect(html).toContain("Vibe Coding Finland");
    expect(html).toContain("Berlin Code of Conduct");
    expect(html).toContain('<a href="https://berlincodeofconduct.org/en">berlincodeofconduct.org/en</a>');
    expect(html).toContain("#FutureFrontend");
    expect(html).toContain('<h1><a href="https://qa.futurefrontend.com">qa.futurefrontend.com</a></h1>');
    expect(html).toContain("Join conference Slack at");
    expect(html).toContain("/assets/ff26-logo.svg");
    expect(html).toContain('type="module" src="/slides.js"');
    expect(html).toContain('rel="stylesheet" href="/styles.css"');
    expect(html).toContain(
      '<section class="break-slide opening-slide opening-slide-title" data-active-slide="true" data-break-slide data-slide-number="1">',
    );
    expect(getSlide(html, "opening-slide-title")).toContain(
      '<img class="opening-title-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">',
    );
    expect(getSlide(html, "opening-slide-title")).not.toContain("<h1>");
    expect(getSlide(html, "opening-slide-title")).not.toContain("<p>");
    expect(getSlide(html, "opening-slide-speaker-grid").match(/class="opening-speaker"/g)).toHaveLength(18);
    expect(getSlide(html, "opening-slide-speaker-grid")).toContain('src="/img/rachel.webp"');
    expect(getSlide(html, "opening-slide-speaker-grid")).not.toContain("<figcaption>");
    expect(getSlide(html, "opening-slide-pacman-rule")).toContain('class="opening-pacman-illustration"');
    expect(getSlide(html, "opening-slide-pacman-rule")).not.toContain("<h1>");
    expect(html.indexOf("Hallway track")).toBeLessThan(html.indexOf('aria-label="Pac-Man rule"'));
    expect(html.indexOf('aria-label="Pac-Man rule"')).toBeLessThan(html.indexOf("Sponsors"));
    expect(getSlide(html, "opening-slide-sponsors")).not.toContain("<figcaption>");
    expect(getSlide(html, "opening-slide-code-of-conduct")).not.toContain('class="next-label"');
    expect(html).toContain(
      'class="break-slide opening-slide opening-slide-two-line" aria-hidden="true" data-break-slide data-slide-number="19"',
    );
    expect(html).not.toContain("Red lanyard");
    expect(html).not.toContain("https://futurefrontend.com/img/");
    expect(html).not.toContain("Stryker was here!");
    expect(html.match(/data-break-slide/g)).toHaveLength(19);
    expect(html.match(/aria-hidden="true"/g)).toHaveLength(18);
  });

  it("derives welcome time, session overview, meetups, and sponsor tiers from slide data", () => {
    const html = renderOpeningSlideDeckPage({
      breakSlides: [
        { day: "Monday, 8 June", time: "07:45-08:00", session: "Welcome" },
        {
          day: "Monday, 8 June",
          time: "09:00-10:30",
          session: "Custom Monday Session",
          talks: [{ title: "Monday talk", speakers: [{ name: "Monday Speaker", image: "/img/monday.webp" }] }],
        },
        { day: "Monday, 8 June", time: "10:30-11:00", session: "Break" },
        { day: "Monday, 8 June", time: "17:30-20:30", session: "Mobile Mates meetup" },
        {
          day: "Tuesday, 9 June",
          time: "11:00-12:30",
          session: "Custom Tuesday Session",
          talks: [{ title: "Tuesday talk", speakers: [{ name: "Tuesday Speaker", image: "/img/tuesday.webp" }] }],
        },
        { day: "Tuesday, 9 June", time: "17:30-21:00", session: "HelsinkiJS meetup" },
        {
          day: "Wednesday, 10 June",
          time: "09:00-10:30",
          session: "Workshop Talk Should Not Appear",
          talks: [{ title: "Workshop talk", speakers: [{ name: "Workshop Speaker", image: "/img/workshop.webp" }] }],
        },
        { day: "Wednesday, 10 June", time: "17:30-21:00", session: "Vibe Coding Finland" },
      ],
      sponsors: [
        { image: "/img/custom-tech.svg", name: "Custom Tech", size: "tech" },
        { image: "/img/custom-brand.svg", name: "Custom Brand", size: "brand" },
      ],
    } satisfies SlideData);

    const scheduleSection = getSlide(html, "opening-slide-schedule-overview");
    const speakersSection = getSlide(html, "opening-slide-speaker-grid");
    const meetupsSection = getSlide(html, "opening-slide-meetups");
    const slackSection = getSlide(html, "opening-slide-two-line");
    const techTier = getSection(html, "Tech sponsors");
    const brandTier = getSection(html, "Brand sponsor");

    expect(html).toContain("07:45-08:00");
    expect(html).not.toContain("08:50-09:00");
    expect(scheduleSection).toContain("Custom Monday Session");
    expect(scheduleSection).toContain("Custom Tuesday Session");
    expect(scheduleSection).toContain("09:00 - 10:30");
    expect(scheduleSection).toContain("11:00 - 12:30");
    expect(scheduleSection).not.toContain("Break");
    expect(scheduleSection).not.toContain("Workshop Talk Should Not Appear");
    expect(speakersSection).toContain("Monday Speaker");
    expect(speakersSection).toContain("Tuesday Speaker");
    expect(speakersSection).toContain("Workshop Speaker");
    expect(speakersSection.match(/class="opening-speaker"/g)).toHaveLength(3);
    expect(meetupsSection).toContain("8.6. 17:30 - 20:30");
    expect(meetupsSection).toContain("9.6. 17:30 - 21:00");
    expect(meetupsSection).toContain("10.6. 17:30 - 21:00");
    expect(meetupsSection).toContain("Vibe Coding Finland");
    expect(meetupsSection).not.toContain("Break");
    expect(techTier).toContain("Custom Tech");
    expect(techTier).not.toContain("Custom Brand");
    expect(brandTier).toContain("Custom Brand");
    expect(brandTier).not.toContain("Custom Tech");
    expect(slackSection).toContain("<p>Join conference Slack at</p>");
    expect(slackSection).toContain('<h1><a href="https://futurefrontend.com">futurefrontend.com</a></h1>');
  });

  it("derives the schedule overview from generated day labels", () => {
    const html = renderOpeningSlideDeckPage({
      breakSlides: [
        {
          day: "Monday 8 June",
          time: "09:00-10:30",
          session: "Generated Monday Session",
          talks: [{ title: "Monday talk", speakers: [{ name: "Monday Speaker", image: "/img/monday.webp" }] }],
        },
        {
          day: "Tuesday 9 June",
          time: "09:00-10:30",
          session: "Generated Tuesday Session",
          talks: [{ title: "Tuesday talk", speakers: [{ name: "Tuesday Speaker", image: "/img/tuesday.webp" }] }],
        },
        {
          day: "Wednesday 10 June",
          time: "09:00-10:30",
          session: "Generated Workshop Session",
          talks: [{ title: "Workshop talk", speakers: [{ name: "Workshop Speaker", image: "/img/workshop.webp" }] }],
        },
      ],
      sponsors: [],
    } satisfies SlideData);

    const scheduleSection = getSlide(html, "opening-slide-schedule-overview");

    expect(scheduleSection).toContain("Monday 8 June");
    expect(scheduleSection).toContain("Generated Monday Session");
    expect(scheduleSection).toContain("Tuesday 9 June");
    expect(scheduleSection).toContain("Generated Tuesday Session");
    expect(scheduleSection).not.toContain("Generated Workshop Session");
  });
});

function getSection(html: string, marker: string): string {
  const start = html.indexOf(marker);
  expect(start).toBeGreaterThanOrEqual(0);

  const end = html.indexOf("</section>", start);
  expect(end).toBeGreaterThan(start);

  return html.slice(start, end);
}

function getSlide(html: string, className: string): string {
  const start = html.indexOf(className);
  expect(start).toBeGreaterThanOrEqual(0);

  const nextSlide = html.indexOf('<section class="break-slide', start + className.length);
  const end = nextSlide === -1 ? html.indexOf("</main>", start) : nextSlide;
  expect(end).toBeGreaterThan(start);

  return html.slice(start, end);
}
