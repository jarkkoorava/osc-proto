import { test, expect } from "@playwright/test";
import { AIRCRAFT_EMPTY_WEIGHTS, createJump, createLoad, skydivers } from "../../src/data/manifest";

test("jumped loads support whole-load and individual returns without exposing controls on active loads", async ({ page }) => {
  const people = skydivers.slice(0, 2);
  await page.addInitScript((load) => {
    if (!localStorage.getItem("osc-manifest-v3")) localStorage.setItem("osc-manifest-v3", JSON.stringify({
      aircraftWeightsVersion: 2, loads: [load], nextLoad: 2,
      emptyWeights: { "OH-EKO": 805, "OH-CVE": 825 },
    }));
  }, { ...createLoad(1), status: "queued", hasBeenSaved: true, flightState: "Dropped", jumps: people.map((person) => createJump(person.id)) });
  await page.goto("/");
  await page.getByRole("button", { name: "Muokkaa jonossa olevaa pokaa 1", exact: true }).click();
  const all = page.getByRole("checkbox", { name: "Koko poka koneella alas", exact: true });
  await all.check();
  for (const person of people) await expect(page.getByLabel(`Koneella alas: ${person.name}`, { exact: true })).toBeChecked();
  await page.getByLabel(`Koneella alas: ${people[1].name}`, { exact: true }).uncheck();
  await expect(all).not.toBeChecked();
  await page.getByRole("button", { name: "Tallenna poka 1", exact: true }).click();
  await expect(page.getByRole("region", { name: "Hypätyt pokat", exact: true }).getByText("Koneella alas", { exact: true })).toHaveCount(1);
  await page.reload();
  await page.getByRole("button", { name: "Muokkaa jonossa olevaa pokaa 1", exact: true }).click();
  await expect(page.getByLabel(`Koneella alas: ${people[0].name}`, { exact: true })).toBeChecked();
  await expect(page.getByLabel(`Koneella alas: ${people[1].name}`, { exact: true })).not.toBeChecked();
  await page.getByRole("button", { name: "Tallenna poka 1", exact: true }).click();
  await page.getByRole("button", { name: "Pokan edellinen tila 1", exact: true }).click();
  await page.getByRole("button", { name: "Muokkaa jonossa olevaa pokaa 1", exact: true }).click();
  await expect(all).toHaveCount(0);
  await expect(page.locator(".returned-by-plane-control")).toHaveCount(0);
});

test("jumped loads appear in their own section and can return to queue", async ({ page }) => {
  await page.addInitScript((load) => localStorage.setItem("osc-manifest-v3", JSON.stringify({
    aircraftWeightsVersion: 2, loads: [load], nextLoad: 2,
    emptyWeights: { "OH-EKO": 805, "OH-CVE": 825 },
  })), { ...createLoad(1), status: "queued", hasBeenSaved: true, flightState: "In the air", jumps: [createJump(skydivers[0].id)] });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hypätyt pokat" })).toHaveCount(0);
  await page.getByRole("button", { name: "Pokan seuraava tila 1", exact: true }).click();
  const history = page.getByRole("region", { name: "Hypätyt pokat", exact: true });
  await expect(history).toBeVisible();
  await expect(history.locator(".queued-load")).toHaveCount(1);
  await expect(page.getByRole("region", { name: "Pokajono", exact: true }).locator(".queued-load")).toHaveCount(0);
  await expect(history.getByRole("button", { name: "Pokan seuraava tila 1", exact: true })).toBeDisabled();
  await expect(page.getByText("Laskeutunut", { exact: true })).toHaveCount(0);
  await history.getByRole("button", { name: "Pokan edellinen tila 1", exact: true }).click();
  await expect(history).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Pokajono", exact: true }).locator(".queued-load")).toHaveCount(1);
});

test("old gaps repair on reload and deletion, editing and creation keep numbering consecutive", async ({ page }) => {
  const saved = [2, 5, 9].map((number, index) => ({
    ...createLoad(number), status: "queued", hasBeenSaved: true, jumps: [createJump(skydivers[index].id)],
  }));
  await page.addInitScript((loads) => {
    if (!localStorage.getItem("osc-manifest-v3")) localStorage.setItem("osc-manifest-v3", JSON.stringify({
      aircraftWeightsVersion: 2, loads, nextLoad: 1, emptyWeights: { "OH-EKO": 805, "OH-CVE": 825 },
    }));
  }, [...saved, createLoad(12)]);
  await page.goto("/");
  await expect(page.locator(".load-number")).toHaveText("04");
  await expect(page.locator(".queued-load")).toHaveCount(3);
  await page.getByRole("button", { name: "Poista poka 4 ja palauta hyppääjät jonoon", exact: true }).click();
  await page.getByRole("button", { name: "Muokkaa jonossa olevaa pokaa 2", exact: true }).click();
  await expect(page.locator(".load-number")).toHaveText("02");
  await page.getByRole("button", { name: "Tallenna poka 2", exact: true }).click();
  const idsBeforeDelete = await page.evaluate(() => JSON.parse(localStorage.getItem("osc-manifest-v3")!).loads.map((load: { id: string }) => load.id));
  expect(idsBeforeDelete).toEqual(saved.map((load) => load.id));
  await page.getByRole("button", { name: "Muokkaa jonossa olevaa pokaa 2", exact: true }).click();
  await page.getByRole("button", { name: "Poista poka 2 ja palauta hyppääjät jonoon", exact: true }).click();
  await page.getByRole("button", { name: "Lisää poka", exact: true }).click();
  await expect(page.locator(".load-number")).toHaveText("03");
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("osc-manifest-v3")!));
  expect(state.loads.map((load: { number: number }) => load.number)).toEqual([1, 2, 3]);
  expect(new Set(state.loads.map((load: { id: string }) => load.id)).size).toBe(3);
  expect(state.nextLoad).toBe(4);
  expect(state.emptyWeights).toEqual(AIRCRAFT_EMPTY_WEIGHTS);
  await page.reload();
  await expect(page.locator(".load-number")).toHaveText("03");
  await page.getByRole("button", { name: "Poista poka 3 ja palauta hyppääjät jonoon", exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
  const handle = page.getByRole("button", { name: "Järjestä jonossa oleva poka 2", exact: true });
  await handle.scrollIntoViewIfNeeded();
  const from = (await handle.boundingBox())!;
  const target = page.getByRole("button", { name: "Järjestä jonossa oleva poka 1", exact: true });
  const to = (await target.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 10, from.y + from.height / 2, { steps: 3 });
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 20 });
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("osc-manifest-v3")!).loads[0].id)).toBe(saved[2].id);
  const reordered = await page.evaluate(() => JSON.parse(localStorage.getItem("osc-manifest-v3")!).loads);
  expect(reordered.map((load: { number: number }) => load.number)).toEqual([1, 2]);
  expect(reordered.map((load: { id: string }) => load.id)).toEqual([saved[2].id, saved[0].id]);
});
