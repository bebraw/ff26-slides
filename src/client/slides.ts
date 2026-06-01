const slideSelector = "[data-break-slide]";
const activeAttribute = "data-active-slide";
const minimumSwipeDistance = 48;
const minimumSwipeRatio = 1.5;

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
  let touchStart: TouchPoint | undefined;

  showSlide(slides, currentIndex);

  const navigate = (direction: -1 | 1): void => {
    currentIndex = clamp(currentIndex + direction, 0, slides.length - 1);
    showSlide(slides, currentIndex);
    persistSlide(windowRef, currentIndex);
  };

  documentRef.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      navigate(1);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "PageUp" || event.key === "Backspace") {
      event.preventDefault();
      navigate(-1);
    }
  });

  documentRef.addEventListener("touchstart", (event) => {
    touchStart = getTouchPoint(event);
  });

  documentRef.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart) {
        return;
      }

      const touchEnd = getTouchPoint(event);
      const swipe = touchEnd ? getHorizontalSwipe(touchStart, touchEnd) : undefined;
      touchStart = undefined;

      if (!swipe) {
        return;
      }

      event.preventDefault();
      navigate(swipe === "left" ? 1 : -1);
    },
    { passive: false },
  );
}

type TouchPoint = {
  x: number;
  y: number;
};

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

function getTouchPoint(event: TouchEvent): TouchPoint | undefined {
  const touch = event.changedTouches[0];

  if (!touch) {
    return undefined;
  }

  return { x: touch.clientX, y: touch.clientY };
}

function getHorizontalSwipe(start: TouchPoint, end: TouchPoint): "left" | "right" | undefined {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  if (Math.abs(deltaX) < minimumSwipeDistance || Math.abs(deltaX) < Math.abs(deltaY) * minimumSwipeRatio) {
    return undefined;
  }

  return deltaX < 0 ? "left" : "right";
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}
