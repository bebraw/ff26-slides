import { afterEach, describe, expect, it, vi } from "vitest";
import { initializeSlides } from "./slides";

type CapturedKeyHandler = (event: KeyboardEvent) => void;
type CapturedTouchHandler = (event: TouchEvent) => void;

class FakeSlide {
  readonly attributes = new Map<string, string>();

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }
}

describe("initializeSlides", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("boots automatically in a browser-like runtime", async () => {
    vi.resetModules();
    const { handler, slides } = createBrowserHarness([new FakeSlide()], "http://deck.test/");

    vi.stubGlobal("document", handler.document);
    vi.stubGlobal("window", handler.window);

    await import("./slides");

    expect(slides[0]?.attributes.get("data-active-slide")).toBe("true");
    expect(handler.document.addEventListener).toHaveBeenCalledTimes(3);
  });

  it("activates the query-selected slide and persists keyboard navigation", () => {
    const { handler, history, slides, trigger } = createBrowserHarness(
      [new FakeSlide(), new FakeSlide(), new FakeSlide()],
      "http://deck.test/?slide=2",
    );

    initializeSlides(handler.document, handler.window);

    expect(slides[0]?.attributes.get("aria-hidden")).toBe("true");
    expect(slides[1]?.attributes.get("data-active-slide")).toBe("true");
    expect(slides[2]?.attributes.get("aria-hidden")).toBe("true");
    expect(handler.handlers.keydown).toBeTypeOf("function");

    const nextEvent = trigger("ArrowRight");

    expect(nextEvent.preventDefault).toHaveBeenCalledOnce();
    expect(slides[1]?.attributes.get("aria-hidden")).toBe("true");
    expect(slides[2]?.attributes.get("data-active-slide")).toBe("true");
    expect(history.replaceState).toHaveBeenLastCalledWith({}, "", new URL("http://deck.test/?slide=3"));

    const previousEvent = trigger("ArrowLeft");

    expect(previousEvent.preventDefault).toHaveBeenCalledOnce();
    expect(slides[1]?.attributes.get("data-active-slide")).toBe("true");
    expect(history.replaceState).toHaveBeenLastCalledWith({}, "", new URL("http://deck.test/?slide=2"));
  });

  it("persists touch swipe navigation", () => {
    const { handler, history, slides, triggerTouchEnd, triggerTouchStart } = createBrowserHarness(
      [new FakeSlide(), new FakeSlide(), new FakeSlide()],
      "http://deck.test/?slide=2",
    );

    initializeSlides(handler.document, handler.window);

    triggerTouchStart({ x: 240, y: 120 });
    const nextEvent = triggerTouchEnd({ x: 120, y: 124 });

    expect(nextEvent.preventDefault).toHaveBeenCalledOnce();
    expect(slides[2]?.attributes.get("data-active-slide")).toBe("true");
    expect(history.replaceState).toHaveBeenLastCalledWith({}, "", new URL("http://deck.test/?slide=3"));

    triggerTouchStart({ x: 120, y: 120 });
    const previousEvent = triggerTouchEnd({ x: 220, y: 118 });

    expect(previousEvent.preventDefault).toHaveBeenCalledOnce();
    expect(slides[1]?.attributes.get("data-active-slide")).toBe("true");
    expect(history.replaceState).toHaveBeenLastCalledWith({}, "", new URL("http://deck.test/?slide=2"));
  });

  it("ignores vertical or short touch movement", () => {
    const { handler, history, slides, triggerTouchEnd, triggerTouchStart } = createBrowserHarness(
      [new FakeSlide(), new FakeSlide()],
      "http://deck.test/",
    );

    initializeSlides(handler.document, handler.window);

    triggerTouchStart({ x: 100, y: 100 });
    const verticalEvent = triggerTouchEnd({ x: 130, y: 180 });

    expect(verticalEvent.preventDefault).not.toHaveBeenCalled();
    expect(history.replaceState).not.toHaveBeenCalled();
    expect(slides[0]?.attributes.get("data-active-slide")).toBe("true");

    triggerTouchStart({ x: 100, y: 100 });
    const shortEvent = triggerTouchEnd({ x: 60, y: 100 });

    expect(shortEvent.preventDefault).not.toHaveBeenCalled();
    expect(history.replaceState).not.toHaveBeenCalled();
    expect(slides[0]?.attributes.get("data-active-slide")).toBe("true");
  });

  it("clamps invalid query parameters and ignores modified key presses", () => {
    const { handler, history, slides, trigger } = createBrowserHarness([new FakeSlide(), new FakeSlide()], "http://deck.test/?slide=200");

    initializeSlides(handler.document, handler.window);

    expect(slides[1]?.attributes.get("data-active-slide")).toBe("true");

    const modifiedEvent = trigger("ArrowLeft", { metaKey: true });

    expect(modifiedEvent.preventDefault).not.toHaveBeenCalled();
    expect(history.replaceState).not.toHaveBeenCalled();
    expect(slides[1]?.attributes.get("data-active-slide")).toBe("true");
  });

  it("falls back to the first slide when the query parameter is invalid", () => {
    const { handler, slides } = createBrowserHarness([new FakeSlide(), new FakeSlide()], "http://deck.test/?slide=nope");

    initializeSlides(handler.document, handler.window);

    expect(slides[0]?.attributes.get("data-active-slide")).toBe("true");
    expect(slides[1]?.attributes.get("aria-hidden")).toBe("true");
  });

  it("does not register navigation when there are no slides", () => {
    const { handler } = createBrowserHarness([], "http://deck.test/");

    initializeSlides(handler.document, handler.window);

    expect(handler.document.addEventListener).not.toHaveBeenCalled();
  });
});

