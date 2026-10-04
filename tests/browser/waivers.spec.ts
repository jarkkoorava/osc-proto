import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { emptyMemberDetails, waiverTerms } from "../../src/data/waiver";

const fillRequiredDetails = async (page: Page) => {
  const fields = {
    Puhelinnumero: "0401234567", Osoite: "Demokatu 1", Postinumero: "90100", Syntymäaika: "1990-01-01",
    "Hyppyjä yhteensä": "250", "Hyppyjä viimeisen 12 kuukauden aikana": "40",
    "Päävarjon malli": "Demo main", "Päävarjon koko (ft²)": "190",
    "Varavarjon malli": "Demo reserve", "Varavarjon koko (ft²)": "193",
    "Repun malli": "Demo container", "AAD:n malli": "Demo AAD",
    "Tarkastukset voimassa": "2027-10-05", "Lähiomaisen nimi": "Demo Omainen",
    "Suhde henkilöön": "Puoliso", "Lähiomaisen puhelinnumero": "0509876543",
  };
  for (const [label, value] of Object.entries(fields)) await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByLabel("Lisenssi", { exact: true }).selectOption("D");
};

const acceptTerms = async (page: Page) => {
  for (const checkbox of await page.locator(".waiver-terms input").all()) await checkbox.check();
  await page.getByRole("radio", { name: "Ei", exact: true }).check();
};

test("jumper review corrections persist and pilot review stays read-only", async ({ page }) => {
  const base = {
    memberId: "member-demo-001", submittedAt: "2026-10-26T10:00:00Z", name: "Ilkka Pihlaniemi",
    email: "aki@example.com", city: "Oulu", weight: 85,
    details: { ...emptyMemberDetails(), license: "D", totalJumps: "250", jumpsLastYear: "40",
      silMember: false, insuranceNumber: "INS-123", emergencyName: "Demo Omainen", emergencyPhone: "0401234567",
      mainCanopyModel: "Demo main", mainCanopySize: "190", inspectionsValidUntil: "2027-01-01",
      totalFlightHours: "1500", totalFlights: "2000", skydiveFlights: "300", skydiveFlightHours: "150",
      sepValidUntil: "2028-01-01", englishExamValidUntil: "2029-01-01", medicalValidUntil: "2027-01-01" },
    acceptedTerms: waiverTerms.map(() => true), marketingConsent: false,
  };
  await page.addInitScript((records) => {
    if (!localStorage.getItem("osc-waivers-v2")) localStorage.setItem("osc-waivers-v2", JSON.stringify(records));
  }, [{ ...base, type: "licensed" }, { ...base, type: "pilot" }]);
  await page.goto("/#waiver-review");
  const jumper = page.locator("tbody tr").filter({ hasText: "Lisenssihyppääjä" });
  await jumper.getByRole("button", { name: "Ilkka Pihlaniemi", exact: true }).click();
  await expect(page.locator("main")).toContainText("INS-123");
  await expect(page.locator("main")).toContainText("Demo Omainen");
  await expect(page.locator("main")).toContainText("Demo main");
  await expect(page.getByRole("checkbox")).toHaveCount(5);
  for (const check of await page.getByRole("checkbox").all()) await check.check();
  await page.getByLabel("Exit-paino (kg)", { exact: true }).fill("92.5");
  await page.getByLabel("Tarkastukset voimassa", { exact: true }).fill("2028-06-01");
  await page.getByLabel("Huomautus", { exact: true }).fill("Paino ja tarkastuspäivä korjattu.");
  await page.getByRole("button", { name: "Tallenna tarkastus", exact: true }).click();
  await expect(page.locator("main").getByRole("status")).toHaveText("Tarkastus tallennettu.");
  await page.reload();
  await page.locator("tbody tr").filter({ hasText: "Lisenssihyppääjä" }).getByRole("button", { name: "Ilkka Pihlaniemi", exact: true }).click();
  await expect(page.getByLabel("Exit-paino (kg)", { exact: true })).toHaveValue("92.5");
  await expect(page.getByLabel("Tarkastukset voimassa", { exact: true })).toHaveValue("2028-06-01");
  await expect(page.getByLabel("Huomautus", { exact: true })).toHaveValue("Paino ja tarkastuspäivä korjattu.");
  await expect(page.getByRole("checkbox").first()).toBeChecked();
  const profile = await page.evaluate(() => JSON.parse(localStorage.getItem("osc-members-v2")!).find((member: { id: string }) => member.id === "member-demo-001"));
  expect(profile.weight).toBe(92.5);
  expect(profile.details.inspectionsValidUntil).toBe("2028-06-01");
  await page.getByRole("button", { name: "Takaisin", exact: true }).click();
  await page.locator("tbody tr").filter({ hasText: "Lentäjä" }).getByRole("button", { name: "Ilkka Pihlaniemi", exact: true }).click();
  await expect(page.getByRole("checkbox")).toHaveCount(2);
  await expect(page.locator("main input:not([type=checkbox]), main textarea, main select")).toHaveCount(0);
  await expect(page.locator("main")).toContainText("1500");
  await expect(page.locator("main")).toContainText("Kielikoe EN voimassa");
  for (const check of await page.getByRole("checkbox").all()) await check.check();
  await page.getByRole("button", { name: "Tallenna tarkastus", exact: true }).click();
  await page.reload();
  await page.locator("tbody tr").filter({ hasText: "Lentäjä" }).getByRole("button", { name: "Ilkka Pihlaniemi", exact: true }).click();
  await expect(page.getByRole("checkbox").last()).toBeChecked();
});

