import type { BreakSlide, Speaker, Sponsor } from "../break-slide-types";
import type { SlideData } from "../slide-data";
import { escapeHtml } from "./shared";

const assetBaseUrl = "https://futurefrontend.com";

type OpeningSlide =
  | {
      kind: "title";
    }
  | {
      kind: "welcome";
      day: string;
      time: string;
      title: string;
      people: string;
    }
  | {
      kind: "people";
      title: string;
      people: Array<{ image: string; name: string }>;
    }
  | {
      kind: "statement";
      title: string;
    }
  | {
      kind: "pacman-rule";
    }
  | {
      kind: "link";
      label: string;
      url: string;
    }
  | {
      kind: "speaker-grid";
      title: string;
      speakers: Speaker[];
    }
  | {
      kind: "schedule-overview";
      days: Array<{ day: string; sessions: Array<{ time: string; title: string }> }>;
    }
  | {
      kind: "sponsors";
      sponsors: Sponsor[];
    }
  | {
      kind: "meetups";
      meetups: Array<{ day: string; time: string; title: string }>;
    }
  | {
      kind: "code-of-conduct";
    }
  | {
      kind: "two-line";
      title: string;
      subtitle: string;
      url?: string;
    };

const mcs = [
  { image: "/img/henrik.webp", name: "Henrik Rinne" },
  { image: "/assets/tuuli-tiilikainen.jpeg", name: "Tuuli Tiilikainen" },
];

