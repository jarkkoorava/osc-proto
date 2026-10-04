import { test, expect } from "@playwright/test";
import { createJump, createLoad, pilots, skydivers } from "../../src/data/manifest";

test("pilot view lists today's loads, converts altitudes and edits only the selected pilot's times", async ({ page }) => {
  const template = createLoad(1);
  const yesterday = new Date(`${template.date}T12:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const loads = [
    { ...template, status: "queued", hasBeenSaved: true, pilotId: pilots[0].id, jumps: [createJump(skydivers[0].id)] },
    { ...createLoad(2), pilotId: pilots[1].id, status: "queued", flightState: "Dropped", jumps: [createJump(skydivers[1].id)] },
    { ...createLoad(3), date: yesterday.toISOString().slice(0, 10), status: "queued", flightState: "Dropped", jumps: [createJump(skydivers[2].id)] },
  ];
  await page.addInitScript((loads) => {
    if (!localStorage.getItem("osc-manifest-v3")) localStorage.setItem("osc-manifest-v3", JSON.stringify({
      aircraftWeightsVersion: 2, loads, nextLoad: 4, emptyWeights: { "OH-EKO": 805, "OH-CVE": 825 },
    }));
  }, loads);
  await page.goto("/#pilot");
  await expect(page.getByRole("heading", { name: "Lentäjänäkymä", exact: true })).toBeVisible();
  await expect(page.locator(".pilot-load")).toHaveCount(2);
  await expect(page.locator(".pilot-altitude").first()).toContainText(/3\s500 m/);
  await expect(page.locator(".pilot-altitude").first()).toContainText("11 500 ft");
  await expect(page.getByRole("img", { name: /^Painopiste:/ })).toHaveCount(2);
  await expect(page.getByRole("spinbutton")).toHaveCount(1);
  await page.getByLabel("Lentoaika: poka 1", { exact: true }).fill("27");
  await page.getByRole("combobox", { name: "Lentäjä", exact: true }).selectOption(pilots[1].id);
  await expect(page.getByLabel("Lentoaika: poka 1", { exact: true })).toHaveCount(0);
  await page.getByLabel("Lentoaika: poka 2", { exact: true }).fill("31");
  await page.reload();
  await expect(page.getByLabel("Lentoaika: poka 1", { exact: true })).toHaveValue("27");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".pilot-load")).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const input = await page.getByLabel("Lentoaika: poka 1", { exact: true }).boundingBox();
  expect(input!.height).toBeGreaterThanOrEqual(56);
  await expect(page.locator(".pilot-jumper-role").first()).toBeHidden();
  await expect(page.locator(".pilot-jumper-weight").first()).toBeHidden();
  const panel = page.locator(".pilot-weight-panel").first();
  const graph = (await panel.locator(".load-balance").boundingBox())!;
  const masses = (await panel.locator(".pilot-weight-details").boundingBox())!;
  expect(graph.y).toBeLessThan(masses.y);
  await page.getByRole("switch", { name: "Omat pokat", exact: true }).check();
  await expect(page.locator(".pilot-load")).toHaveCount(1);
  await expect(page.getByLabel("Lentoaika: poka 1", { exact: true })).toBeVisible();
  await page.getByRole("combobox", { name: "Lentäjä", exact: true }).selectOption(pilots[1].id);
  await expect(page.locator(".pilot-load")).toHaveCount(1);
  await expect(page.getByLabel("Lentoaika: poka 2", { exact: true })).toBeVisible();
});