test("waiver types control fields and persist separately for the same member", async ({ page }) => {
  await page.goto("/#waiver");
  const type = page.getByRole("combobox", { name: "Waiverin tyyppi", exact: true });
  await page.getByRole("combobox", { name: "Jäsen", exact: true }).selectOption("member-demo-001");
  await expect(type).toHaveValue("licensed");
  await page.getByLabel("Suomen Ilmailuliiton jäsen", { exact: true }).selectOption("true");
  await fillRequiredDetails(page);
  const gearSwitch = page.getByRole("checkbox", { name: "Hyppään vain kerhon varjokalustolla", exact: true });
  await gearSwitch.check();
  await expect(page.getByLabel("Päävarjon malli", { exact: true })).toHaveCount(0);
  await gearSwitch.uncheck();
  await expect(page.getByLabel("Päävarjon malli", { exact: true })).toHaveValue("Demo main");
  await gearSwitch.check();
  await acceptTerms(page);
  await page.getByRole("button", { name: "Tallenna waiver", exact: true }).click();
  await expect(page.locator(".waiver-success")).toBeVisible();

  await type.selectOption("basic");
  await expect(page.getByLabel("Lisenssi", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Hyppyjä yhteensä", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Päävarjon malli", { exact: true })).toHaveCount(0);
  await expect(gearSwitch).toHaveCount(0);
  await expect(page.getByLabel("Suomen Ilmailuliiton jäsen", { exact: true })).toBeVisible();
  await acceptTerms(page);
  await page.getByRole("button", { name: "Tallenna waiver", exact: true }).click();
  await expect(page.locator(".waiver-success")).toBeVisible();

  await type.selectOption("pilot");
  await expect(gearSwitch).toHaveCount(0);
  await expect(page.getByLabel("Suomen Ilmailuliiton jäsen", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Lisenssi", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Päävarjon malli", { exact: true })).toHaveCount(0);
  const pilotFields = {
    "Lentotunnit yhteensä": "1500.5", "Lennot yhteensä": "2000",
    "Hyppylennot yhteensä": "300", "Hyppylentotunnit yhteensä": "150.5",
    "SEP voimassa": "2028-06-01", "Kielikoe EN voimassa": "2029-07-01", "Medikaali voimassa": "2027-08-01",
  };
  for (const [label, value] of Object.entries(pilotFields)) await page.getByLabel(label, { exact: true }).fill(value);
  await acceptTerms(page);
  await page.getByRole("button", { name: "Tallenna waiver", exact: true }).click();
  await expect(page.locator(".waiver-success")).toBeVisible();
  await page.getByRole("link", { name: "Waiverin tarkastus", exact: true }).click();
  await page.reload();
  await expect(page.locator("tbody tr")).toHaveCount(3);
  await expect(page.locator("tbody")).toContainText("Kerhon varjokalusto");
  await expect(page.locator("tbody")).toContainText("Alkeiskurssi");
  await expect(page.locator("tbody")).toContainText("Medikaali: 1.8.2027");
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("osc-waivers-v2")!));
  expect(stored.find((waiver: { type: string }) => waiver.type === "basic").details.clubGearOnly).toBe(true);
  expect(stored.find((waiver: { type: string }) => waiver.type === "pilot").details.totalFlightHours).toBe("1500.5");
  await page.getByRole("link", { name: "Täytä waiver", exact: true }).click();
  await page.getByRole("combobox", { name: "Jäsen", exact: true }).selectOption("member-demo-001");
  await page.getByRole("combobox", { name: "Waiverin tyyppi", exact: true }).selectOption("pilot");
  await expect(page.getByLabel("Lentotunnit yhteensä", { exact: true })).toHaveValue("1500.5");
});

