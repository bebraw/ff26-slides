import type { BreakSlide, Speaker, Sponsor, Talk } from "../break-slide-types";
import type { SlideData } from "../slide-data";
import { escapeHtml } from "./shared";

const assetBaseUrl = "https://futurefrontend.com";

type DeckSlide =
  | {
      kind: "break";
      slide: BreakSlide;
    }
  | {
      kind: "talk";
      day: string;
      session: string;
      talk: Talk;
      time: string;
    };

export function renderHomePage(routes: Array<{ path: string; purpose: string }>): string {
  const visibleRoutes = routes.filter((route) => route.path !== "/" && !route.path.startsWith("/api/") && route.path !== "/slides.js");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Future Frontend 2026 Tools</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body class="index-page">
    <main class="index-shell" aria-label="Future Frontend 2026 tools">
      <header class="index-header">
        <img class="index-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">
        <div>
          <p>Organizer tools</p>
          <h1>Future Frontend 2026</h1>
        </div>
      </header>
      <nav class="index-links" aria-label="Slide sets and print sheets">
        ${visibleRoutes.map(renderIndexLink).join("")}
      </nav>
    </main>
  </body>
</html>`;
}

export function renderSlideDeckPage(slideData: SlideData): string {
  const renderedSlides = buildDeckSlides(slideData.breakSlides)
    .map((slide, index) => renderDeckSlide(slideData.sponsors, slide, index))
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Future Frontend 2026 Break Slides</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body class="min-h-screen overflow-hidden bg-black text-white antialiased">
    <main class="slide-deck" aria-label="Future Frontend 2026 slides">${renderedSlides}</main>
    <script type="module" src="/slides.js"></script>
  </body>
</html>`;
}

function renderIndexLink(route: { path: string; purpose: string }): string {
  const titleByPath = new Map([
    ["/", "Index"],
    ["/slides", "Slides"],
    ["/opening", "Opening"],
    ["/closing", "Closing"],
    ["/schedule", "Schedule"],
    ["/speaker-checkin", "Speaker check-in"],
  ]);
  const title = titleByPath.get(route.path) ?? route.path.replace("/", "").replaceAll("-", " ");

  return `<a class="index-link" href="${escapeHtml(route.path)}">
    <span>${escapeHtml(title)}</span>
    <p>${escapeHtml(route.purpose)}</p>
  </a>`;
}

function buildDeckSlides(breakSlides: BreakSlide[]): DeckSlide[] {
  return breakSlides.flatMap((slide) => [
    { kind: "break" as const, slide },
    ...(slide.talks?.map((talkItem) => ({
      kind: "talk" as const,
      day: slide.day,
      session: slide.session,
      talk: talkItem,
      time: slide.time,
    })) ?? []),
  ]);
}

function renderDeckSlide(sponsors: Sponsor[], deckSlide: DeckSlide, index: number): string {
  return deckSlide.kind === "break" ? renderBreakSlide(sponsors, deckSlide.slide, index) : renderTalkSlide(sponsors, deckSlide, index);
}

function renderBreakSlide(sponsors: Sponsor[], slide: BreakSlide, index: number): string {
  if (slide.variant === "divider") {
    return renderDividerSlide(sponsors, slide, index);
  }

  const activeAttribute = index === 0 ? ' data-active-slide="true"' : ' aria-hidden="true"';
  const talks = slide.talks?.map(renderTalk).join("") ?? "";
  const talkCount = slide.talks?.length ?? 0;
  const talkGrid = talks ? `<div class="talk-grid talk-grid-${talkCount}">${talks}</div>` : "";
  const label = slide.label ?? (talkGrid ? "Next session" : "");
  const labelMarkup = label ? `<p class="next-label">${escapeHtml(label)}</p>` : "";

  return `<section class="break-slide"${activeAttribute} data-break-slide data-slide-number="${index + 1}">
    <header class="slide-header">
      <img class="conference-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">
      <div class="slide-kicker">
        <span>${escapeHtml(slide.day)}</span>
        <span>${escapeHtml(slide.time)}</span>
      </div>
    </header>
    <div class="slide-content">
      ${labelMarkup}
      <h1>${escapeHtml(slide.session)}</h1>
      ${talkGrid}
    </div>
    <footer class="sponsor-strip" aria-label="Sponsors">
      ${sponsors.map(renderSponsor).join("")}
    </footer>
  </section>`;
}

