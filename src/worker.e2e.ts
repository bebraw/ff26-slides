import { expect, test } from "@playwright/test";

test("renders the break slide deck", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "Designing futures" })).toBeVisible();
  await expect(page.locator('[data-active-slide="true"]').getByText("Pasi Sillanpää")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/slide=2/);
  await expect(page.getByRole("heading", { level: 1, name: "We Don't Have an Idea Problem. We Have a Permission Problem." })).toBeVisible();
});

test("serves the health endpoint", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toEqual({
    ok: true,
    name: "vibe-template-worker",
    routes: ["/", "/api/health", "/slides.js"],
  });
});

test("serves the generated stylesheet", async ({ request }) => {
  const response = await request.get("/styles.css");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("text/css");
  await expect(response.text()).resolves.toContain("--color-app-canvas:#f3eee6");
});