test("waiver requires insurance and terms, calculates loading and replaces previous submission", async ({ page }) => {
  await page.goto("/#waiver-review");
  await expect(page.getByText("Ei täytettyjä waivereita.")).toBeVisible();
  await page.getByRole("link", { name: "Täytä waiver", exact: true }).click();
  await page.getByRole("combobox", { name: "Jäsen", exact: true }).selectOption("member-demo-001");
  await page.getByLabel("Suomen Ilmailuliiton jäsen", { exact: true }).selectOption("false");
  await fillRequiredDetails(page);
  await expect(page.locator("output")).toHaveText("0,99 lb/ft²");
  await acceptTerms(page);
  await page.getByRole("button", { name: "Tallenna waiver", exact: true }).click();
  expect(await page.getByLabel("Vakuutusnumero", { exact: true }).evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  await expect(page.locator(".waiver-success")).toHaveCount(0);
  await page.getByLabel("Vakuutusnumero", { exact: true }).fill("DEMO-12345");
  await page.locator(".waiver-terms input").first().uncheck();
  await page.getByRole("button", { name: "Tallenna waiver", exact: true }).click();
  await expect(page.locator(".waiver-success")).toHaveCount(0);
  await page.locator(".waiver-terms input").first().check();
  await page.getByLabel("Hyppyjä viimeisen 12 kuukauden aikana", { exact: true }).fill("251");
  await page.getByRole("button", { name: "Tallenna waiver", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("ei voi ylittää");
  await page.getByLabel("Hyppyjä viimeisen 12 kuukauden aikana", { exact: true }).fill("40");
  await page.getByRole("button", { name: "Tallenna waiver", exact: true }).click();
  await expect(page.locator(".waiver-success")).toContainText("Waiver tallennettu");
  await page.getByRole("link", { name: "Waiverin tarkastus", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody tr")).toContainText("Ilkka Pihlaniemi");
  await expect(page.getByRole("button", { name: "Ilkka Pihlaniemi", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("link", { name: "Täytä waiver", exact: true }).click();
  await page.getByRole("combobox", { name: "Jäsen", exact: true }).selectOption("member-demo-001");
  await expect(page.getByLabel("Vakuutusnumero", { exact: true })).toHaveValue("DEMO-12345");
  await page.getByLabel("Suomen Ilmailuliiton jäsen", { exact: true }).selectOption("true");
  await expect(page.getByLabel("Vakuutusnumero", { exact: true })).toHaveCount(0);
  await page.getByLabel("Päävarjon koko (ft²)", { exact: true }).fill("170");
  await expect(page.locator("output")).toHaveText("1,10 lb/ft²");
  await acceptTerms(page);
  await page.getByRole("button", { name: "Tallenna waiver", exact: true }).click();
  await expect(page.locator(".waiver-success")).toContainText("Waiver tallennettu");
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("osc-waivers-v2")!));
  expect(stored).toHaveLength(1);
  expect(stored[0].details.mainCanopySize).toBe("170");
  expect(stored[0].marketingConsent).toBe(false);
  await page.getByRole("link", { name: "Jäsenet", exact: true }).click();
  await page.getByLabel("Hae nimellä").fill("Ilkka Pihlaniemi");
  await expect(page.locator("tbody")).not.toContainText("Demokatu");
  await page.getByRole("button", { name: "Muokkaa: Ilkka Pihlaniemi", exact: true }).click();
  await page.getByRole("dialog").getByText("Waiverin tiedot", { exact: true }).click();
  await expect(page.getByRole("dialog").getByLabel("Osoite", { exact: true })).toHaveValue("Demokatu 1");
  await expect(page.getByRole("dialog").getByLabel("Päävarjon koko (ft²)", { exact: true })).toHaveValue("170");
});

test("changing selected member resets waiver draft and personal data", async ({ page }) => {
  await page.goto("/#waiver");
  await page.getByRole("combobox", { name: "Jäsen", exact: true }).selectOption("member-demo-001");
  await page.getByLabel("Osoite", { exact: true }).fill("Unsaved draft");
  await page.getByRole("button", { name: "Peruuta", exact: true }).click();
  await expect(page.getByText("Testaa waiverin täyttämistä seuraavalle henkilölle:", { exact: true })).toBeVisible();
  await expect(page.locator(".waiver-form")).toHaveCount(0);
  await page.getByRole("combobox", { name: "Jäsen", exact: true }).selectOption("member-demo-002");
  await expect(page.getByLabel("Etunimi", { exact: true })).toHaveValue("Anssi");
  await expect(page.getByLabel("Osoite", { exact: true })).toHaveValue("");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
