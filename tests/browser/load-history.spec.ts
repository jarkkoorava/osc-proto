import { test, expect } from "@playwright/test";
import { todayDate } from "../../src/data/members";

test("fresh browsers receive identical members and history regardless of opening date", async ({ browser }) => {
  const snapshots = [];
  for (const date of ["2026-10-26T12:00:00Z", "2026-11-01T12:00:00Z"]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date(date));
    await page.goto("/#history");
    await expect(page.locator("tbody tr")).toHaveCount(100);
    snapshots.push({
      members: await page.evaluate(() => localStorage.getItem("osc-members-v2")),
      history: await page.locator("tbody").innerText(),
    });
    await context.close();
  }
  expect(snapshots[0]).toEqual(snapshots[1]);
});

test("history seeds past loads and newly jumped loads join it without blocking today's queue", async ({ page }) => {
  await page.goto("/#history");
  await expect(page.getByRole("heading", { name: "Pokahistoria", exact: true })).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(100);
  const names = await page.locator(".history-jumpers strong").allTextContents();
  const counts = new Map<string, number>();
  for (const name of names) counts.set(name, (counts.get(name) ?? 0) + 1);
  expect(new Set(counts.values()).size).toBeGreaterThan(5);
  expect(Math.max(...counts.values())).toBeLessThan(50);
  const groundCounts = await page.locator(".history-ground-person").evaluateAll((selects) => {
    const counts: Record<string, number> = {};
    for (const select of selects) {
      const name = select.textContent ?? "";
      counts[name] = (counts[name] ?? 0) + 1;
    }
    return counts;
  });
  expect(Object.entries(groundCounts).every(([name, count]) => name === "Eero Peltosaari" || count < groundCounts["Eero Peltosaari"])).toBe(true);
  await expect(page.locator(".history-ground-person select")).toHaveCount(0);
  await expect(page.getByRole("columnheader", { name: "Lentäjä", exact: true })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Maahenkilö", exact: true })).toBeVisible();
  await page.getByRole("spinbutton").first().fill("24");
  await page.reload();
  await expect(page.getByRole("spinbutton").first()).toHaveValue("24");
  await page.getByRole("link", { name: "Pokasuunnittelu", exact: true }).click();
  await expect(page.locator(".load-number")).toHaveText("01");
  await expect(page.locator(".queue .person-card")).toHaveCount(15);
  const picker = page.getByRole("combobox", { name: "Lisää hyppääjä pokaan", exact: true });
  await picker.fill("Matti Pilviniemi");
  await picker.press("Enter");
  await page.getByRole("button", { name: "Tallenna poka 1", exact: true }).click();
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Pokan seuraava tila 1", exact: true }).click();
  await page.getByRole("link", { name: "Pokahistoria", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(101);
  await expect(page.locator("tbody tr").first()).toContainText("Matti Pilviniemi");
  await page.reload();
  await expect(page.locator("tbody tr")).toHaveCount(101);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("osc-manifest-v3")!));
  expect(state.history).toHaveLength(100);
  expect(state.history.every((load: { date: string; jumpedAt: string }) => load.date < todayDate() && Boolean(load.jumpedAt))).toBe(true);
  expect(state.loads).toHaveLength(1);
  expect(state.loads[0].jumpedAt).toBeTruthy();
});
