import type { BreakSlide, Speaker, Talk } from "../break-slide-types";
import type { SlideData } from "../slide-data";
import { escapeHtml } from "./shared";

const assetBaseUrl = "https://futurefrontend.com";

type ScheduleDay = {
  day: string;
  items: BreakSlide[];
};

export function renderSchedulePage(slideData: SlideData): string {
  const days = groupScheduleDays(slideData.breakSlides);
  const renderedDays = days.map(renderScheduleDay).join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Future Frontend 2026 Schedule</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body class="schedule-page">
    <main class="schedule-deck" aria-label="Future Frontend 2026 daily schedules">${renderedDays}</main>
    <script type="module" src="/slides.js"></script>
  </body>
</html>`;
}

function groupScheduleDays(breakSlides: BreakSlide[]): ScheduleDay[] {
  const days: ScheduleDay[] = [];
  const indexByDay = new Map<string, ScheduleDay>();

  for (const slide of breakSlides) {
    let day = indexByDay.get(slide.day);

    if (!day) {
      day = { day: slide.day, items: [] };
      indexByDay.set(slide.day, day);
      days.push(day);
    }

    day.items.push(slide);
  }

  return days;
}

function renderScheduleDay(day: ScheduleDay, index: number): string {
  const activeAttribute = index === 0 ? ' data-active-slide="true"' : ' aria-hidden="true"';

  return `<section class="schedule-sheet"${activeAttribute} data-break-slide data-slide-number="${index + 1}">
    <header class="schedule-sheet-header">
      <img class="schedule-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">
      <div>
        <p>Daily schedule</p>
        <h1>${escapeHtml(day.day)}</h1>
      </div>
    </header>
    <ol class="schedule-list">
      ${day.items.map(renderScheduleItem).join("")}
    </ol>
  </section>`;
}

function renderScheduleItem(item: BreakSlide): string {
  return `<li class="schedule-item">
    <time>${escapeHtml(item.time)}</time>
    <div class="schedule-item-main">
      <h2>${escapeHtml(item.session)}</h2>
      ${renderTalks(item.talks ?? [])}
    </div>
  </li>`;
}

function renderTalks(talks: Talk[]): string {
  if (talks.length === 0) {
    return "";
  }

  return `<ul class="schedule-talks">
    ${talks.map(renderTalk).join("")}
  </ul>`;
}

function renderTalk(talk: Talk): string {
  return `<li>
    <h3>${escapeHtml(talk.title)}</h3>
    <div class="schedule-speakers">${talk.speakers.map(renderSpeaker).join("")}</div>
  </li>`;
}

function renderSpeaker(speaker: Speaker): string {
  return `<figure>
    <img src="${escapeHtml(toServedAssetUrl(speaker.image))}" alt="${escapeHtml(speaker.name)}" width="96" height="96">
    <figcaption>${escapeHtml(speaker.name)}</figcaption>
  </figure>`;
}

function toServedAssetUrl(path: string): string {
  const url = new URL(path, assetBaseUrl);

  if (url.hostname === "futurefrontend.com" && url.pathname.startsWith("/img/")) {
    return `${url.pathname}${url.search}`;
  }

  return url.toString();
}
