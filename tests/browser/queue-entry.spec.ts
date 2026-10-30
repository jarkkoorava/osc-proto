import { test, expect } from "@playwright/test";
import { createJump, skydivers } from "../../src/data/manifest";

test("licensed prices can be changed by altitude and persist in load pricing", async ({ page }) => {
  await page.goto("/#settings");
  const prices = page.getByRole("region", { name: "Lisenssihyppääjien hyppyhinnat" });
  const price = prices.getByRole("spinbutton").nth(4);
  await expect(price).toHaveValue("32");
  await price.fill("34.5");
  await page.reload();
  await expect(prices.getByRole("spinbutton").nth(4)).toHaveValue("34.5");
  await page.getByRole("link", { name: "Pokasuunnittelu", exact: true }).click();
  const person = skydivers.find((person) => createJump(person.id).type === "License")!;
  const picker = page.getByRole("combobox", { name: "Lisää hyppääjä pokaan", exact: true });
  await picker.fill(person.name);
  await picker.press("Enter");
  await expect(page.locator(".load-card .price")).toContainText("34,5");
  await page.getByLabel(`Hyppykorkeus: ${person.name}`, { exact: true }).selectOption("1000");
  await expect(page.locator(".load-card .price")).toContainText("17");
});

test("queue starts with 15 and supports enrollment and direct load entry", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".queue .person-card")).toHaveCount(15);
  const column = await page.locator(".load-table-column").boundingBox();
  const weight = await page.locator(".weight-bar-section").boundingBox();
  expect(Math.abs(column!.y + column!.height - weight!.y - weight!.height)).toBeLessThan(2);
  const outsider = skydivers.slice(15).find((person) => createJump(person.id).type !== "Student")!;
  await page.getByRole("button", { name: "+ Lisää", exact: true }).click();
  await page.getByRole("combobox", { name: "Lisää hyppääjä jonoon", exact: true }).fill(outsider.name);
  await page.locator("#queue-add-popup").getByRole("option", { name: outsider.name, exact: true }).click();
  await page.getByLabel("Jonoon lisättävän hyppääjän korkeus").selectOption("1500");
  await page.getByRole("button", { name: "Lisää jonoon", exact: true }).click();
  await expect(page.locator(".queue .person-card")).toHaveCount(16);

  const picker = page.getByRole("combobox", { name: "Lisää hyppääjä pokaan", exact: true });
  await picker.fill(outsider.name);
  await page.getByRole("option", { name: `${outsider.name} · ${outsider.weight} kg`, exact: true }).click();
  await expect(page.locator(".queue .person-card")).toHaveCount(15);
  await expect(page.locator(".load-card .row-name")).toHaveText([outsider.name]);
  await expect(page.getByLabel(`Hyppykorkeus: ${outsider.name}`, { exact: true })).toHaveValue("1500");

  const direct = skydivers.slice(15).find((person) => person.id !== outsider.id)!;
  await picker.fill(direct.name);
  await picker.press("Enter");
  await expect(page.locator(".load-card .row-name")).toHaveCount(2);
  await expect(page.locator(".add-jumper-row .drag-handle")).toBeDisabled();
  await expect(page.locator(".add-jumper-row select").first()).toBeDisabled();
  await page.reload();
  await expect(page.locator(".queue .person-card")).toHaveCount(15);
  await expect(page.locator(".load-card .row-name")).toHaveCount(2);
});

test("student queue exercise persists through reload and drag to load", async ({ page }) => {
  const student = skydivers.slice(15).find((person) => createJump(person.id).type === "Student")!;
  await page.goto("/");
  await page.getByRole("button", { name: "+ Lisää", exact: true }).click();
  await page.getByRole("combobox", { name: "Lisää hyppääjä jonoon", exact: true }).fill(student.name);
  await page.locator("#queue-add-popup").getByRole("option", { name: student.name, exact: true }).click();
  await page.getByLabel("Jonoon lisättävän oppilaan harjoitus").selectOption("Kuvunkäsittely");
  await page.getByRole("button", { name: "Lisää jonoon", exact: true }).click();
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  const handle = page.getByRole("button", { name: `Vedä ${student.name}`, exact: true });
  await handle.scrollIntoViewIfNeeded();
  const source = (await handle.boundingBox())!;
  await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
  await page.mouse.down();
  await page.mouse.move(source.x + source.width / 2 + 10, source.y + source.height / 2, { steps: 3 });
  await page.locator(".drop-zone").scrollIntoViewIfNeeded();
  const target = (await page.locator(".drop-zone").boundingBox())!;
  await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, { steps: 20 });
  await page.mouse.up();
  await expect(page.getByLabel(`Harjoitus: ${student.name}`, { exact: true })).toHaveValue("Kuvunkäsittely");
  await expect(page.getByLabel(`Hyppykorkeus: ${student.name}`, { exact: true })).toHaveValue("2000");
});
