import type { BreakSlide, Speaker, Sponsor } from "../break-slide-types";
import type { SlideData } from "../slide-data";
import { escapeHtml } from "./shared";

const assetBaseUrl = "https://futurefrontend.com";

// Curated from the 2023-2025 Future Frontend sponsor sections, excluding partners.
const pastSponsors = [
  { name: "Gofore", image: "/img/gofore.svg", size: "tech" },
  { name: "Elisa", image: "/img/elisa.svg", size: "tech" },
  { name: "Knowit", image: "/img/knowit.svg", size: "tech" },
  { name: "Alma Media", image: "/img/alma.svg", size: "brand" },
  { name: "Digia", image: "/img/digia.svg", size: "tech" },
  { name: "Evitec", image: "/img/evitec.svg", size: "tech" },
  { name: "UpCloud", image: "/img/upcloud.svg", size: "tech" },
  { name: "toddle", image: "/img/toddle2.svg", size: "brand" },
  { name: "Columbia Road", image: "/img/columbiaroad.svg", size: "brand" },
  { name: "Smartly", image: "/img/smartly.svg", size: "tech" },
  { name: "Wunderdog", image: "/img/wunderdog.svg", size: "tech" },
  { name: "Backscreen", image: "/img/backscreen-only.svg", size: "tech" },
  { name: "Wonna", image: "/img/wonna.webp", size: "brand" },
] satisfies Sponsor[];

const pastSpeakers = [
  { name: "Samuel Macleod", image: "/img/samuel.webp" },
  { name: "Thaís Santos", image: "/img/thais.webp" },
  { name: "Tero Parviainen", image: "/img/tero.webp" },
  { name: "Juho Vepsäläinen", image: "/img/juho.webp" },
  { name: "Miško Hevery", image: "/img/misko.webp" },
  { name: "Ryan Carniato", image: "/img/ryan.webp" },
  { name: "Felix Gnass", image: "/img/felix.webp" },
  { name: "Matthew Phillips", image: "/img/matthew.webp" },
  { name: "Mohammad Khazali", image: "/img/mo.webp" },
  { name: "Jani Eväkallio", image: "/img/jani.webp" },
  { name: "Stephanie Nemeth", image: "/img/stephanie.webp" },
  { name: "Satu Lapinlampi", image: "/img/satu.webp" },
  { name: "Janne Kalliola", image: "/img/janne.webp" },
  { name: "Pekka Enberg", image: "/img/pekka.webp" },
  { name: "Pete Bacon Darwin", image: "/img/pete.webp" },
  { name: "Sunil Pai", image: "/img/sunil.webp" },
  { name: "Aleksandra Sikora", image: "/img/aleksandra.webp" },
  { name: "Zak Allal", image: "/img/zak.webp" },
  { name: "Jason Rametta", image: "/img/jason.webp" },
  { name: "Yoav Ganbar", image: "/img/yoav.webp" },
  { name: "Maggie Appleton", image: "/img/maggie.webp" },
  { name: "Matt Webb", image: "/img/matt-webb.webp" },
  { name: "Andreas Møller", image: "/img/andreas.webp" },
  { name: "Luca Casonato", image: "/img/luca.webp" },
  { name: "Jo Franchetti", image: "/img/jo.webp" },
  { name: "Jari Porras", image: "/img/jari.webp" },
  { name: "Ben Holmes", image: "/img/ben.webp" },
  { name: "Ujjwal Sharma", image: "/img/uj.webp" },
  { name: "Shane Carr", image: "/img/shane.webp" },
  { name: "Daniel Ehrenberg", image: "/img/daniel-e.webp" },
  { name: "Rob Palmer", image: "/img/rob.webp" },
  { name: "Michael Ficarra", image: "/img/michael.webp" },
  { name: "Rachel-Lee Nabors", image: "/img/rachel.webp" },
  { name: "Steve Ruiz", image: "/img/steve.webp" },
  { name: "Devlin Duldulao", image: "/img/devlin.webp" },
  { name: "Aurora Scharff", image: "/img/aurora.webp" },
  { name: "m4dz 🎙🥑", image: "/img/m4dz.webp" },
  { name: "Julien Sulpis", image: "/img/julien.webp" },
  { name: "Georgios Diamantopoulos", image: "/img/georgios.webp" },
  { name: "Ewa Gasperowicz", image: "/img/ewa.webp" },
  { name: "Barry Pollard", image: "/img/barry.webp" },
  { name: "Olavi Haapala", image: "/img/olavi.webp" },
  { name: "Joonas Kykkänen", image: "/img/joonas.webp" },
  { name: "Charlie Gerard", image: "/img/charlie.webp" },
  { name: "Marianna Österlund", image: "/img/marianna.webp" },
  { name: "Eeva-Jonna 'Eevis' Panula", image: "/img/eevis.webp" },
  { name: "Jussi Eronen", image: "/img/juhani.webp" },
  { name: "Sebastian Obel", image: "/img/sebastian.webp" },
] satisfies Speaker[];

