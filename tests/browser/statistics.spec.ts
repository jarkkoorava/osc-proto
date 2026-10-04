import { test, expect } from "@playwright/test";

test("statistics show six limited rankings from history", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Tilastot", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tilastot", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kerhon hyppymäärä ja kauden tavoite", exact: true })).toBeVisible();
  await expect(page.locator(".season-chart svg").first()).toHaveAttribute("aria-label", /Tavoite 500 hyppyä 31.10./);
  await expect(page.locator(".season-chart svg").nth(1)).toHaveAttribute("aria-label", /Tavoite 150 hyppyä 31.10./);
  await expect(page.locator(".season-chart svg").nth(2)).toHaveAttribute("aria-label", /tandemhyppymäärä: 6 hyppyä. Tavoite 50 hyppyä 31.10./);
  await expect(page.locator(".statistics-grid .statistics-card")).toHaveCount(6);
  await expect(page.getByRole("region", { name: "Yhteensä", exact: true })).toBeVisible();
  await expect(page.locator(".statistics-totals dl > div").filter({ hasText: "Pokia yhteensä" }).locator("dd")).toHaveText("100");
  await expect(page.locator(".statistics-totals dl > div").filter({ hasText: "Hyppypäiviä" }).locator("dd")).toHaveText("20");
  await expect(page.getByRole("region", { name: "Top 10 – kaikki hypyt", exact: true }).locator("tbody tr")).toHaveCount(10);
  for (const card of await page.locator(".statistics-grid .statistics-card").all()) {
    const rows = await card.locator("tbody tr").count();
    expect(rows).toBeGreaterThan(0);
    expect(rows).toBeLessThanOrEqual(10);
  }
  expect(await page.getByRole("region", { name: "Top 10 – hyppykorkeudet", exact: true }).locator("tbody tr").count()).toBeLessThan(10);
});
