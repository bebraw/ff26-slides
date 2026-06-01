import { describe, expect, it } from "vitest";
import { renderClosingSlideDeckPage } from "./closing";

describe("renderClosingSlideDeckPage", () => {
  it("renders the closing slide deck with retrospective content", () => {
    const html = renderClosingSlideDeckPage();

    expect(html).toContain("Future Frontend 2026 Closing Slides");
    expect(html).toContain("Closing");
    expect(html).toContain("Four editions");
    expect(html).toContain("The last edition in this series");
    expect(html).toContain("By the numbers");
    expect(html).toContain("32");
    expect(html).toContain("sessions");
    expect(html).toContain("13");
    expect(html).toContain("workshops");
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
    expect(html).toContain("AI meets SDLC");
    expect(html).toContain("13 October 2026");
    expect(html).toContain("Marsio Saastamoinen Foundation Stage");
    expect(html).toContain("Aalto University, Espoo");
    expect(html).toContain("sdlcai.org");
    expect(html).not.toContain("A one-day seminar");
    expect(html).not.toContain("software development lifecycle");
    expect(html).not.toContain("The archives stay open");
    expect(html).not.toContain("futurefrontend.com/2023/");
    expect(html).toContain("Thanks for the fish");
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
    expect(html.match(/data-break-slide/g)).toHaveLength(9);
    expect(html.match(/aria-hidden="true"/g)).toHaveLength(8);
  });
});
