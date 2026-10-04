import { test, expect } from "@playwright/test";
import { pilots } from "../../src/data/manifest";
import { historySeed } from "../../src/data/historySeed";

test("jump transactions show full role names and altitude badges", async ({ page }) => {
  const jump = historySeed.flatMap((load) => load.jumps).find((jump) => jump.type === "License")!;
  await page.goto("/#account");
  await page.getByRole("combobox", { name: "Jäsen", exact: true }).selectOption(jump.skydiverId);
  await expect(page.locator(".account-jump-type").first()).toBeVisible();
  await expect(page.locator(".account-jump-type.licensed").first()).toHaveText("Lisenssihyppääjä");
  await expect(page.locator(".account-altitude").filter({ hasText: /\d.* m/ }).first()).toBeVisible();
  const opening = page.locator("tbody tr").filter({ hasText: "Alkusaldo" });
  await expect(opening.locator(".account-jump-type")).toHaveCount(0);
});

test("account shows opening balance, deposits persist and cancellation changes nothing", async ({ page }) => {
  await page.goto("/#account");
  await page.getByRole("combobox", { name: "Jäsen", exact: true }).selectOption(pilots[0].id);
  await expect(page.locator(".account-balance > strong")).toContainText("200,00");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Lisää saldoa", exact: true }).click();
  await page.getByRole("spinbutton").fill("12.34");
  await page.getByRole("button", { name: "Talleta", exact: true }).click();
  await expect(page.locator(".account-balance > strong")).toContainText("212,34");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await page.getByRole("button", { name: "Lisää saldoa", exact: true }).click();
  await page.getByRole("spinbutton").fill("99");
  await page.getByRole("button", { name: "Peruuta", exact: true }).click();
  await expect(page.locator(".account-balance > strong")).toContainText("212,34");
  await page.reload();
  await page.getByRole("combobox", { name: "Jäsen", exact: true }).selectOption(pilots[0].id);
  await expect(page.locator(".account-balance > strong")).toContainText("212,34");
  await expect(page.locator("tbody tr")).toHaveCount(2);
});