function createBrowserHarness(
  slides: FakeSlide[],
  href: string,
): {
  handler: {
    handlers: {
      keydown: CapturedKeyHandler | undefined;
      touchend: CapturedTouchHandler | undefined;
      touchstart: CapturedTouchHandler | undefined;
    };
    document: Pick<Document, "addEventListener" | "querySelectorAll">;
    window: Parameters<typeof initializeSlides>[1];
  };
  history: Pick<History, "replaceState"> & { replaceState: ReturnType<typeof vi.fn> };
  slides: FakeSlide[];
  trigger: (key: string, modifiers?: Partial<KeyboardEvent>) => KeyboardEvent & { preventDefault: ReturnType<typeof vi.fn> };
  triggerTouchEnd: (point: TouchPoint) => TouchEvent & { preventDefault: ReturnType<typeof vi.fn> };
  triggerTouchStart: (point: TouchPoint) => TouchEvent & { preventDefault: ReturnType<typeof vi.fn> };
} {
  const location = new URL(href) as unknown as Location;
  const history = {
    replaceState: vi.fn((_state: object, _unused: string, url: URL) => {
      location.href = url.href;
    }),
  };
  const handler: {
    handlers: {
      keydown: CapturedKeyHandler | undefined;
      touchend: CapturedTouchHandler | undefined;
      touchstart: CapturedTouchHandler | undefined;
    };
    document: Pick<Document, "addEventListener" | "querySelectorAll">;
    window: Parameters<typeof initializeSlides>[1];
  } = {
    handlers: {
      keydown: undefined,
      touchend: undefined,
      touchstart: undefined,
    },
    document: {
      querySelectorAll: vi.fn(() => slides as unknown as NodeListOf<HTMLElement>),
      addEventListener: vi.fn((event: string, listener: EventListenerOrEventListenerObject) => {
        if (event === "keydown" && typeof listener === "function") {
          handler.handlers.keydown = listener as CapturedKeyHandler;
        }

        if (event === "touchstart" && typeof listener === "function") {
          handler.handlers.touchstart = listener as CapturedTouchHandler;
        }

        if (event === "touchend" && typeof listener === "function") {
          handler.handlers.touchend = listener as CapturedTouchHandler;
        }
      }),
    },
    window: { history, location },
  };

  return {
    handler,
    history,
    slides,
    trigger(key: string, modifiers: Partial<KeyboardEvent> = {}) {
      const event = {
        altKey: false,
        ctrlKey: false,
        key,
        metaKey: false,
        preventDefault: vi.fn(),
        shiftKey: false,
        ...modifiers,
      } as KeyboardEvent & { preventDefault: ReturnType<typeof vi.fn> };

      handler.handlers.keydown?.(event);

      return event;
    },
    triggerTouchEnd(point: TouchPoint) {
      const event = createTouchEvent(point);

      handler.handlers.touchend?.(event);

      return event;
    },
    triggerTouchStart(point: TouchPoint) {
      const event = createTouchEvent(point);

      handler.handlers.touchstart?.(event);

      return event;
    },
  };
}

type TouchPoint = {
  x: number;
  y: number;
};

function createTouchEvent(point: TouchPoint): TouchEvent & { preventDefault: ReturnType<typeof vi.fn> } {
  return {
    changedTouches: [{ clientX: point.x, clientY: point.y }] as unknown as TouchList,
    preventDefault: vi.fn(),
  } as TouchEvent & { preventDefault: ReturnType<typeof vi.fn> };
}