// Curated from the 2023-2026 Future Frontend workshop pages.
const workshopInstructors = [
  { name: "Samuel Macleod", image: "/img/samuel.webp" },
  { name: "Thaís Santos", image: "/img/thais.webp" },
  { name: "Tero Parviainen", image: "/img/tero.webp" },
  { name: "Juho Vepsäläinen", image: "/img/juho.webp" },
  { name: "Miško Hevery", image: "/img/misko.webp" },
  { name: "Zak Allal", image: "/img/zak.webp" },
  { name: "Jason Rametta", image: "/img/jason.webp" },
  { name: "Devlin Duldulao", image: "/img/devlin.webp" },
  { name: "Aurora Scharff", image: "/img/aurora.webp" },
  { name: "m4dz 🎙🥑", image: "/img/m4dz.webp" },
  { name: "Julien Sulpis", image: "/img/julien.webp" },
  { name: "Georgios Diamantopoulos", image: "/img/georgios.webp" },
  { name: "Ohans Emmanuel", image: "/img/ohans.webp" },
  { name: "Joonas Pajunen", image: "/img/joonas-p.webp" },
] satisfies Speaker[];

// Curated from https://futurefrontend.com/organizers/.
const organizers = [
  { name: "Juho Vepsäläinen", image: "/img/juho.webp" },
  { name: "Eemeli Aro", image: "/img/eemeli.webp" },
  { name: "Harri Määttä", image: "/img/harri.webp" },
  { name: "Toni Ristola", image: "/img/toni.webp" },
  { name: "Tuuli Tiilikainen", image: "/img/tuuli.webp" },
  { name: "Juha-Matti Santala", image: "/img/juhis.webp" },
  { name: "Emilia Hjelm", image: "/img/emilia.webp" },
  { name: "Jussi Kinnula", image: "/img/jussi.webp" },
  { name: "Juho Lehtinen", image: "/img/juho-lehtinen.webp" },
] satisfies Speaker[];

// Curated from the Future Frontend 2023-2026 GraphQL conference.mcs data.
const mcs = [
  { name: "Jani Eväkallio", image: "/img/jani.webp" },
  { name: "Tuuli Tiilikainen", image: "/img/tuuli.webp" },
  { name: "Daniel Yuschick", image: "/img/daniel.webp" },
  { name: "Henrik Rinne", image: "/img/henrik.webp" },
] satisfies Speaker[];

