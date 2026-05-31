import { breakSlides, sponsors, type BreakSlide, type Speaker, type Sponsor, type Talk } from "../break-slides";
import { escapeHtml } from "./shared";

const assetBaseUrl = "https://futurefrontend.com";

export function renderHomePage(_routes: Array<{ path: string; purpose: string }>): string {
  const renderedSlides = breakSlides.map(renderSlide).join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Future Frontend 2026 Break Slides</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body class="min-h-screen overflow-hidden bg-black text-white antialiased">
    <main class="slide-deck" aria-label="Future Frontend 2026 break slides">${renderedSlides}</main>
    <script type="module" src="/slides.js"></script>
  </body>
</html>`;
}

function renderSlide(slide: BreakSlide, index: number): string {
  const activeAttribute = index === 0 ? ' data-active-slide="true"' : ' aria-hidden="true"';
  const talks = slide.talks?.map(renderTalk).join("") ?? "";
  const talkCount = slide.talks?.length ?? 0;
  const talkGrid = talks ? `<div class="talk-grid talk-grid-${talkCount}">${talks}</div>` : "";
  const label = slide.label ?? "Next session";

  return `<section class="break-slide"${activeAttribute} data-break-slide data-slide-number="${index + 1}">
    <header class="slide-header">
      <img class="conference-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">
      <div class="slide-kicker">
        <span>${escapeHtml(slide.day)}</span>
        <span>${escapeHtml(slide.time)}</span>
      </div>
    </header>
    <div class="slide-content">
      <p class="next-label">${escapeHtml(label)}</p>
      <h1>${escapeHtml(slide.session)}</h1>
      ${talkGrid}
    </div>
    <footer class="sponsor-strip" aria-label="Sponsors">
      ${sponsors.map(renderSponsor).join("")}
    </footer>
  </section>`;
}

function renderTalk(talkItem: Talk): string {
  return `<article class="talk-card">
    <h2>${escapeHtml(talkItem.title)}</h2>
    <div class="speaker-list">${talkItem.speakers.map(renderSpeaker).join("")}</div>
  </article>`;
}

function renderSpeaker(speakerItem: Speaker): string {
  return `<figure class="speaker">
    <img src="${escapeHtml(toConferenceAssetUrl(speakerItem.image))}" alt="${escapeHtml(speakerItem.name)}" width="204" height="204">
    <figcaption>${escapeHtml(speakerItem.name)}</figcaption>
  </figure>`;
}

function renderSponsor(sponsor: Sponsor): string {
  return `<div class="sponsor sponsor-${sponsor.size}">
    <img src="${escapeHtml(toConferenceAssetUrl(sponsor.image))}" alt="${escapeHtml(sponsor.name)}">
  </div>`;
}

function toConferenceAssetUrl(path: string): string {
  return new URL(path, assetBaseUrl).toString();
}