function renderDividerSlide(sponsors: Sponsor[], slide: BreakSlide, index: number): string {
  const activeAttribute = index === 0 ? ' data-active-slide="true"' : ' aria-hidden="true"';

  return `<section class="break-slide divider-slide"${activeAttribute} data-break-slide data-slide-number="${index + 1}">
    <header class="slide-header">
      <img class="conference-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">
    </header>
    <div class="slide-content">
      <h1>${escapeHtml(slide.session)}</h1>
    </div>
    <footer class="sponsor-strip" aria-label="Sponsors">
      ${sponsors.map(renderSponsor).join("")}
    </footer>
  </section>`;
}

function renderTalkSlide(sponsors: Sponsor[], slide: Extract<DeckSlide, { kind: "talk" }>, index: number): string {
  const activeAttribute = index === 0 ? ' data-active-slide="true"' : ' aria-hidden="true"';
  const titleClass = getTalkTitleClass(slide.talk.title);

  return `<section class="break-slide talk-slide"${activeAttribute} data-break-slide data-slide-number="${index + 1}">
    <header class="slide-header">
      <img class="conference-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">
      <div class="slide-kicker">
        <span>${escapeHtml(slide.day)}</span>
        <span>${escapeHtml(slide.time)}</span>
      </div>
    </header>
    <div class="talk-slide-content">
      <p class="next-label">${escapeHtml(slide.session)}</p>
      <h1 class="talk-title ${titleClass}">${escapeHtml(slide.talk.title)}</h1>
      <div class="talk-slide-speakers">${slide.talk.speakers.map(renderTalkSlideSpeaker).join("")}</div>
    </div>
    <footer class="sponsor-strip" aria-label="Sponsors">
      ${sponsors.map(renderSponsor).join("")}
    </footer>
  </section>`;
}

// Stryker disable all: Title-size tiers are visual heuristics covered by the browser layout regression test.
function getTalkTitleClass(title: string): string {
  if (title.length > 120) {
    return "talk-title-dense";
  }

  if (title.length > 76) {
    return "talk-title-long";
  }

  if (title.length > 34) {
    return "talk-title-medium";
  }

  return "talk-title-short";
}
// Stryker restore all

function renderTalk(talkItem: Talk): string {
  return `<article class="talk-card">
    <h2>${escapeHtml(talkItem.title)}</h2>
    <div class="speaker-list">${talkItem.speakers.map(renderSpeaker).join("")}</div>
  </article>`;
}

function renderSpeaker(speakerItem: Speaker): string {
  return `<figure class="speaker">
    <img src="${escapeHtml(toServedAssetUrl(speakerItem.image))}" alt="${escapeHtml(speakerItem.name)}" width="204" height="204">
    <figcaption>${escapeHtml(speakerItem.name)}</figcaption>
  </figure>`;
}

function renderTalkSlideSpeaker(speakerItem: Speaker): string {
  return `<figure class="talk-slide-speaker">
    <img src="${escapeHtml(toServedAssetUrl(speakerItem.image))}" alt="${escapeHtml(speakerItem.name)}" width="420" height="420">
    <figcaption>${escapeHtml(speakerItem.name)}</figcaption>
  </figure>`;
}

function renderSponsor(sponsor: Sponsor): string {
  return `<div class="sponsor sponsor-${sponsor.size}">
    <img src="${escapeHtml(toServedAssetUrl(sponsor.image))}" alt="${escapeHtml(sponsor.name)}">
  </div>`;
}

function toServedAssetUrl(path: string): string {
  const url = new URL(path, assetBaseUrl);

  if (url.hostname === "futurefrontend.com" && url.pathname.startsWith("/img/")) {
    return `${url.pathname}${url.search}`;
  }

  return url.toString();
}
