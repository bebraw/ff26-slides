import { describe, expect, it } from "vitest";
import type { SlideData } from "../slide-data";
import fallbackSlideData from "../break-slides.json";
import { emptySlideData, parseSlideData } from "../slide-data";
import { renderClosingSlideDeckPage } from "./closing";

describe("renderClosingSlideDeckPage", () => {
  it("renders the closing slide deck with retrospective content", () => {
    const fallback = parseSlideData(fallbackSlideData, emptySlideData);
    const html = renderClosingSlideDeckPage({
      breakSlides: fallback.breakSlides,
      sponsors: [
        { image: "/img/custom-tech.svg", name: "Custom Tech", size: "tech" },
        { image: "/img/custom-brand.svg", name: "Custom Brand", size: "brand" },
      ],
    } satisfies SlideData);

    expect(html).toContain("Future Frontend 2026 Closing Slides");
    expect(html).toContain("Closing");
    expect(html).toContain("Four editions");
    expect(html).toContain("The last edition in this series?");
    expect(html).toContain("By the numbers");
    expect(html).toContain("32");
    expect(html).toContain("sessions");
    expect(html).toContain("13");
    expect(html).toContain("workshops");
    expect(html).toContain("16");
    expect(html).toContain("meetups");
    expect(html).toContain("65");
    expect(html).toContain("unique speakers");
    expect(html).not.toContain("themed sessions in 2026");
    expect(html).not.toContain("workshops in 2026");
    expect(html).toContain("A conference about what came next");
    expect(html).toContain("SolidJS and reactivity");
    expect(html).toContain("Qwik and resumability");
    expect(html).toContain("Frontend moved closer to users");
    expect(html).toContain("AI-first frontend work");
    expect(html).toContain("The venues");
    expect(html).toContain("Pörssitalo");
    expect(html).toContain("Paasitorni");
    expect(html).toContain("Dipoli");
    expect(html).toContain("What we remember");
    expect(html).toContain("People made it work");
    expect(getSlide(html, "closing-slide-thanks")).toContain("Organizers");
    expect(html).toContain("Speakers");
    expect(html).toContain('src="/img/samuel.webp"');
    expect(html).toContain('alt="Samuel Macleod"');
    expect(html).toContain('src="/img/pasi.webp"');
    expect(html).toContain('alt="Pasi Sillanpää"');
    expect(html).toContain('src="/img/rachel.webp"');
    expect(html).toContain('alt="Rachel-Lee Nabors"');
    expect(html.match(/class="closing-speaker"/g)).toHaveLength(64);
    expect(getSlide(html, "closing-slide-speakers")).not.toContain("<figcaption>");
    expect(html).toContain("Workshop instructors");
    expect(html).toContain('src="/img/joonas-p.webp"');
    expect(html).toContain('alt="Joonas Pajunen"');
    expect(html).toContain('src="/img/ohans.webp"');
    expect(html).toContain('alt="Ohans Emmanuel"');
    expect(html.match(/class="closing-workshop-instructor"/g)).toHaveLength(14);
    expect(getSlide(html, "closing-slide-workshop-instructors")).not.toContain("<figcaption>");
    expect(html).toContain("Organizers");
    expect(html).toContain('src="/img/eemeli.webp"');
    expect(html).toContain('alt="Eemeli Aro"');
    expect(html).toContain('src="/img/tuuli.webp"');
    expect(html).toContain('alt="Tuuli Tiilikainen"');
    expect(html.match(/class="closing-organizer"/g)).toHaveLength(9);
    expect(getSlide(html, "closing-slide-organizers")).not.toContain("<figcaption>");
    expect(html).toContain("MCs");
    expect(html).toContain('src="/img/jani.webp"');
    expect(html).toContain('alt="Jani Eväkallio"');
    expect(html).toContain('src="/img/daniel.webp"');
    expect(html).toContain('alt="Daniel Yuschick"');
    expect(html).toContain('src="/img/henrik.webp"');
    expect(html).toContain('alt="Henrik Rinne"');
    expect(html.match(/class="closing-mc"/g)).toHaveLength(4);
    expect(getSlide(html, "closing-slide-mcs")).not.toContain("<figcaption>");
    expect(html).toContain("Attendees");
    expect(html).toContain("~600");
    expect(html.match(/class="closing-attendee-unit"/g)).toHaveLength(600);
    expect(html).toContain("Sponsors");
    const sponsorsSection = getSlide(html, "closing-slide-sponsors");
    expect(html).toContain('src="/img/gofore.svg"');
    expect(html).toContain('alt="Gofore"');
    expect(html).toContain('src="/img/digia.svg"');
    expect(html).toContain('alt="Digia"');
    expect(html).toContain('src="/img/smartly.svg"');
    expect(html).toContain('alt="Smartly"');
    expect(sponsorsSection).not.toContain("/img/koodiasuomesta.svg");
    expect(sponsorsSection).not.toContain("/img/reactnorway.svg");
    expect(html).toContain('src="/img/custom-tech.svg"');
    expect(html).toContain('alt="Custom Tech"');
    expect(html).toContain('src="/img/custom-brand.svg"');
    expect(html).toContain('alt="Custom Brand"');
    expect(html).toContain("closing-sponsor-tech");
    expect(html).toContain("closing-sponsor-brand");
    expect(html.match(/class="closing-sponsor /g)).toHaveLength(15);
    expect(html).toContain("<h1>SDLCAI</h1>");
    expect(html).toContain("13 October 2026");
    expect(html).toContain("Aalto University, Espoo");
    expect(html).toContain('<a href="https://sdlcai.org">sdlcai.org</a>');
    expect(html).not.toContain("AI meets SDLC");
    expect(html).not.toContain("Marsio Saastamoinen Foundation Stage");
    expect(html).toContain("Partners");
    expect(html).toContain('src="/img/koodiasuomesta.svg"');
    expect(html).toContain('alt="Koodia Suomesta"');
    expect(html).toContain('src="/img/mastra.svg"');
    expect(html).toContain('alt="Mastra"');
    expect(html).toContain('src="/img/nodecongress.webp"');
    expect(html.match(/class="closing-partner"/g)).toHaveLength(32);
    expect(html).not.toContain("A one-day seminar");
    expect(html).not.toContain("software development lifecycle");
    expect(html).not.toContain("The archives stay open");
    expect(html).not.toContain("futurefrontend.com/2023/");
    expect(html).toContain("Thanks for all the fish");
    expect(html).toContain("/assets/ff26-logo.svg");
    expect(html).toContain('type="module" src="/slides.js"');
    expect(html).toContain('rel="stylesheet" href="/styles.css"');
    expect(html).toContain(
      '<section class="break-slide closing-slide closing-slide-title" data-active-slide="true" data-break-slide data-slide-number="1">',
    );
    expect(html).toContain("https://www.flickr.com/photos/react-finland/52968689745/");
    expect(html).toContain("https://live.staticflickr.com/65535/53829874388_e04b19403b_b.jpg");
    expect(html).toContain("https://live.staticflickr.com/65535/53829874418_0c719442d3_b.jpg");
    expect(html).toContain("https://live.staticflickr.com/65535/54581976568_8b15a4821c_b.jpg");
    expect(html).toContain("https://www.flickr.com/photos/react-finland/54582055640/");
    expect(html).toContain("https://live.staticflickr.com/65535/54582055640_e348f04483_b.jpg");
    expect(html).not.toContain("Stryker was here!");
    expect(html.match(/data-break-slide/g)).toHaveLength(16);
    expect(html.match(/<section class="break-slide closing-slide[^>]+aria-hidden="true"/g)).toHaveLength(15);
  });
});

function getSlide(html: string, className: string): string {
  const start = html.indexOf(className);
  expect(start).toBeGreaterThanOrEqual(0);

  const nextSlide = html.indexOf('<section class="break-slide', start + className.length);
  const end = nextSlide === -1 ? html.indexOf("</main>", start) : nextSlide;
  expect(end).toBeGreaterThan(start);

  return html.slice(start, end);
}
