import { escapeHtml } from "./shared";

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

export function renderClosingSlideDeckPage(): string {
  const renderedSlides = buildClosingSlides()
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
function buildClosingSlides(): ClosingSlide[] {
  return [
    { kind: "title" },
    {
      kind: "timeline",
      editions: [
        { year: "2023", note: "The first Future Frontend" },
        { year: "2024", note: "The conversation widened" },
        { year: "2025", note: "The future got closer" },
        { year: "2026", note: "The last edition in this series" },
      ],
    },
    {
      kind: "numbers",
      numbers: [
        { value: "4", label: "editions" },
        { value: "8", label: "conference days" },
        { value: "32", label: "sessions" },
        { value: "13", label: "workshops" },
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
      groups: ["Speakers", "Workshop instructors", "Attendees", "Sponsors", "Partners", "Volunteers", "MCs"],
    },
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

  if (slide.kind === "sdlcai") {
    return `<div class="slide-content closing-sdlcai">
      <p class="next-label">What continues</p>
      <h1>AI meets SDLC</h1>
      <div>
        <p>13 October 2026</p>
        <p>Marsio Saastamoinen Foundation Stage</p>
        <p>Aalto University, Espoo</p>
      </div>
      <strong>sdlcai.org</strong>
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
