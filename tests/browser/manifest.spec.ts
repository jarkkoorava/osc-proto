import { test, expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { createJump, createLoad, skydivers } from "../../src/data/manifest";

async function openManifest(page: Page) {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Pokasuunnittelu" }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function drag(page: Page, source: Locator, target: Locator) {
  await page.bringToFront();
  await source.scrollIntoViewIfNeeded();
  const from = await source.boundingBox();
  if (!from) throw new Error("Vedä source not visible");
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    from.x + from.width / 2 + 10,
    from.y + from.height / 2,
    { steps: 3 },
  );
  await target.scrollIntoViewIfNeeded();
  const to = await target.boundingBox();
  if (!to) throw new Error("Vedä destination not visible");
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {
    steps: 20,
  });
  await page.waitForTimeout(150);
  await page.mouse.up();
  // dnd-kit suppresses clicks for 50 ms while detaching its pointer sensor.
  await page.waitForTimeout(80);
}

test("sidebar queue timers count up, use threshold colors and sort longest first", async ({
  page,
}) => {
  await page.clock.install();
  await openManifest(page);
  const timers = page.locator(".queue .queue-time");
  const initial = await timers.evaluateAll((items) =>
    items.map((item) => Number(item.getAttribute("data-minutes"))),
  );
  expect(initial).toHaveLength(93);
  expect(initial.every((minutes) => minutes >= 0 && minutes <= 150)).toBe(true);
  for (const timer of await timers.all()) {
    const minutes = Number(await timer.getAttribute("data-minutes"));
    await expect(timer).toHaveClass(
      new RegExp(
        minutes < 60
          ? "wait-short"
          : minutes < 120
            ? "wait-medium"
            : "wait-long",
      ),
    );
    await expect(timer).toHaveText(
      `${Math.floor(minutes / 60)} t ${String(minutes % 60).padStart(2, "0")} min`,
    );
  }
  await page.clock.fastForward(60_000);
  await expect(timers.first()).toHaveAttribute(
    "data-minutes",
    String(initial[0] + 1),
  );
  await page.getByRole("tab", { name: "Jonotusaika", exact: true }).click();
  await expect(page.locator(".queue-group h3")).toHaveCount(0);
  const sorted = await timers.evaluateAll((items) =>
    items.map((item) => Number(item.getAttribute("data-minutes"))),
  );
  expect(sorted).toEqual([...sorted].sort((a, b) => b - a));
  await drag(
    page,
    page.getByRole("button", { name: "Vedä Tuure Kalliosaari", exact: true }),
    page.locator(".drop-zone"),
  );
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("tab", { name: "Rooli", exact: true }).click();
  await expect(page.locator(".queue-group h3")).toHaveCount(7);
});

test("queue flight states persist and editing preserves every state", async ({
  page,
}) => {
  await openManifest(page);
  await drag(
    page,
    page.getByRole("button", { name: "Vedä Tuure Kalliosaari", exact: true }),
    page.locator(".drop-zone"),
  );
  await page
    .getByRole("button", { name: "Tallenna poka 1", exact: true })
    .click();
  const state = page.locator(".flight-state-label");
  const next = page.getByRole("button", { name: "Pokan seuraava tila 1" });
  const previous = page.getByRole("button", {
    name: "Pokan edellinen tila 1",
  });
  await expect(state).toHaveText("Tallennettu");
  await previous.click();
  await expect(state).toHaveText("Suunnittelu");
  await expect(previous).toBeDisabled();
  for (const expected of [
    "Suunnittelu",
    "Tallennettu",
    "Koneella",
    "Ilmassa",
    "Hypätty",
    "Laskeutunut",
  ]) {
    await expect(state).toHaveText(expected);
    await page.goto("/#planning");
    await page
      .getByRole("button", {
        name: "Muokkaa jonossa olevaa pokaa 1",
        exact: true,
      })
      .click();
    await expect(page.locator(".load-title-line .status")).toHaveText(
      "Muokkaus",
    );
    await page
      .getByRole("button", { name: "Tallenna poka 1", exact: true })
      .click();
    await page.goto("/#queue");
    await expect(state).toHaveText(expected);
    await expect(page.getByRole("button", { name: /tila/ })).toHaveCount(0);
    await page.goto("/#planning");
    if (expected !== "Laskeutunut") await next.click();
  }
  await expect(next).toBeDisabled();
  await page.reload();
  await expect(state).toHaveText("Laskeutunut");
  await previous.click();
  await expect(state).toHaveText("Hypätty");
});

