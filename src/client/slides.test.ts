import { afterEach, describe, expect, it, vi } from "vitest";
import { initializeSlides } from "./slides";

type CapturedKeyHandler = (event: KeyboardEvent) => void;

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
    expect(handler.document.addEventListener).toHaveBeenCalledOnce();
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
    expect(handler.current).toBeTypeOf("function");

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
    current: CapturedKeyHandler | undefined;
    document: Pick<Document, "addEventListener" | "querySelectorAll">;
    window: Parameters<typeof initializeSlides>[1];
  };
  history: Pick<History, "replaceState"> & { replaceState: ReturnType<typeof vi.fn> };
  slides: FakeSlide[];
  trigger: (key: string, modifiers?: Partial<KeyboardEvent>) => KeyboardEvent & { preventDefault: ReturnType<typeof vi.fn> };
} {
  const location = new URL(href) as unknown as Location;
  const history = {
    replaceState: vi.fn((_state: object, _unused: string, url: URL) => {
      location.href = url.href;
    }),
  };
  const handler: {
    current: CapturedKeyHandler | undefined;
    document: Pick<Document, "addEventListener" | "querySelectorAll">;
    window: Parameters<typeof initializeSlides>[1];
  } = {
    current: undefined,
    document: {
      querySelectorAll: vi.fn(() => slides as unknown as NodeListOf<HTMLElement>),
      addEventListener: vi.fn((event: string, listener: EventListenerOrEventListenerObject) => {
        if (event === "keydown" && typeof listener === "function") {
          handler.current = listener as CapturedKeyHandler;
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

      handler.current?.(event);

      return event;
    },
  };
}
