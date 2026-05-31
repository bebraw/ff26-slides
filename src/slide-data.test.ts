import { describe, expect, it } from "vitest";
import fallbackSlideData from "./break-slides.json";
import { emptySlideData, parseSlideData } from "./slide-data";

describe("parseSlideData", () => {
  it("accepts fallback JSON slide data", () => {
    const slideData = parseSlideData(fallbackSlideData, emptySlideData);

    expect(slideData.breakSlides[0]?.session).toBe("Conference registration");
    expect(slideData.sponsors[0]?.size).toBe("tech");
  });

  it("accepts stringified slide data", () => {
    const slideData = parseSlideData(
      JSON.stringify({
        breakSlides: [{ day: "Monday, 8 June", time: "09:00-09:15", session: "Welcome", label: "Opening" }],
        sponsors: [{ name: "Sponsor", image: "/img/sponsor.svg", size: "brand" }],
      }),
      emptySlideData,
    );

    expect(slideData.breakSlides[0]).toMatchObject({ label: "Opening", session: "Welcome" });
    expect(slideData.sponsors[0]?.size).toBe("brand");
  });

  it("returns fallback data for invalid slide payloads", () => {
    const fallback = {
      breakSlides: [{ day: "Fallback day", time: "00:00", session: "Fallback session" }],
      sponsors: [],
    };

    expect(parseSlideData(null, fallback)).toBe(fallback);
    expect(parseSlideData({ breakSlides: "invalid", sponsors: [] }, fallback)).toBe(fallback);
    expect(parseSlideData({ breakSlides: [{ day: "Monday", time: "09:00", session: "Welcome", label: 42 }], sponsors: [] }, fallback)).toBe(
      fallback,
    );
    expect(
      parseSlideData(
        {
          breakSlides: [{ day: "Monday", time: "09:00", session: "Talks", talks: [{ title: "Talk", speakers: [{ name: "A" }] }] }],
          sponsors: [],
        },
        fallback,
      ),
    ).toBe(fallback);
    expect(parseSlideData({ breakSlides: [], sponsors: [{ name: "Sponsor", image: "/img/sponsor.svg", size: "gold" }] }, fallback)).toBe(
      fallback,
    );
  });
});