test("tandem seating displaces jumpers and warns for either missing partner", async ({
  page,
}) => {
  await openManifest(page);
  for (const name of [
    "Ilkka Pihlaniemi",
    "Sakari Lehtivaara",
    "Elina Koivuniemi",
    "Heikki Kuusiranta",
  ]) {
    await drag(
      page,
      page.getByRole("button", { name: `Vedä ${name}`, exact: true }),
      page.locator(".drop-zone"),
    );
  }
  await page
    .getByLabel("Hyppylaji: Heikki Kuusiranta")
    .selectOption("Tandem instructor");
  await expect(
    page.getByText(
      "Tandemhyppymestari tarvitsee tandemoppilaan samalle pokalle.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Paikka 3: Heikki Kuusiranta" }),
  ).toBeVisible();
  await drag(
    page,
    page.getByRole("button", { name: "Vedä Emilia Meriluoto", exact: true }),
    page.locator(".drop-zone"),
  );
  await expect(
    page.getByRole("button", { name: "Paikka 4: Emilia Meriluoto" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Paikka 5: Elina Koivuniemi" }),
  ).toBeVisible();
  await expect(page.locator(".load-warnings")).toHaveCount(0);
  await page
    .getByLabel("Hyppylaji: Ilkka Pihlaniemi")
    .selectOption("Tandem camera");
  await expect(
    page.getByRole("button", { name: "Paikka 1: Ilkka Pihlaniemi" }),
  ).toHaveClass(/tandem-camera/);
  await page
    .getByRole("button", { name: "Palauta Heikki Kuusiranta jonoon", exact: true })
    .click();
  await expect(
    page.getByText(
      "Tandemoppilas tarvitsee tandemhyppymestarin samalle pokalle.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Paikka 4: Emilia Meriluoto" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Paikka 4: Emilia Meriluoto" }),
  ).toBeVisible();
});

test("jumper details, high opening default and load notes persist", async ({
  page,
}) => {
  await openManifest(page);
  await drag(
    page,
    page.getByRole("button", { name: "Vedä Riku Harjuniitty", exact: true }),
    page.locator(".drop-zone"),
  );
  const more = page.getByRole("button", { name: "Lisää: Riku Harjuniitty" });
  await expect(more).not.toHaveClass(/has-info/);
  await page
    .getByLabel("Harjoitus: Riku Harjuniitty")
    .selectOption("Kuvunkäsittely");
  await expect(more).toHaveClass(/has-info/);
  await more.click();
  const popup = page.getByRole("dialog", {
    name: "Hypyn lisätiedot: Riku Harjuniitty",
  });
  await expect(popup.getByLabel("Korkea avaus")).toBeChecked();
  await popup.getByLabel("Wingsuit").check();
  await popup.getByLabel("Kamavuokra").check();
  await popup.getByLabel("Lisätiedot").fill("Radio required");
  await popup.getByRole("button", { name: "Valmis" }).click();
  await expect(page.getByLabel("Pokan lisätiedot 1")).toBeHidden();
  await page.locator(".load-additional-info summary").click();
  await page.getByLabel("Pokan lisätiedot 1").fill("Briefing at the hangar");
  await page.reload();
  await expect(page.getByLabel("Pokan lisätiedot 1")).toBeHidden();
  await page.locator(".load-additional-info summary").click();
  await expect(page.getByLabel("Pokan lisätiedot 1")).toHaveValue(
    "Briefing at the hangar",
  );
  await more.click();
  await expect(popup.getByLabel("Korkea avaus")).toBeChecked();
  await expect(popup.getByLabel("Wingsuit")).toBeChecked();
  await expect(popup.getByLabel("Kamavuokra")).toBeChecked();
  await expect(popup.getByLabel("Lisätiedot")).toHaveValue("Radio required");
  await popup.getByLabel("Korkea avaus").uncheck();
  await popup.getByLabel("Wingsuit").uncheck();
  await popup.getByLabel("Kamavuokra").uncheck();
  await popup.getByLabel("Lisätiedot").fill("");
  await page.keyboard.press("Escape");
  await expect(more).not.toHaveClass(/has-info/);
  await page.reload();
  await more.click();
  await expect(popup.getByLabel("Korkea avaus")).not.toBeChecked();
});

test("seating swaps synchronize table order, CG and saved state", async ({
  page,
}) => {
  await openManifest(page);
  const fixture = {
    ...createLoad(1),
    jumps: [
      "member-demo-002",
      "member-demo-003",
      "member-demo-004",
      "member-demo-008",
    ].map(createJump),
  };
  await page.evaluate(
    (load) =>
      localStorage.setItem(
        "osc-manifest-v3",
        JSON.stringify({
          loads: [load],
          nextLoad: 2,
          aircraftWeightsVersion: 2,
          emptyWeights: { "OH-EKO": 805, "OH-CVE": 825 },
        }),
      ),
    fixture,
  );
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  const load = page.getByRole("region", { name: "Poka 1", exact: true });
  const seat = (position: number) =>
    load.locator(".manifest-seat").filter({
      has: page.locator(".seat-position", {
        hasText: new RegExp(`^${position}$`),
      }),
    });
  await expect(seat(5)).toHaveText(/Tyhjä/);
  const initialCg = await load.locator(".load-balance h3 strong").textContent();
  await drag(page, seat(1), seat(4));
  await expect(load.locator(".row-name")).toHaveText([
    "Miska Tuulisaari",
    "Sakari Lehtivaara",
    "Elina Koivuniemi",
    "Tuure Kalliosaari",
  ]);
  await expect(seat(1)).toContainText("Miska Tuulisaari");
  await expect(seat(4)).toContainText("Tuure Kalliosaari");
  await expect(load.locator(".load-balance h3 strong")).not.toHaveText(
    initialCg!,
  );
  await drag(
    page,
    load.getByRole("button", { name: "Siirrä Miska Tuulisaari", exact: true }),
    load.locator("tbody tr").nth(1),
  );
  await expect(seat(1)).toContainText("Sakari Lehtivaara");
  await expect(seat(2)).toContainText("Miska Tuulisaari");
  await page.reload();
  await expect(seat(1)).toContainText("Sakari Lehtivaara");
  await expect(seat(5)).toHaveText(/Tyhjä/);
  await expect(load.getByRole("img", { name: /^Painopiste:/ })).toBeVisible();
});

test("queue, drag, prices, instructor assignment, reorder, transfer and return", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await openManifest(page);
  await expect(page.locator(".queue .person-card")).toHaveCount(93);
  const load = page.getByRole("region", { name: "Poka 1", exact: true });
  await drag(
    page,
    page.getByRole("button", { name: "Vedä Tuure Kalliosaari", exact: true }),
    load.locator(".drop-zone"),
  );
  await expect(load.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator(".queue .person-card")).toHaveCount(92);
  await expect(load.locator(".price")).toHaveText("32 €");
  await page.getByLabel("Hyppykorkeus: Tuure Kalliosaari").selectOption("1000");
  await expect(load.locator(".price")).toHaveText("17 €");
  await drag(
    page,
    page.getByRole("button", { name: "Vedä Riku Harjuniitty", exact: true }),
    load.locator(".drop-zone"),
  );
  await expect(load.locator("tbody tr")).toHaveCount(2);
  await expect(load.getByText("Hyppymestari puuttuu")).toBeVisible();
  const exercise = page.getByLabel("Harjoitus: Riku Harjuniitty");
  await expect(exercise.locator("option")).toHaveCount(23);
  await exercise.selectOption("5 sek");
  await expect(page.getByLabel("Hyppykorkeus: Riku Harjuniitty")).toHaveValue(
    "1200",
  );
  await exercise.selectOption("Suora UH");
  await expect(page.getByLabel("Hyppykorkeus: Riku Harjuniitty")).toHaveValue(
    "1800",
  );
  await exercise.selectOption("Selkälento");
  await expect(page.getByLabel("Hyppykorkeus: Riku Harjuniitty")).toHaveValue(
    "3000",
  );
  await expect(page.getByLabel("Hyppylaji: Riku Harjuniitty")).toHaveCount(0);
  await page.reload();
  await expect(exercise).toHaveValue("Selkälento");
  await page.getByLabel("Hyppykorkeus: Riku Harjuniitty").selectOption("3000");
  await expect(
    load
      .locator("tbody tr")
      .filter({ hasText: "Riku Harjuniitty" })
      .locator(".price"),
  ).toHaveText("45 €");
  await drag(
    page,
    page.getByRole("button", { name: "Vedä Ilkka Pihlaniemi", exact: true }),
    load.locator(".drop-zone"),
  );
  await expect(load.locator("tbody tr")).toHaveCount(3);
  await page.getByLabel("Hyppylaji: Ilkka Pihlaniemi").selectOption("Instructor");
  await page
    .getByLabel("Hyppymestari: Riku Harjuniitty")
    .selectOption("member-demo-001");
  await expect(
    load
      .locator("tbody tr")
      .filter({ has: page.locator(".row-name", { hasText: "Ilkka Pihlaniemi" }) })
      .locator(".price"),
  ).toHaveText("0 €");
  await expect(load.locator(".field-warning")).toHaveCount(0);
  await drag(
    page,
    page.getByRole("button", { name: "Siirrä Ilkka Pihlaniemi", exact: true }),
    load.locator("tbody tr").first(),
  );
  await expect(load.locator("tbody tr").first()).toContainText("Ilkka Pihlaniemi");
  await expect(
    page.getByRole("button", { name: "Lisää poka", exact: true }),
  ).toBeDisabled();
  await drag(
    page,
    page.getByRole("button", { name: "Siirrä Tuure Kalliosaari", exact: true }),
    page.locator(".queue-heading"),
  );
  await expect(
    page.getByRole("button", { name: "Vedä Tuure Kalliosaari", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Palauta Ilkka Pihlaniemi jonoon",
      exact: true,
    })
    .click();
  await expect(load.getByText("Hyppymestari puuttuu")).toBeVisible();
  expect(errors).toEqual([]);
});

test("capacity enforcement, pilot and aircraft settings, overweight warning", async ({
  page,
}) => {
  await openManifest(page);
  const load = page.getByRole("region", { name: "Poka 1", exact: true });
  for (const name of [
    "Aatos Rantakallio",
    "Miika Metsäniemi",
    "Eero Peltosaari",
    "Miska Tuulisaari",
    "Rami Rysälä",
  ]) {
    await drag(
      page,
      page.getByRole("button", { name: `Vedä ${name}`, exact: true }),
      load.locator(".drop-zone"),
    );
  }
  await expect(load.locator("tbody tr")).toHaveCount(5);
  await load.getByLabel("Hyppylaji: Eero Peltosaari").selectOption("Instructor");
  await load
    .getByLabel("Hyppymestari: Miika Metsäniemi")
    .selectOption("member-demo-015");
  await expect(load.locator(".load-warnings")).toContainText(
    "ylittää sallitun rajan",
  );
  await drag(
    page,
    page.getByRole("button", { name: "Vedä Tuure Kalliosaari", exact: true }),
    load.locator("tbody tr").nth(2),
  );
  await expect(load.locator("tbody tr")).toHaveCount(5);
  await expect(page.locator(".notice")).toContainText("on täynnä");
  await load
    .getByRole("combobox", { name: "Lentäjä", exact: true })
    .selectOption("member-demo-040");
  await expect(load.locator(".weight-summary")).toContainText("73,0 kg");
  await load
    .getByRole("combobox", { name: "Ilma-alus", exact: true })
    .selectOption("OH-CVE");
  await page.getByRole("link", { name: "Asetukset", exact: true }).click();
  await page.getByLabel("OH-CVE perusmassa (kg)").fill("800");
  await page
    .getByRole("link", { name: "Pokasuunnittelu", exact: true })
    .click();
  await expect(load.locator(".weight-summary")).toContainText("800,0 kg");
  await load.getByLabel("100LL-polttoaine (litraa)").fill("0");
  await expect(load.locator(".load-warnings")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Poista poka 1 ja palauta hyppääjät jonoon" })
    .click();
  await expect(page.locator(".queue .person-card")).toHaveCount(93);
});

test("mobile layout keeps the document within viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openManifest(page);
  await expect(
    page.getByRole("heading", { name: "Pokasuunnittelu" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("keyboard can move a skydiver from queue into an empty load", async ({
  page,
}) => {
  await openManifest(page);
  const handle = page.getByRole("button", {
    name: "Vedä Tuure Kalliosaari",
    exact: true,
  });
  await handle.focus();
  await page.keyboard.press("Space");
  await expect(page.locator(".overlay-card")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(
      async () => (await page.locator(".overlay-card").boundingBox())?.x ?? 0,
    )
    .toBeGreaterThan(294);
  await page.keyboard.press("Space");
  await expect(page.locator(".load-card tbody tr")).toHaveCount(1);
});

test("queue loads, reorder compact cards, sync the TV tab and preserve edits on refresh", async ({
  page,
  context,
}) => {
  await openManifest(page);
  await expect(
    page.getByRole("button", { name: "Tallenna poka 1", exact: true }),
  ).toBeDisabled();
  const first = page.getByRole("region", { name: "Poka 1", exact: true });
  for (const name of ["Tuure Kalliosaari", "Riku Harjuniitty", "Ilkka Pihlaniemi"]) {
    await drag(
      page,
      page.getByRole("button", { name: `Vedä ${name}`, exact: true }),
      first.locator(".drop-zone"),
    );
  }
  await first.getByLabel("Hyppykorkeus: Tuure Kalliosaari").selectOption("4000");
  await first.getByLabel("Hyppylaji: Ilkka Pihlaniemi").selectOption("Instructor");
  await first
    .getByLabel("Hyppymestari: Riku Harjuniitty")
    .selectOption("member-demo-001");
  const tv = await context.newPage();
  await tv.goto("/#queue");
  await expect(tv.getByText("Odotetaan seuraavaa pokaa")).toBeVisible();
  await page
    .getByRole("button", { name: "Tallenna poka 1", exact: true })
    .click();
  await expect(first).toHaveCount(0);
  const compact = page.getByRole("article", {
    name: "Jonossa oleva poka 1",
    exact: true,
  });
  await expect(compact).toContainText("Tuure Kalliosaari");
  await expect(compact.locator("select, table, input")).toHaveCount(0);
  await expect(tv.locator(".tv-load")).toHaveCount(1);
  await expect(tv.locator(".tv-jumpers .role-licensed")).toContainText(
    "4 000 m",
  );
  await expect(tv.locator(".tv-jumpers .role-instructor")).toContainText(
    "Ilkka Pihlaniemi",
  );
  await expect(tv.locator(".tv-jumpers .role-student")).toContainText(
    "Riku Harjuniitty",
  );
  await page.getByRole("button", { name: "Lisää poka", exact: true }).click();
  const second = page.getByRole("region", { name: "Poka 2", exact: true });
  await second
    .getByRole("combobox", { name: "Ilma-alus", exact: true })
    .selectOption("OH-CVE");
  await drag(
    page,
    page.getByRole("button", { name: "Vedä Sakari Lehtivaara", exact: true }),
    second.locator(".drop-zone"),
  );
  await page
    .getByRole("button", { name: "Tallenna poka 2", exact: true })
    .click();
  await expect(tv.locator(".tv-load")).toHaveCount(2);
  await drag(
    page,
    page.getByRole("button", {
      name: "Järjestä jonossa oleva poka 2",
      exact: true,
    }),
    compact,
  );
  await expect(page.locator(".queued-load").first()).toHaveAccessibleName(
    "Jonossa oleva poka 2",
  );
  await expect(tv.locator(".tv-load").first()).toContainText("OH-CVE");
  await page
    .getByRole("button", { name: "Siirrä poka 2 myöhemmäksi", exact: true })
    .click();
  await expect(page.locator(".queued-load").first()).toHaveAccessibleName(
    "Jonossa oleva poka 1",
  );
  await expect(tv.locator(".tv-load").first()).toContainText("OH-EKO");
  await page.reload();
  await expect(page.locator(".queued-load")).toHaveCount(2);
  await page
    .getByRole("button", {
      name: "Muokkaa jonossa olevaa pokaa 1",
      exact: true,
    })
    .click();
  await expect(first).toBeVisible();
  await expect(first.getByLabel("Hyppykorkeus: Tuure Kalliosaari")).toHaveValue(
    "4000",
  );
  await expect(first.getByLabel("Hyppymestari: Riku Harjuniitty")).toHaveValue(
    "member-demo-001",
  );
  await expect(tv.locator(".tv-load")).toHaveCount(2);
  await expect(tv.locator(".tv-load").first()).toContainText("OH-EKO");
  await page
    .getByRole("button", { name: "Tallenna poka 1", exact: true })
    .click();
  await expect(page.locator(".queued-load").first()).toHaveAccessibleName(
    "Jonossa oleva poka 2",
  );
  await expect(tv.locator(".tv-load").last()).toContainText("Tuure Kalliosaari");
  await tv.close();
});

test("TV view fits four complete manifests at full HD and works on mobile", async ({
  page,
}) => {
  await page.goto("/");
  const loads = Array.from({ length: 4 }, (_, index) => ({
    ...createLoad(index + 1),
    status: "queued",
    plane: index % 2 ? "OH-CVE" : "OH-EKO",
    jumps: skydivers
      .slice(index * 5, index * 5 + 5)
      .map((person) => createJump(person.id)),
  }));
  await page.evaluate(
    (loads) =>
      localStorage.setItem(
        "osc-manifest-v3",
        JSON.stringify({
          loads,
          nextLoad: 5,
          emptyWeights: { "OH-EKO": 907, "OH-CVE": 907 },
        }),
      ),
    loads,
  );
  await page.goto("/#queue");
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".tv-load")).toHaveCount(4);
  await expect(page.locator(".tv-jumpers li")).toHaveCount(20);
  await expect(
    page.locator("select, input, .queue, .load-settings"),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator(".tv-load")
      .last()
      .evaluate(
        (element) => element.getBoundingClientRect().bottom <= innerHeight,
      ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/tv-queue-full-hd.png" });
  await page.evaluate(() => {
    const manifest = JSON.parse(localStorage.getItem("osc-manifest-v3")!);
    manifest.loads[0].jumps = manifest.loads[0].jumps.slice(0, 1);
    manifest.loads[1].jumps = manifest.loads[1].jumps.slice(0, 3);
    localStorage.setItem("osc-manifest-v3", JSON.stringify(manifest));
  });
  await page.reload();
  const heights = await page
    .locator(".tv-load")
    .evaluateAll((cards) =>
      cards.map((card) => card.getBoundingClientRect().height),
    );
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("link", { name: "Pokasuunnittelu", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Pokasuunnittelu" }),
  ).toBeVisible();
  await expect(page.locator(".queued-load")).toHaveCount(4);
  // Legacy saved plans receive the new empty weights without losing their queue.
  await page.getByRole("link", { name: "Asetukset", exact: true }).click();
  await expect(page.getByLabel("OH-EKO perusmassa (kg)")).toHaveValue("805");
  await expect(page.getByLabel("OH-CVE perusmassa (kg)")).toHaveValue("825");
  await page.getByLabel("OH-EKO perusmassa (kg)").fill("810");
  await page.reload();
  await page.getByRole("link", { name: "Asetukset", exact: true }).click();
  await expect(page.getByLabel("OH-EKO perusmassa (kg)")).toHaveValue("810");
  await expect(page.getByLabel("OH-CVE perusmassa (kg)")).toHaveValue("825");
  await page
    .getByRole("link", { name: "Pokasuunnittelu", exact: true })
    .click();
  await expect(page.locator(".queued-load")).toHaveCount(4);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
