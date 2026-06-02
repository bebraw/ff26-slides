import { expect, test } from "@playwright/test";

test("renders the index page", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "Future Frontend 2026" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Slides Future Frontend 2026 break slide deck/u })).toBeVisible();
  await expect(page.getByRole("link", { name: /Opening Future Frontend 2026 opening slide deck/u })).toBeVisible();
  await expect(page.getByRole("link", { name: /Closing Future Frontend 2026 closing slide deck/u })).toBeVisible();
  await expect(page.getByRole("link", { name: /Schedule Printable daily conference schedules/u })).toBeVisible();
  await expect(page.getByRole("link", { name: /Speaker check-in Printable daily speaker check-in sheets/u })).toBeVisible();
});

test("renders the break slide deck", async ({ page }) => {
  await page.goto("/slides", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "FF26 – Day 1 (8.6.26)" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"]').locator(".next-label")).toHaveCount(0);
  await page.goto("/slides?slide=4", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Designing futures" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"]').getByText("Pasi Sillanpää")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/slide=5/);
  await expect(page.getByRole("heading", { level: 1, name: "We Don't Have an Idea Problem. We Have a Permission Problem." })).toBeVisible();
});

test("renders the opening slide deck", async ({ page }) => {
  await page.goto("/opening", { waitUntil: "domcontentloaded" });

  await expect(page.locator('[data-active-slide="true"] .opening-title-logo')).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/slide=2/);
  await expect(page.getByRole("heading", { level: 1, name: "Welcome to Future Frontend 2026" })).toBeVisible();
  await page.goto("/opening?slide=8", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "18 speakers" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"] .opening-speaker')).toHaveCount(18);
  const speakerGridLayout = await page.locator('[data-active-slide="true"] .opening-speaker-grid').evaluate((grid) => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const boxes = Array.from(grid.querySelectorAll("img")).map((image) => {
      const box = image.getBoundingClientRect();

      return {
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        left: box.left,
      };
    });

    return boxes.filter(
      (box) => box.top < -0.5 || box.left < -0.5 || box.right > viewport.width + 0.5 || box.bottom > viewport.height + 0.5,
    );
  });
  expect(speakerGridLayout).toEqual([]);

  await page.goto("/opening?slide=11", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Schedule" })).toBeVisible();

  const scheduleRows = await page.locator('[data-active-slide="true"] .opening-day li').evaluateAll((rows) =>
    rows.map((row) => {
      const time = row.querySelector("time");
      const title = row.querySelector("span");

      if (!time || !title) {
        throw new Error("Schedule row is missing time or title");
      }

      const timeBox = time.getBoundingClientRect();
      const titleBox = title.getBoundingClientRect();

      return {
        fontFamily: window.getComputedStyle(time).fontFamily,
        timeClientWidth: time.clientWidth,
        timeRight: timeBox.right,
        timeScrollWidth: time.scrollWidth,
        titleLeft: titleBox.left,
      };
    }),
  );

  for (const row of scheduleRows) {
    expect(row.fontFamily.toLowerCase()).toContain("mono");
    expect(row.timeScrollWidth).toBeLessThanOrEqual(row.timeClientWidth);
    expect(row.timeRight).toBeLessThanOrEqual(row.titleLeft);
  }

  await page.goto("/opening?slide=14", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Meetups" })).toBeVisible();
  await expect(page.getByText("Vibe Coding Finland")).toBeVisible();

  const meetupRows = await page.locator('[data-active-slide="true"] .opening-meetups li').evaluateAll((rows) =>
    rows.map((row) => {
      const time = row.querySelector("time");
      const title = row.querySelector("span");

      if (!time || !title) {
        throw new Error("Meetup row is missing time or title");
      }

      const timeBox = time.getBoundingClientRect();
      const titleBox = title.getBoundingClientRect();

      return {
        fontFamily: window.getComputedStyle(time).fontFamily,
        timeRight: timeBox.right,
        titleLeft: titleBox.left,
      };
    }),
  );

  for (const row of meetupRows) {
    expect(row.fontFamily.toLowerCase()).toContain("mono");
    expect(row.timeRight).toBeLessThanOrEqual(row.titleLeft);
  }
});

test("renders the closing slide deck", async ({ page }) => {
  await page.goto("/closing", { waitUntil: "domcontentloaded" });

  await expect(page.locator('[data-active-slide="true"] .opening-title-logo')).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/slide=2/);
  await expect(page.getByText("The last edition in this series")).toBeVisible();
  await page.goto("/closing?slide=4", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Early signals" })).toBeVisible();
  await expect(page.getByText("SolidJS and reactivity")).toBeVisible();
  await expect(page.getByText("AI-first frontend work")).toBeVisible();
  await page.goto("/closing?slide=8", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Speakers" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"] .closing-speaker')).toHaveCount(64);
  await page.goto("/closing?slide=9", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Workshop instructors" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"] .closing-workshop-instructor')).toHaveCount(14);
  await page.goto("/closing?slide=10", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Organizers" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"] .closing-organizer')).toHaveCount(9);
  await page.goto("/closing?slide=11", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "MCs" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"] .closing-mc')).toHaveCount(4);
  await page.goto("/closing?slide=12", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Attendees" })).toBeVisible();
  await expect(page.getByText("~600")).toBeVisible();
  await expect(page.locator('[data-active-slide="true"] .closing-attendee-unit')).toHaveCount(600);
  await page.goto("/closing?slide=13", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Sponsors" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"] .closing-sponsor')).toHaveCount(15);
  await page.goto("/closing?slide=14", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Partners" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"] .closing-partner')).toHaveCount(32);
  await page.goto("/closing?slide=15", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "SDLCAI" })).toBeVisible();
  await expect(page.getByText("13 October 2026")).toBeVisible();
  await expect(page.getByText("Aalto University, Espoo")).toBeVisible();
  await expect(page.getByRole("link", { name: "sdlcai.org" })).toHaveAttribute("href", "https://sdlcai.org");
});

test("keeps individual talk slides inside the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1178 });
  await page.goto("/slides", { waitUntil: "domcontentloaded" });

  const slideCount = await page.locator("[data-break-slide]").count();

  for (let slideNumber = 1; slideNumber <= slideCount; slideNumber += 1) {
    await page.goto(`/slides?slide=${slideNumber}`, { waitUntil: "domcontentloaded" });

    const activeSlide = page.locator('[data-active-slide="true"]');
    const className = await activeSlide.getAttribute("class");

    if (!className?.includes("talk-slide")) {
      continue;
    }

    await expect(activeSlide.locator("h1")).toBeVisible();
    await expect(activeSlide.locator(".talk-slide-speakers")).toBeVisible();

    const geometry = await activeSlide.evaluate((slide) => {
      const title = slide.querySelector("h1");
      const speakers = slide.querySelector(".talk-slide-speakers");
      const footer = slide.querySelector(".sponsor-strip");

      if (!title || !speakers || !footer) {
        throw new Error("Talk slide is missing required layout elements");
      }

      const titleBox = title.getBoundingClientRect();
      const speakersBox = speakers.getBoundingClientRect();
      const footerBox = footer.getBoundingClientRect();

      return {
        footerTop: footerBox.top,
        speakersBottom: speakersBox.bottom,
        titleBottom: titleBox.bottom,
        titleRight: titleBox.right,
        speakersLeft: speakersBox.left,
      };
    });

    expect(geometry.titleBottom).toBeLessThanOrEqual(geometry.footerTop);
    expect(geometry.speakersBottom).toBeLessThanOrEqual(geometry.footerTop);
    expect(geometry.titleRight).toBeLessThanOrEqual(geometry.speakersLeft);
  }
});

test("keeps the slide deck inside a compact iPad viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 600 });
  await page.goto("/slides", { waitUntil: "domcontentloaded" });

  const slideCount = await page.locator("[data-break-slide]").count();

  for (let slideNumber = 1; slideNumber <= slideCount; slideNumber += 1) {
    await page.goto(`/slides?slide=${slideNumber}`, { waitUntil: "domcontentloaded" });

    const activeSlide = page.locator('[data-active-slide="true"]');
    const layout = await activeSlide.evaluate((slide) => {
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const trackedElements = Array.from(
        slide.querySelectorAll<HTMLElement>("h1,.talk-slide-speakers,.talk-grid,.sponsor-strip,.slide-header"),
      );
      const content = slide.querySelector<HTMLElement>(".slide-content,.talk-slide-content")?.getBoundingClientRect();
      const footer = slide.querySelector<HTMLElement>(".sponsor-strip")?.getBoundingClientRect();

      return {
        offscreenElements: trackedElements
          .map((element) => {
            const box = element.getBoundingClientRect();

            return {
              className: element.className,
              top: box.top,
              right: box.right,
              bottom: box.bottom,
              left: box.left,
            };
          })
          .filter((box) => box.top < -0.5 || box.left < -0.5 || box.right > viewport.width + 0.5 || box.bottom > viewport.height + 0.5),
        footerOverlap: content && footer ? content.bottom > footer.top + 0.5 : false,
      };
    });

    expect(layout.offscreenElements, `slide ${slideNumber} should stay inside the viewport`).toEqual([]);
    expect(layout.footerOverlap, `slide ${slideNumber} content should stay above sponsors`).toBe(false);
  }
});

