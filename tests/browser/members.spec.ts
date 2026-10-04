import { test, expect } from "@playwright/test";

test("membership summary and inclusive date filter support new member review", async ({ page }) => {
  await page.goto("/#members");
  await page.evaluate(() => {
    const profiles = JSON.parse(localStorage.getItem("osc-members-v2")!);
    for (const profile of profiles) {
      profile.membershipStartDate = profile.name === "Ilkka Pihlaniemi" ? "2025-01-01" : profile.name === "Tuure Kalliosaari" ? "2025-01-02" : "2023-01-01";
    }
    localStorage.setItem("osc-members-v2", JSON.stringify(profiles));
  });
  await page.reload();
  const summary = page.getByLabel("Jäsenyystyyppien yhteenveto");
  await expect(summary.locator("dd")).toHaveText(["89", "1", "1", "7", "2"]);
  await page.getByLabel("Jäsenet alkaen", { exact: true }).fill("2025-01-01");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await expect(summary.locator("dd")).toHaveText(["89", "1", "1", "7", "2"]);
  await page.getByRole("button", { name: "Jäsenyyden alkamispäivä" }).click();
  await expect(page.locator("tbody tr").first()).toContainText("Ilkka Pihlaniemi");
  await page.getByRole("button", { name: "Jäsenyyden alkamispäivä" }).click();
  await expect(page.locator("tbody tr").first()).toContainText("Tuure Kalliosaari");
  await page.getByLabel("Hae nimellä").fill("Ilkka");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Muokkaa: Ilkka Pihlaniemi" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Jäsenyyden alkamispäivä").fill("2024-12-31");
  await dialog.getByLabel("Jäsenyystyyppi").selectOption("Honorary");
  await dialog.getByRole("button", { name: "Tallenna", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(0);
  await expect(summary.locator("dd")).toHaveText(["88", "2", "1", "7", "2"]);
  await page.reload();
  await page.getByLabel("Hae nimellä").fill("Ilkka Pihlaniemi");
  await expect(page.locator("tbody time")).toHaveAttribute("datetime", "2024-12-31");
  await page.getByLabel("Hae nimellä").fill("");
  await page.getByLabel("Jäsenet alkaen", { exact: true }).fill("2025-01-01");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Tyhjennä päivämäärä" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(100);
});

test("older saved profiles receive stable dates while retaining their edits", async ({ page }) => {
  await page.goto("/#members");
  await page.evaluate(() => {
    const profiles = JSON.parse(localStorage.getItem("osc-members-v2")!);
    profiles.forEach((profile: Record<string, unknown>) => { delete profile.membershipStartDate; });
    profiles.find((profile: { name: string }) => profile.name === "Ilkka Pihlaniemi").city = "Tampere";
    localStorage.setItem("osc-members-v2", JSON.stringify(profiles));
  });
  await page.reload();
  await page.getByLabel("Hae nimellä").fill("Ilkka Pihlaniemi");
  await expect(page.locator("tbody tr")).toContainText("Tampere");
  const date = await page.locator("tbody time").getAttribute("datetime");
  expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  await page.reload();
  await page.getByLabel("Hae nimellä").fill("Ilkka Pihlaniemi");
  await expect(page.locator("tbody time")).toHaveAttribute("datetime", date!);
});

test("member directory searches, sorts and persists edits into planning", async ({ page }) => {
  await page.goto("/#members");
  await expect(page.getByRole("heading", { name: "Jäsenet" })).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(100);
  await page.getByLabel("Hae nimellä").fill("jouko saarivaara");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody tr")).toContainText("Helsinki");
  await page.getByLabel("Hae nimellä").fill("");
  await page.getByRole("button", { name: "Paino (kg)" }).click();
  await expect(page.locator("tbody tr").first()).toContainText("Annika Purolehto");
  await page.getByRole("button", { name: "Paino (kg)" }).click();
  const weights = await page.locator("tbody tr td:nth-child(5)").allTextContents();
  expect(weights.map(Number)).toEqual(weights.map(Number).sort((a, b) => b - a));
  await page.getByLabel("Hae nimellä").fill("Ilkka Pihlaniemi");
  await page.getByRole("button", { name: "Muokkaa: Ilkka Pihlaniemi" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nimi", { exact: true }).fill("Aki Testi");
  await dialog.getByLabel("Kaupunki").fill("Espoo");
  await dialog.getByLabel("Sähköposti").fill("aki.testi@example.com");
  await dialog.getByLabel("Paino (kg)").fill("88");
  await dialog.getByRole("button", { name: "Tallenna", exact: true }).click();
  await page.getByLabel("Hae nimellä").fill("Aki Testi");
  await expect(page.locator("tbody tr")).toContainText("Espoo");
  await page.reload();
  await page.getByLabel("Hae nimellä").fill("Aki Testi");
  await expect(page.locator("tbody tr")).toContainText("aki.testi@example.com");
  await page.getByRole("button", { name: "Muokkaa: Aki Testi" }).click();
  await dialog.getByLabel("Nimi", { exact: true }).fill("Peruttu muutos");
  await dialog.getByRole("button", { name: "Peruuta" }).click();
  await expect(page.locator("tbody tr")).toContainText("Aki Testi");
  await page.getByRole("link", { name: "Pokasuunnittelu" }).click();
  await expect(page.getByRole("button", { name: "Vedä Aki Testi", exact: true })).toBeVisible();
});

test("member roles update jump permissions and protect existing pilot assignments", async ({ page }) => {
  await page.goto("/#members");
  await page.getByLabel("Hae nimellä").fill("Tuure Kalliosaari");
  await page.getByRole("button", { name: "Muokkaa: Tuure Kalliosaari" }).click();
  await page.getByRole("dialog").getByLabel("Tandemkuvaaja", { exact: true }).check();
  await page.getByRole("dialog").getByRole("button", { name: "Tallenna", exact: true }).click();
  await page.reload();
  await page.getByLabel("Hae nimellä").fill("Tuure Kalliosaari");
  await expect(page.locator("tbody tr")).toContainText("Tandemkuvaaja");
  await page.getByLabel("Hae nimellä").fill("Annika Purolehto");
  await page.getByRole("button", { name: "Muokkaa: Annika Purolehto" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Lentäjä", { exact: true }).uncheck();
  await dialog.getByLabel("Lisenssihyppääjä", { exact: true }).check();
  await dialog.getByRole("button", { name: "Tallenna", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Rooli on käytössä pokassa");
  await dialog.getByRole("button", { name: "Peruuta" }).click();
  await page.getByLabel("Hae nimellä").fill("nobody-matches-this");
  await expect(page.getByText("Ei hakua vastaavia jäseniä.")).toBeVisible();
});
