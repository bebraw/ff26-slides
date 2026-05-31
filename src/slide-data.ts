import type { BreakSlide, Speaker, Sponsor, Talk } from "./break-slide-types";

export type SlideData = {
  breakSlides: BreakSlide[];
  sponsors: Sponsor[];
};

export const emptySlideData: SlideData = { breakSlides: [], sponsors: [] };

export function parseSlideData(value: unknown, fallback: SlideData): SlideData {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;

  if (!isRecord(parsed) || !Array.isArray(parsed.breakSlides) || !Array.isArray(parsed.sponsors)) {
    return fallback;
  }

  if (!parsed.breakSlides.every(isBreakSlide) || !parsed.sponsors.every(isSponsor)) {
    return fallback;
  }

  return {
    breakSlides: parsed.breakSlides,
    sponsors: parsed.sponsors,
  };
}

function isBreakSlide(value: unknown): value is BreakSlide {
  if (!isRecord(value) || typeof value.day !== "string" || typeof value.time !== "string" || typeof value.session !== "string") {
    return false;
  }

  if (value.label !== undefined && typeof value.label !== "string") {
    return false;
  }

  return value.talks === undefined || (Array.isArray(value.talks) && value.talks.every(isTalk));
}

function isTalk(value: unknown): value is Talk {
  return isRecord(value) && typeof value.title === "string" && Array.isArray(value.speakers) && value.speakers.every(isSpeaker);
}

function isSpeaker(value: unknown): value is Speaker {
  return isRecord(value) && typeof value.name === "string" && typeof value.image === "string";
}

function isSponsor(value: unknown): value is Sponsor {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.image === "string" &&
    (value.size === "tech" || value.size === "brand")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