export function renderOpeningSlideDeckPage(slideData: SlideData): string {
  const renderedSlides = buildOpeningSlides(slideData)
    .map((slide, index) => renderOpeningSlide(slide, index))
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Future Frontend 2026 Opening Slides</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body class="min-h-screen overflow-hidden bg-black text-white antialiased">
    <main class="slide-deck opening-deck" aria-label="Future Frontend 2026 opening slides">${renderedSlides}</main>
    <script type="module" src="/slides.js"></script>
  </body>
</html>`;
}

function buildOpeningSlides(slideData: SlideData): OpeningSlide[] {
  return [
    { kind: "title" },
    {
      kind: "welcome",
      day: "Monday, 8 June",
      time: findSessionTime(slideData.breakSlides, "Welcome") ?? "08:50-09:00",
      title: "Welcome to Future Frontend 2026",
      people: "Henrik Rinne and Tuuli Tiilikainen",
    },
    { kind: "people", title: "MCs", people: mcs },
    { kind: "statement", title: "Fourth edition" },
    { kind: "statement", title: "~150 attendees" },
    { kind: "statement", title: "2 workshops" },
    { kind: "statement", title: "2 conference days" },
    { kind: "speaker-grid", title: "18 speakers", speakers: buildSpeakers(slideData.breakSlides) },
    { kind: "statement", title: "Single track" },
    { kind: "statement", title: "8 themed sessions" },
    { kind: "schedule-overview", days: buildSessionOverview(slideData.breakSlides) },
    { kind: "statement", title: "Hallway track" },
    { kind: "pacman-rule" },
    { kind: "link", label: "qa.futurefrontend.com", url: "https://qa.futurefrontend.com" },
    { kind: "sponsors", sponsors: slideData.sponsors },
    { kind: "meetups", meetups: buildMeetups(slideData.breakSlides) },
    { kind: "code-of-conduct" },
    { kind: "statement", title: "#FutureFrontend" },
    { kind: "two-line", title: "Join conference Slack at", subtitle: "futurefrontend.com", url: "https://futurefrontend.com" },
  ];
}

function renderOpeningSlide(slide: OpeningSlide, index: number): string {
  const activeAttribute = index === 0 ? ' data-active-slide="true"' : ' aria-hidden="true"';

  if (slide.kind === "title") {
    return `<section class="break-slide opening-slide opening-slide-title"${activeAttribute} data-break-slide data-slide-number="${index + 1}">
    ${renderOpeningSlideContent(slide)}
  </section>`;
  }

  return `<section class="break-slide opening-slide opening-slide-${slide.kind}"${activeAttribute} data-break-slide data-slide-number="${index + 1}">
    <header class="slide-header">
      <img class="conference-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">
    </header>
    ${renderOpeningSlideContent(slide)}
  </section>`;
}

function renderOpeningSlideContent(slide: OpeningSlide): string {
  if (slide.kind === "title") {
    return `<div class="slide-content opening-title">
      <img class="opening-title-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">
    </div>`;
  }

  if (slide.kind === "welcome") {
    return `<div class="slide-content opening-welcome">
      <p class="next-label">${escapeHtml(slide.day)} ${escapeHtml(slide.time)}</p>
      <h1>${escapeHtml(slide.title)}</h1>
      <p>${escapeHtml(slide.people)}</p>
    </div>`;
  }

  if (slide.kind === "people") {
    return `<div class="slide-content opening-people">
      <p class="next-label">${escapeHtml(slide.title)}</p>
      <div class="opening-person-grid">${slide.people.map(renderOpeningPerson).join("")}</div>
    </div>`;
  }

  if (slide.kind === "schedule-overview") {
    return `<div class="slide-content opening-schedule">
      <h1>Schedule</h1>
      <div class="opening-day-grid">${slide.days.map(renderOpeningDay).join("")}</div>
    </div>`;
  }

  if (slide.kind === "speaker-grid") {
    return `<div class="slide-content opening-speakers">
      <h1>${escapeHtml(slide.title)}</h1>
      <div class="opening-speaker-grid">${slide.speakers.map(renderOpeningSpeaker).join("")}</div>
    </div>`;
  }

  if (slide.kind === "pacman-rule") {
    return `<div class="slide-content opening-pacman-rule">
      ${renderPacManRuleSvg()}
    </div>`;
  }

  if (slide.kind === "sponsors") {
    return `<div class="slide-content opening-sponsors">
      <h1>Sponsors</h1>
      ${renderSponsorTier(
        "Tech sponsors",
        slide.sponsors.filter((sponsor) => sponsor.size === "tech"),
      )}
      ${renderSponsorTier(
        "Brand sponsor",
        slide.sponsors.filter((sponsor) => sponsor.size === "brand"),
      )}
    </div>`;
  }

  if (slide.kind === "meetups") {
    return `<div class="slide-content opening-meetups">
      <h1>Meetups</h1>
      <ul>${slide.meetups.map(renderMeetup).join("")}</ul>
    </div>`;
  }

  if (slide.kind === "code-of-conduct") {
    return `<div class="slide-content opening-code-of-conduct">
      <h1>Berlin Code of Conduct</h1>
      <p>Report any issues to organizers and we&rsquo;ll sort things out</p>
      <a href="https://berlincodeofconduct.org/en">berlincodeofconduct.org/en</a>
    </div>`;
  }

  if (slide.kind === "two-line") {
    const subtitle = slide.url ? `<a href="${escapeHtml(slide.url)}">${escapeHtml(slide.subtitle)}</a>` : escapeHtml(slide.subtitle);

    return `<div class="slide-content opening-two-line">
      <p>${escapeHtml(slide.title)}</p>
      <h1>${subtitle}</h1>
    </div>`;
  }

  if (slide.kind === "link") {
    return `<div class="slide-content opening-statement opening-link">
      <h1><a href="${escapeHtml(slide.url)}">${escapeHtml(slide.label)}</a></h1>
    </div>`;
  }

  return `<div class="slide-content opening-statement">
    <h1>${escapeHtml(slide.title)}</h1>
  </div>`;
}

function renderPacManRuleSvg(): string {
  return `<svg class="opening-pacman-illustration" viewBox="0 0 640 420" role="img" aria-label="Pac-Man rule">
    <path d="M318 66c-74 0-134 60-134 134s60 134 134 134c42 0 81-19 107-52l-92-82 92-82c-26-33-65-52-107-52Z" fill="currentColor"/>
  </svg>`;
}

function renderOpeningPerson(person: { image: string; name: string }): string {
  return `<figure class="opening-person">
    <img src="${escapeHtml(toServedAssetUrl(person.image))}" alt="${escapeHtml(person.name)}" width="420" height="420">
    <figcaption>${escapeHtml(person.name)}</figcaption>
  </figure>`;
}

function renderOpeningSpeaker(speaker: Speaker): string {
  return `<figure class="opening-speaker">
    <img src="${escapeHtml(toServedAssetUrl(speaker.image))}" alt="${escapeHtml(speaker.name)}" width="220" height="220">
  </figure>`;
}

function renderOpeningDay(day: { day: string; sessions: Array<{ time: string; title: string }> }): string {
  return `<section class="opening-day">
    <h2>${escapeHtml(day.day)}</h2>
    <ol>${day.sessions.map(renderOverviewSession).join("")}</ol>
  </section>`;
}

function renderOverviewSession(session: { time: string; title: string }): string {
  return `<li>
    <time>${escapeHtml(formatDisplayTime(session.time))}</time>
    <span>${escapeHtml(session.title)}</span>
  </li>`;
}

function renderSponsorTier(title: string, sponsors: Sponsor[]): string {
  if (sponsors.length === 0) {
    return "";
  }

  return `<section class="opening-sponsor-tier">
    <h2>${escapeHtml(title)}</h2>
    <div>${sponsors.map(renderOpeningSponsor).join("")}</div>
  </section>`;
}

function renderOpeningSponsor(sponsor: Sponsor): string {
  return `<figure class="opening-sponsor opening-sponsor-${sponsor.size}">
    <img src="${escapeHtml(toServedAssetUrl(sponsor.image))}" alt="${escapeHtml(sponsor.name)}">
  </figure>`;
}

function renderMeetup(meetup: { day: string; time: string; title: string }): string {
  return `<li>
    <time>${escapeHtml(formatMeetupDate(meetup.day))} ${escapeHtml(formatDisplayTime(meetup.time))}</time>
    <span>${escapeHtml(meetup.title)}</span>
  </li>`;
}

function formatDisplayTime(time: string): string {
  return time.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/gu, "$1 - $2");
}

function buildSessionOverview(breakSlides: BreakSlide[]): Array<{ day: string; sessions: Array<{ time: string; title: string }> }> {
  const conferenceDays = Array.from(new Set(breakSlides.filter(hasTalks).map((slide) => slide.day))).slice(0, 2);

  return conferenceDays.map((day) => ({
    day,
    sessions: breakSlides
      .filter((slide) => slide.day === day && hasTalks(slide))
      .map((slide) => ({ time: slide.time, title: slide.session })),
  }));
}

function hasTalks(slide: BreakSlide): boolean {
  return Boolean(slide.talks && slide.talks.length > 0);
}

function buildMeetups(breakSlides: BreakSlide[]): Array<{ day: string; time: string; title: string }> {
  return breakSlides
    .filter((slide) => isMeetupSlide(slide))
    .map((slide) => ({
      day: slide.day,
      time: slide.time,
      title: slide.session,
    }));
}

function buildSpeakers(breakSlides: BreakSlide[]): Speaker[] {
  const speakersByName = new Map<string, Speaker>();

  for (const slide of breakSlides) {
    for (const talk of slide.talks ?? []) {
      for (const speaker of talk.speakers) {
        speakersByName.set(speaker.name, speaker);
      }
    }
  }

  return Array.from(speakersByName.values());
}

function isMeetupSlide(slide: BreakSlide): boolean {
  return slide.session.toLowerCase().includes("meetup") || slide.session === "Vibe Coding Finland";
}

function findSessionTime(breakSlides: BreakSlide[], session: string): string | undefined {
  return breakSlides.find((slide) => slide.session === session)?.time;
}

function formatMeetupDate(day: string): string {
  const match = /(\d+) June/u.exec(day);

  if (!match) {
    return day;
  }

  return `${match[1]}.6.`;
}

function toServedAssetUrl(path: string): string {
  const url = new URL(path, assetBaseUrl);

  if (url.hostname === "futurefrontend.com" && (url.pathname.startsWith("/img/") || url.pathname.startsWith("/assets/"))) {
    return `${url.pathname}${url.search}`;
  }

  return url.toString();
}
