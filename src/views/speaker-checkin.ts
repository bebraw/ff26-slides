import type { BreakSlide, Speaker, Talk } from "../break-slide-types";
import type { SlideData } from "../slide-data";
import { escapeHtml } from "./shared";

type SpeakerCheckInDay = {
  day: string;
  items: SpeakerCheckInItem[];
};

type SpeakerCheckInItem = {
  time: string;
  session: string;
  talk: Talk;
};

export function renderSpeakerCheckInPage(slideData: SlideData): string {
  const days = groupSpeakerCheckInDays(slideData.breakSlides);
  const renderedDays = days.map(renderSpeakerCheckInDay).join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Future Frontend 2026 Speaker Check-In</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body class="schedule-page checkin-page">
    <main class="schedule-deck checkin-deck" aria-label="Future Frontend 2026 speaker check-in sheets">${renderedDays}</main>
    <script type="module" src="/slides.js"></script>
  </body>
</html>`;
}

function groupSpeakerCheckInDays(breakSlides: BreakSlide[]): SpeakerCheckInDay[] {
  const days: SpeakerCheckInDay[] = [];
  const indexByDay = new Map<string, SpeakerCheckInDay>();

  for (const slide of breakSlides) {
    const talks = slide.talks ?? [];

    if (talks.length === 0) {
      continue;
    }

    let day = indexByDay.get(slide.day);

    if (!day) {
      day = { day: slide.day, items: [] };
      indexByDay.set(slide.day, day);
      days.push(day);
    }

    for (const talk of talks) {
      day.items.push({ time: slide.time, session: slide.session, talk });
    }
  }

  return days;
}

function renderSpeakerCheckInDay(day: SpeakerCheckInDay, index: number): string {
  const activeAttribute = index === 0 ? ' data-active-slide="true"' : ' aria-hidden="true"';

  return `<section class="schedule-sheet checkin-sheet"${activeAttribute} data-break-slide data-slide-number="${index + 1}">
    <header class="schedule-sheet-header checkin-sheet-header">
      <img class="schedule-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">
      <div>
        <p>Speaker check-in</p>
        <h1>${escapeHtml(day.day)}</h1>
      </div>
    </header>
    <table class="checkin-table">
      <thead>
        <tr>
          <th scope="col">Time</th>
          <th scope="col">Talk</th>
          <th scope="col">Arrived</th>
          <th scope="col">Mic</th>
          <th scope="col">Slides</th>
          <th scope="col">Notes</th>
        </tr>
      </thead>
      <tbody>
        ${day.items.map(renderSpeakerCheckInItem).join("")}
      </tbody>
    </table>
  </section>`;
}

function renderSpeakerCheckInItem(item: SpeakerCheckInItem): string {
  return `<tr>
    <td class="checkin-time">${escapeHtml(item.time)}</td>
    <td class="checkin-talk">
      <p class="checkin-session">${escapeHtml(item.session)}</p>
      <h2>${escapeHtml(item.talk.title)}</h2>
      <p class="checkin-speakers">${item.talk.speakers.map(renderSpeakerName).join(", ")}</p>
    </td>
    <td>${renderCheckBox("Arrived")}</td>
    <td>${renderCheckBox("Microphone checked")}</td>
    <td>${renderCheckBox("Slides received")}</td>
    <td><span class="checkin-notes" aria-label="Notes"></span></td>
  </tr>`;
}

function renderSpeakerName(speaker: Speaker): string {
  return escapeHtml(speaker.name);
}

function renderCheckBox(label: string): string {
  return `<span class="checkin-box" aria-label="${escapeHtml(label)}"></span>`;
}
