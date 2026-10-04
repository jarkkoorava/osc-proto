import { test, expect } from "@playwright/test";

test("student loads require a licensed ground person outside the load", async ({ page }) => {
  await page.goto("/");
  const ground = page.getByRole("combobox", { name: "Maahenkilö", exact: true });
  await expect(ground).toHaveValue("Ei maahenkilöä");
  const picker = page.getByRole("combobox", { name: "Lisää hyppääjä pokaan", exact: true });
  await picker.fill("Riku Harjuniitty");
  await picker.press("Enter");
  const save = page.getByRole("button", { name: "Tallenna poka 1", exact: true });
  await expect(save).toBeDisabled();
  await expect(page.getByText("Oppilas- ja tandempokalle on valittava maahenkilö.", { exact: false })).toBeVisible();
  await picker.fill("Ilkka Pihlaniemi");
  await picker.press("Enter");
  await ground.fill("Ilkka Pihlaniemi");
  await expect(page.getByRole("option", { name: "Ilkka Pihlaniemi", exact: true })).toHaveCount(0);
  await ground.fill("Anssi");
  await page.getByRole("option", { name: "Tuure Kalliosaari", exact: true }).click();
  await expect(ground).toHaveValue("Tuure Kalliosaari");
  await expect(save).toBeEnabled();
  await picker.fill("Tuure Kalliosaari");
  await expect(page.getByRole("option", { name: /Tuure Kalliosaari ·/ })).toHaveCount(0);
  await picker.press("Escape");
  await save.click();
  await expect(page.locator(".queue-ground-person")).toHaveText("Maahenkilö: Tuure Kalliosaari");
});
