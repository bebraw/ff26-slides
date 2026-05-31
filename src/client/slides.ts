const slideSelector = "[data-break-slide]";
const activeAttribute = "data-active-slide";

type SlideWindow = {
  history: Pick<History, "replaceState">;
  location: Pick<Location, "href" | "search">;
};

// Stryker disable next-line ConditionalExpression,EqualityOperator,LogicalOperator,BlockStatement: Browser-only bootstrap is covered by e2e; unit tests exercise initializeSlides directly.
if (typeof document !== "undefined" && typeof window !== "undefined") {
  initializeSlides(document, window);
}

export function initializeSlides(documentRef: Pick<Document, "addEventListener" | "querySelectorAll">, windowRef: SlideWindow): void {
  const slides = Array.from(documentRef.querySelectorAll<HTMLElement>(slideSelector));

  if (slides.length === 0) {
    return;
  }

  let currentIndex = getInitialIndex(windowRef, slides.length);

  showSlide(slides, currentIndex);

  documentRef.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      currentIndex = Math.min(currentIndex + 1, slides.length - 1);
      showSlide(slides, currentIndex);
      persistSlide(windowRef, currentIndex);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "PageUp" || event.key === "Backspace") {
      event.preventDefault();
      currentIndex = Math.max(currentIndex - 1, 0);
      showSlide(slides, currentIndex);
      persistSlide(windowRef, currentIndex);
    }
  });
}

function getInitialIndex(windowRef: Pick<SlideWindow, "location">, slideCount: number): number {
  const params = new URLSearchParams(windowRef.location.search);
  const slideNumber = Number(params.get("slide"));

  if (!Number.isInteger(slideNumber)) {
    return 0;
  }

  return clamp(slideNumber - 1, 0, slideCount - 1);
}

function showSlide(slides: HTMLElement[], index: number): void {
  for (const [slideIndex, slide] of slides.entries()) {
    if (slideIndex === index) {
      slide.setAttribute(activeAttribute, "true");
      slide.removeAttribute("aria-hidden");
      continue;
    }

    slide.removeAttribute(activeAttribute);
    slide.setAttribute("aria-hidden", "true");
  }
}

function persistSlide(windowRef: SlideWindow, index: number): void {
  const url = new URL(windowRef.location.href);
  url.searchParams.set("slide", String(index + 1));
  windowRef.history.replaceState({}, "", url);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}
