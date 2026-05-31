import { expect, test } from "@playwright/test";

test("renders the break slide deck", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "Conference registration" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"]').locator(".next-label")).toHaveCount(0);
  await page.goto("/?slide=3", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Designing futures" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"]').getByText("Pasi Sillanpää")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/slide=4/);
  await expect(page.getByRole("heading", { level: 1, name: "We Don't Have an Idea Problem. We Have a Permission Problem." })).toBeVisible();
});

test("keeps individual talk slides inside the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1178 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const slideCount = await page.locator("[data-break-slide]").count();

  for (let slideNumber = 1; slideNumber <= slideCount; slideNumber += 1) {
    await page.goto(`/?slide=${slideNumber}`, { waitUntil: "domcontentloaded" });

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

test("serves the health endpoint", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toEqual({
    ok: true,
    name: "vibe-template-worker",
    routes: ["/", "/schedule", "/speaker-checkin", "/api/health", "/slides.js"],
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
  await expect(response.text()).resolves.toContain("--color-app-canvas:#f3eee6");
});
