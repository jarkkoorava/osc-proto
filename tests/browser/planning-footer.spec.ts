import { test, expect } from "@playwright/test";
import { availableJumpTypes, createJump, createLoad, skydivers } from "../../src/data/manifest";

test("footer counts tandem pairs once, excludes plane returns and adds aircraft dynamically", async ({ page }) => {
  const used = new Set<string>();
  const jumps = ["Tandem instructor", "Tandem student", "Student", "License", "License"].map((type, index) => {
    const person = skydivers.find((person) => !used.has(person.id) && availableJumpTypes(person).includes(type))!;
    used.add(person.id);
    return { ...createJump(person.id), type, returnedByPlane: index === 4 };
  });
  await page.addInitScript((jumps) => {
    localStorage.setItem("osc-manifest-v3", JSON.stringify({
      aircraftWeightsVersion: 2, nextLoad: 3, emptyWeights: { "OH-EKO": 805, "OH-CVE": 825 },
      loads: [
        { id: "load-1", number: 1, plane: "OH-EKO", pilotId: "", fuel: 90, status: "queued", flightState: "Dropped", jumps },
      ],
    }));
  }, jumps);
  // Use the generated pilot ID and current date from a normal load.
  const template = createLoad(1);
  await page.addInitScript((template) => {
    const state = JSON.parse(localStorage.getItem("osc-manifest-v3")!);
    state.loads[0] = { ...template, ...state.loads[0], pilotId: template.pilotId };
    state.loads.push({ ...template, id: "load-2", number: 2, plane: "OH-CVE", status: "queued", flightState: "In the air" });
    localStorage.setItem("osc-manifest-v3", JSON.stringify(state));
  }, template);
  await page.goto("/");
  const footer = page.locator('footer[aria-label="Päivän yhteenveto"]');
  const jumpStats = footer.locator("section").filter({ has: page.getByRole("heading", { name: "Hypyt tänään", exact: true }) });
  await expect(jumpStats.locator("dd")).toHaveText(["3", "1", "1"]);
  const planes = footer.locator("section").filter({ has: page.getByRole("heading", { name: "Hypätyt pokat koneittain", exact: true }) });
  await expect(planes.locator("dt")).toHaveText(["OH-EKO"]);
  await page.getByRole("button", { name: "Pokan seuraava tila 2", exact: true }).click();
  await expect(planes.locator("dt")).toHaveText(["OH-EKO", "OH-CVE"]);
});