test("serves the health endpoint", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toEqual({
    ok: true,
    name: "vibe-template-worker",
    routes: ["/", "/slides", "/opening", "/closing", "/schedule", "/speaker-checkin", "/api/health", "/slides.js"],
  });
});

test("renders printable daily schedules with slide navigation", async ({ page }) => {
  await page.goto("/schedule", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "Monday, 8 June" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"]').getByText("Conference registration")).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/slide=2/);
  await expect(page.getByRole("heading", { level: 1, name: "Tuesday, 9 June" })).toBeVisible();

  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".schedule-sheet")).toHaveCount(4);
  await expect(page.locator(".schedule-sheet").nth(2).locator("h1")).toContainText(/Wednesday,? 10 June/u);
  await expect(page.locator(".schedule-sheet").nth(2)).toBeVisible();
});

test("renders printable speaker check-in sheets with slide navigation", async ({ page }) => {
  await page.goto("/speaker-checkin", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "Monday, 8 June" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"]').getByText("Pasi Sillanpää")).toBeVisible();
  await expect(page.locator('[data-active-slide="true"]').getByLabel("Arrived").first()).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/slide=2/);
  await expect(page.getByRole("heading", { level: 1, name: "Tuesday, 9 June" })).toBeVisible();

  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".checkin-sheet")).toHaveCount(2);
  await expect(page.locator(".checkin-sheet").nth(1).locator("h1")).toContainText("Tuesday, 9 June");
  await expect(page.locator(".checkin-sheet").nth(1)).toBeVisible();
});

test("serves the generated stylesheet", async ({ request }) => {
  const response = await request.get("/styles.css");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("text/css");
  const stylesheet = await response.text();
  expect(stylesheet).toContain("--color-app-canvas:#f3eee6");
  expect(stylesheet).toContain("@page{size:16in 10in;margin:0}");
  expect(stylesheet).toContain("@page schedule-sheet{size:A4 portrait;margin:12mm}");
});