// Curated from the 2023-2026 Future Frontend partner sections.
const partners = [
  { name: "BEJS", image: "/img/bejs.svg" },
  { name: "Koodia Suomesta", image: "/img/koodiasuomesta.svg" },
  { name: "React Norway", image: "/img/reactnorway.svg" },
  { name: "SurviveJS", image: "/img/survivejs.svg" },
  { name: "Node Congress", image: "/img/nodecongress.webp" },
  { name: "WebExpo", image: "/img/webexpo.webp" },
  { name: "Nitor", image: "/img/nitor.svg" },
  { name: "Columbia Road", image: "/img/columbiaroad.svg" },
  { name: "Loihde Factor", image: "/img/loihdefactor.svg" },
  { name: "Sticker Mule", image: "/img/stickermule.svg" },
  { name: "GrUSP", image: "/img/grusp.svg" },
  { name: "DevOps.js Conf", image: "/img/dojs.svg" },
  { name: "Glorium Technologies", image: "/img/glorium.svg" },
  { name: "Kongres Next.js", image: "/img/kongrespl.svg" },
  { name: "React Paris", image: "/img/reactparis.webp" },
  { name: "JSConf Budapest", image: "/img/jsconfbp.svg" },
  { name: "jsday", image: "/img/jsday.svg" },
  { name: "FrankenJS", image: "/img/frankenjs.svg" },
  { name: "Ohjelmistofriikit", image: "/img/friikit.svg" },
  { name: "Yle Dev", image: "/img/yledev.webp" },
  { name: "Vihat Technologies", image: "/img/vihat.webp" },
  { name: "Digital Expert", image: "/img/digital-expert.svg" },
  { name: "React Summit", image: "/img/react-summit.svg" },
  { name: "JSNation", image: "/img/jsn.svg" },
  { name: "React Paris", image: "/img/rp.webp" },
  { name: "This Week In React", image: "/img/twir.webp" },
  { name: "Business College Helsinki", image: "/img/hbc.svg" },
  { name: "API Days Helsinki", image: "/img/apidays.webp" },
  { name: "Haaga-Helia", image: "/img/haagahelia.webp" },
  { name: "MonoLisa", image: "/img/monolisa.svg" },
  { name: "ZurichJS", image: "/img/zurichjs-square.webp" },
  { name: "Mastra", image: "/img/mastra.svg" },
] satisfies Partner[];

type ClosingSlide =
  | {
      kind: "title";
    }
  | {
      kind: "timeline";
      editions: Array<{ year: string; note: string }>;
    }
  | {
      kind: "numbers";
      numbers: Array<{ label: string; value: string }>;
    }
  | {
      kind: "topic-map";
      topics: Array<{ before: string; after: string }>;
    }
  | {
      kind: "photo-grid";
      title: string;
      photos: Photo[];
    }
  | {
      kind: "thanks";
      groups: string[];
    }
  | {
      kind: "speakers";
      speakers: Speaker[];
    }
  | {
      kind: "workshop-instructors";
      instructors: Speaker[];
    }
  | {
      kind: "organizers";
      organizers: Speaker[];
    }
  | {
      kind: "mcs";
      mcs: Speaker[];
    }
  | {
      kind: "attendees";
      units: number;
    }
  | {
      kind: "sponsors";
      sponsors: Sponsor[];
    }
  | {
      kind: "partners";
      partners: Partner[];
    }
  | {
      kind: "sdlcai";
    }
  | {
      kind: "final";
    };

type Photo = {
  alt: string;
  caption: string;
  pageUrl: string;
  src: string;
};

type Partner = {
  image: string;
  name: string;
};

// Stryker disable all: Curated photo metadata is static presentation content covered by view and browser tests.
const selectedPhotos = {
  firstVenueHall: {
    alt: "Future Frontend 2023 conference hall at Pörssitalo",
    caption: "Pörssitalo",
    pageUrl: "https://www.flickr.com/photos/react-finland/52968689745/",
    src: "https://live.staticflickr.com/65535/52968689745_2b2890fe0e_b.jpg",
  },
  paasitorniVenue: {
    alt: "Future Frontend 2024 conference hall at Paasitorni",
    caption: "Paasitorni",
    pageUrl: "https://www.flickr.com/photos/react-finland/53829874388/",
    src: "https://live.staticflickr.com/65535/53829874388_e04b19403b_b.jpg",
  },
  hallwayTrack: {
    alt: "Future Frontend attendees talking in the Paasitorni hallway",
    caption: "Hallway track",
    pageUrl: "https://www.flickr.com/photos/react-finland/52968689800/",
    src: "https://live.staticflickr.com/65535/52968689800_695e54b2bb_b.jpg",
  },
  conversationStage: {
    alt: "Future Frontend 2024 panel conversation on stage",
    caption: "Conversations",
    pageUrl: "https://www.flickr.com/photos/react-finland/53829874418/",
    src: "https://live.staticflickr.com/65535/53829874418_0c719442d3_b.jpg",
  },
  aaltoStage: {
    alt: "Future Frontend 2025 audience and stage at Aalto University",
    caption: "Dipoli",
    pageUrl: "https://www.flickr.com/photos/react-finland/54581976568/",
    src: "https://live.staticflickr.com/65535/54581976568_8b15a4821c_b.jpg",
  },
  stageMoments: {
    alt: "Future Frontend 2025 speakers on stage with the audience at Dipoli",
    caption: "Stage moments",
    pageUrl: "https://www.flickr.com/photos/react-finland/54582055640/",
    src: "https://live.staticflickr.com/65535/54582055640_e348f04483_b.jpg",
  },
} satisfies Record<string, Photo>;
// Stryker restore all

export function renderClosingSlideDeckPage(slideData: SlideData): string {
  const renderedSlides = buildClosingSlides(slideData)
    .map((slide, index) => renderClosingSlide(slide, index))
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Future Frontend 2026 Closing Slides</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body class="min-h-screen overflow-hidden bg-black text-white antialiased">
    <main class="slide-deck closing-deck" aria-label="Future Frontend 2026 closing slides">${renderedSlides}</main>
    <script type="module" src="/slides.js"></script>
  </body>
</html>`;
}

// Stryker disable all: Closing deck copy and curated photo choices are static presentation content covered by view and browser tests.
function buildClosingSlides(slideData: SlideData): ClosingSlide[] {
  return [
    { kind: "title" },
    {
      kind: "timeline",
      editions: [
        { year: "2023", note: "The first Future Frontend" },
        { year: "2024", note: "The conversation widened" },
        { year: "2025", note: "The future got closer" },
        { year: "2026", note: "The last edition in this series?" },
      ],
    },
    {
      kind: "numbers",
      numbers: [
        { value: "4", label: "editions" },
        { value: "8", label: "conference days" },
        { value: "32", label: "sessions" },
        { value: "13", label: "workshops" },
        { value: "16", label: "meetups" },
        { value: "65", label: "unique speakers" },
      ],
    },
    {
      kind: "topic-map",
      topics: [
        { before: "SolidJS and reactivity", after: "Signals everywhere" },
        { before: "Qwik and resumability", after: "Server/client boundaries got blurry" },
        { before: "Edge auth and workers", after: "Frontend moved closer to users" },
        { before: "AI-powered interfaces", after: "AI-first frontend work" },
        { before: "Green coding", after: "Permacomputing and resilience" },
      ],
    },
    {
      kind: "photo-grid",
      title: "The venues",
      photos: [selectedPhotos.firstVenueHall, selectedPhotos.paasitorniVenue, selectedPhotos.aaltoStage],
    },
    {
      kind: "photo-grid",
      title: "What we remember",
      photos: [selectedPhotos.hallwayTrack, selectedPhotos.conversationStage, selectedPhotos.stageMoments],
    },
    {
      kind: "thanks",
      groups: ["Speakers", "Workshop instructors", "Organizers", "Attendees", "Sponsors", "Partners", "Volunteers", "MCs"],
    },
    { kind: "speakers", speakers: buildClosingSpeakers(slideData.breakSlides) },
    { kind: "workshop-instructors", instructors: buildClosingWorkshopInstructors(slideData.breakSlides) },
    { kind: "organizers", organizers },
    { kind: "mcs", mcs },
    { kind: "attendees", units: 600 },
    { kind: "sponsors", sponsors: buildClosingSponsors(slideData.sponsors) },
    { kind: "partners", partners },
    { kind: "sdlcai" },
    { kind: "final" },
  ];
}
// Stryker restore all

function renderClosingSlide(slide: ClosingSlide, index: number): string {
  const activeAttribute = index === 0 ? ' data-active-slide="true"' : ' aria-hidden="true"';

  return `<section class="break-slide closing-slide closing-slide-${slide.kind}"${activeAttribute} data-break-slide data-slide-number="${index + 1}">
    ${slide.kind === "title" ? "" : renderClosingHeader()}
    ${renderClosingSlideContent(slide)}
  </section>`;
}

function renderClosingHeader(): string {
  return `<header class="slide-header">
    <img class="conference-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">
  </header>`;
}

function renderClosingSlideContent(slide: ClosingSlide): string {
  if (slide.kind === "title") {
    return `<div class="slide-content closing-title">
      <img class="opening-title-logo" src="/assets/ff26-logo.svg" alt="Future Frontend 2026">
      <p>Closing</p>
    </div>`;
  }

  if (slide.kind === "timeline") {
    return `<div class="slide-content closing-timeline">
      <p class="next-label">Four editions</p>
      <ol>${slide.editions.map(renderTimelineItem).join("")}</ol>
    </div>`;
  }

  if (slide.kind === "numbers") {
    return `<div class="slide-content closing-numbers">
      <h1>By the numbers</h1>
      <div>${slide.numbers.map(renderNumber).join("")}</div>
    </div>`;
  }

  if (slide.kind === "topic-map") {
    return `<div class="slide-content closing-topic-map">
      <p class="next-label">A conference about what came next</p>
      <h1>Early signals</h1>
      <ul>${slide.topics.map(renderTopic).join("")}</ul>
    </div>`;
  }

  if (slide.kind === "photo-grid") {
    return `<div class="slide-content closing-photos">
      <h1>${escapeHtml(slide.title)}</h1>
      <div class="closing-photo-grid">${slide.photos.map(renderPhoto).join("")}</div>
    </div>`;
  }

  if (slide.kind === "thanks") {
    return `<div class="slide-content closing-thanks">
      <p class="next-label">People made it work</p>
      <h1>Thank you</h1>
      <ul>${slide.groups.map((group) => `<li>${escapeHtml(group)}</li>`).join("")}</ul>
    </div>`;
  }

  if (slide.kind === "speakers") {
    return `<div class="slide-content closing-speakers">
      <h1>Speakers</h1>
      <div class="closing-speaker-grid">${slide.speakers.map(renderClosingSpeaker).join("")}</div>
    </div>`;
  }

  if (slide.kind === "workshop-instructors") {
    return `<div class="slide-content closing-workshop-instructors">
      <h1>Workshop instructors</h1>
      <div class="closing-workshop-instructor-grid">${slide.instructors.map(renderClosingWorkshopInstructor).join("")}</div>
    </div>`;
  }

  if (slide.kind === "organizers") {
    return `<div class="slide-content closing-organizers">
      <h1>Organizers</h1>
      <div class="closing-organizer-grid">${slide.organizers.map(renderClosingOrganizer).join("")}</div>
    </div>`;
  }

  if (slide.kind === "mcs") {
    return `<div class="slide-content closing-mcs">
      <h1>MCs</h1>
      <div class="closing-mc-grid">${slide.mcs.map(renderClosingMc).join("")}</div>
    </div>`;
  }

  if (slide.kind === "attendees") {
    return `<div class="slide-content closing-attendees">
      <h1>Attendees</h1>
      <div class="closing-attendee-visual">
        <strong>~600</strong>
        <div class="closing-attendee-grid">${Array.from({ length: slide.units }, renderAttendeeUnit).join("")}</div>
      </div>
    </div>`;
  }

  if (slide.kind === "sponsors") {
    return `<div class="slide-content closing-sponsors">
      <h1>Sponsors</h1>
      <div class="closing-sponsor-grid">${slide.sponsors.map(renderClosingSponsor).join("")}</div>
    </div>`;
  }

  if (slide.kind === "sdlcai") {
    return `<div class="slide-content closing-sdlcai">
      <h1>SDLCAI</h1>
      <div>
        <p>13 October 2026</p>
        <p>Aalto University, Espoo</p>
        <a href="https://sdlcai.org">sdlcai.org</a>
      </div>
    </div>`;
  }

  if (slide.kind === "partners") {
    return `<div class="slide-content closing-partners">
      <h1>Partners</h1>
      <div class="closing-partner-grid">${slide.partners.map(renderClosingPartner).join("")}</div>
    </div>`;
  }

  return `<div class="slide-content closing-final">
    <h1>Thanks for all the fish</h1>
  </div>`;
}

function renderTimelineItem(edition: { year: string; note: string }): string {
  return `<li>
    <time>${escapeHtml(edition.year)}</time>
    <span>${escapeHtml(edition.note)}</span>
  </li>`;
}

function renderNumber(number: { label: string; value: string }): string {
  return `<figure>
    <strong>${escapeHtml(number.value)}</strong>
    <figcaption>${escapeHtml(number.label)}</figcaption>
  </figure>`;
}

function renderClosingSponsor(sponsor: Sponsor): string {
  return `<figure class="closing-sponsor closing-sponsor-${sponsor.size}">
    <img src="${escapeHtml(toServedAssetUrl(sponsor.image))}" alt="${escapeHtml(sponsor.name)}">
  </figure>`;
}

function renderClosingSpeaker(speaker: Speaker): string {
  return `<figure class="closing-speaker">
    <img src="${escapeHtml(toServedAssetUrl(speaker.image))}" alt="${escapeHtml(speaker.name)}">
  </figure>`;
}

function renderClosingWorkshopInstructor(instructor: Speaker): string {
  return `<figure class="closing-workshop-instructor">
    <img src="${escapeHtml(toServedAssetUrl(instructor.image))}" alt="${escapeHtml(instructor.name)}">
  </figure>`;
}

function renderClosingOrganizer(organizer: Speaker): string {
  return `<figure class="closing-organizer">
    <img src="${escapeHtml(toServedAssetUrl(organizer.image))}" alt="${escapeHtml(organizer.name)}">
  </figure>`;
}

function renderClosingMc(mc: Speaker): string {
  return `<figure class="closing-mc">
    <img src="${escapeHtml(toServedAssetUrl(mc.image))}" alt="${escapeHtml(mc.name)}">
  </figure>`;
}

function renderAttendeeUnit(): string {
  return `<span class="closing-attendee-unit" aria-hidden="true"></span>`;
}

function renderClosingPartner(partner: Partner): string {
  return `<figure class="closing-partner">
    <img src="${escapeHtml(toServedAssetUrl(partner.image))}" alt="${escapeHtml(partner.name)}">
  </figure>`;
}

function buildClosingSponsors(currentSponsors: Sponsor[]): Sponsor[] {
  const sponsorsByImage = new Map<string, Sponsor>();

  for (const sponsor of [...pastSponsors, ...currentSponsors]) {
    sponsorsByImage.set(sponsor.image, sponsor);
  }

  return Array.from(sponsorsByImage.values());
}

function buildClosingSpeakers(breakSlides: BreakSlide[]): Speaker[] {
  const speakersByName = new Map<string, Speaker>();

  for (const speaker of [...pastSpeakers, ...buildCurrentSpeakers(breakSlides)]) {
    speakersByName.set(speaker.name, speaker);
  }

  return Array.from(speakersByName.values());
}

function buildClosingWorkshopInstructors(breakSlides: BreakSlide[]): Speaker[] {
  const instructorsByName = new Map<string, Speaker>();

  for (const instructor of [...workshopInstructors, ...buildCurrentWorkshopInstructors(breakSlides)]) {
    instructorsByName.set(instructor.name, instructor);
  }

  return Array.from(instructorsByName.values());
}

function buildCurrentSpeakers(breakSlides: BreakSlide[]): Speaker[] {
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

function buildCurrentWorkshopInstructors(breakSlides: BreakSlide[]): Speaker[] {
  return buildCurrentSpeakers(breakSlides.filter(isWorkshopSlide));
}

function isWorkshopSlide(slide: BreakSlide): boolean {
  return /\bworkshop\b/iu.test(slide.session);
}

function renderTopic(topic: { before: string; after: string }): string {
  return `<li>
    <span>${escapeHtml(topic.before)}</span>
    <strong>${escapeHtml(topic.after)}</strong>
  </li>`;
}

function renderPhoto(photo: Photo): string {
  return `<figure class="closing-photo">
    <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" width="1024" height="768">
    <figcaption>
      <span>${escapeHtml(photo.caption)}</span>
      <a href="${escapeHtml(photo.pageUrl)}">Flickr</a>
    </figcaption>
  </figure>`;
}

function toServedAssetUrl(path: string): string {
  const url = new URL(path, assetBaseUrl);

  if (url.hostname === "futurefrontend.com" && (url.pathname.startsWith("/img/") || url.pathname.startsWith("/assets/"))) {
    return `${url.pathname}${url.search}`;
  }

  return url.toString();
}
