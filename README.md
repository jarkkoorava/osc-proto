# OSC Manifest

Local skydiving manifest prototype using React, TypeScript, Vite, Tailwind CSS, and dnd-kit. No backend or database; manifests are saved in this browser's local storage.

## Prototype member registry

`src/data/memberSeed.ts` contains 100 fictional demo identities. Seven are pilots; the remaining 93 are jumpers. Roles, weights, membership types and historical assignments are retained from the prototype. Formerly real identities now use fictional names, example.com emails and opaque IDs. Rami Rysälä was already invented and is retained.

Members have stable IDs and non-exclusive `roles`, plus weight, membership type and a `fictional` marker. Pilots and skydivers are derived from this one registry. The role tab groups each person once and shows all qualifications as tags. A load's jump type records the person's duty for that jump: instructors default to licensed fun jumps, and only selected instructional duty can satisfy a student's instructor assignment. Instructor jumps are free when an assigned student is on the same load. Camera jumps require Tandem camera qualification; SIL-Coach grants instructional duty.

The registry replacement uses local storage key `osc-manifest-v3`, starting a fresh manifest rather than assigning old demo jumps to new people. The previous `osc-manifest-v1` data remains untouched. No historical data, backend or database has been added.

## Development

Use Node.js 22.14+ and npm.

```sh
npm install
npm run dev
```

## Checks

```sh
npm run lint
npm run build
npm test
npm run test:e2e
```

Browser tests use installed Microsoft Edge in headless mode. If Edge is unavailable, change the channel in `playwright.config.ts` and install the corresponding Playwright browser. Preview the production build with `npm run preview`.

## Load planning

- The queue currently contains all 93 jumping members from the registry. The seven supplied pilots are available in the pilot selector. Supplied exit weights are preserved; fictional members weigh 65–100 kg.
- Drag using the grip to add a jumper to a load, reorder rows, move between loads, or return to the queue. The return arrow is also available.
- Use Add load to create another load. Removing a load returns its jumpers to the queue.
- Each load allows five skydivers plus one pilot, with OH-EKO or OH-CVE and a shared ground-person placeholder.
- Standard altitude options are 1000, 1500, 2000, 3000, 3500, and 4000 m. Students also have exercise-specific altitudes and a Finnish exercise selector.
- Licensed prices are €17, €23, €28, €30, €32, and €40 respectively. Student prices are €30 up to 2000 m and €45 above. Selected instructor duty is free when a student references that instructor on the same load; otherwise licensed pricing applies. Tandem prices remain unset.
- Students require an explicit instructor reference to an instructor on their load. Missing or removed instructors generate warnings.
- Fixtures and calculation rules are in `src/data/manifest.ts`.

## Flight queue and TV display

- Select **Tallenna poka** on a nonempty planning load. It becomes a compact card under Queued loads, showing the aircraft, jumper names, and altitudes. Warning indicators remain visible.
- Drag queued loads by their grip, or use the up/down arrows, to change flight order. Keyboard sorting uses Space, arrow keys, and Space to drop.
- **Edit load** returns a queued load to planning with its jumper settings preserved. Adding it to the queue again appends it to flight order.
- Use **Queue view** or **Open TV view** to open `/#queue`. The TV display uses large text, role colors and labels, and a Fullscreen button. Only queued loads appear; the first is marked Up next.
- Planning and TV tabs on the same browser and origin synchronize automatically using local storage. Reloading preserves the plan. Separate devices or browser profiles do not share data; this prototype has no network synchronization.
- Browser storage key: `osc-manifest-v3`. Clear it in browser developer tools to reset the prototype.

## Aircraft assumptions

Open **Settings** in the navigation, or visit `/#settings`, to edit aircraft empty weights and review the fuel and MTOM assumptions. Changes apply to planning and the queue display and remain saved in this browser.

MTOM is 1406 kg for both aircraft, as specified for this prototype. Standard fuel is 90 L of 100LL at an assumed 0.72 kg/L, weighing 64.8 kg.

Empty weights are **805 kg for OH-EKO** and **825 kg for OH-CVE**, as supplied for this prototype. Existing saved manifests receive these updated defaults once; subsequent edits remain saved. [Shell's 100LL safety data sheet](https://www.epc.shell.com/DocumentManagement/BlobDocumentDownload?DocId=110457400) gives a density range of 700–730 kg/m³ at 15°C; 0.72 kg/L is the prototype approximation.

Estimated remaining jumper mass is MTOM minus empty aircraft, pilot, fuel and assigned jumper mass. With 90 L of fuel and the first pilot's 60 kg weight, OH-EKO allows 476.2 kg of jumpers and OH-CVE allows 456.2 kg. Overweight loads remain editable and show a warning.

The prototype also plots centre of gravity using the supplied aircraft, pilot, fuel and seating arms and CG envelope. It does not approve seating arrangements, validate fuel tank capacity, or replace the aircraft-specific weight-and-balance and operating documents.

## Members directory

Open **Jäsenet** (`/#members`) to browse all 100 members, search by name, and sort any data column. Name searches ignore letter case and accents. Each row has **Muokkaa**, opening an editor for name, city, email, weight, membership type and qualifications. Changes remain in this browser under `osc-members-v2` and synchronize between tabs. IDs remain stable when names change, preserving load references. Qualifications used by existing loads cannot be removed until those load assignments are changed.

All members initially live in Oulu except Jouko Saarivaara (Helsinki). Generated addresses use `example.com` and are saved on first launch. Clearing `osc-members-v2` restores the seed profiles and generates fresh addresses.

Membership start dates are randomized from January 1, 2023 through today, persisted locally, and editable. Existing saved profiles receive dates without losing their edits. The directory summary counts all members by membership type. **Jäsenet alkaen** filters start dates inclusively, combines with name search, and does not record board acceptance decisions.

## Waivers

**Täytä waiver** (`/#waiver`) lets the demo operator select a member and submit their membership/information-check form. Existing members start with blank additional details. A submission updates member contact, insurance, license, experience, equipment and emergency-contact information. These fields are available under **Waiverin tiedot** in the member editor and are omitted from the directory table.

Non-SIL members must provide an insurance number. Wing loading uses exit weight converted to pounds divided by main canopy area in square feet. All six supplied commitments must be checked; marketing permission is a separate required yes/no choice. No consent is preselected. The form captures the earliest equipment inspection expiry date without performing a club gear inspection.

Each member has at most one saved waiver; a new submission replaces the previous snapshot, including consents and submission time. Waivers are stored under `osc-waivers-v2`, independently of member profiles, and synchronize between browser tabs. **Waiverin tarkastus** (`/#waiver-review`) lists submitted forms only, with no approval or inspection actions. This demo selects existing members rather than implementing account registration or authentication.

## Header logo

The header uses `public/images/osc-header-color-black-extra-space.png` via `/images/osc-header-color-black-extra-space.png`.


## Gift cards

`Lahjakortit` is available under Yll?pito only when server-side credentials are configured. Copy `.env.example` to `.env.local` and set `WOOCOMMERCE_URL`, `PIMWICK_API_URL`, `WOOCOMMERCE_CONSUMER_KEY`, and `WOOCOMMERCE_CONSUMER_SECRET`. Restart Vite after changes. Never prefix secrets with `VITE_`.

The read-only API runs in the Vite development and preview servers (`npm run dev`, or `npm run build` followed by `npm run preview`). Serving `dist` alone, including on GitHub Pages, cannot provide this integration: deployment needs a server with the API and environment variables. The prototype has no authentication; Yll?pito is a navigation group, not an access-control boundary. Keep this real-data integration local until server-side authentication/authorization is added.

Reports fetch all cards, individual card activity, products and paginated WooCommerce orders. First load may take several minutes; subsequent requests use a five-minute server memory cache. Refresh fetches a new report. No card data is stored in browser localStorage. Type filtering affects all yearly statistics. Sales are paid order gift-card lines including tax, less itemized refunds in the refund year. Purchases without linked paid orders are explicitly excluded from purchased counts. Usage counts distinct cards with negative transaction activity per year and can include manual adjustments. Expired count includes fully spent cards; expired unused amounts reconstruct the balance at the end of expiry day, including only reconciled activity histories. Unknown balances are flagged separately. Dates use the store's local date fields and the Helsinki calendar day.

`npm test` includes report calculation and disabled-API checks; `npx playwright test tests/browser/giftCards.spec.ts` checks the page with synthetic API responses. `node --env-file=.env.local --experimental-strip-types scripts/verify-gift-cards.mjs` performs a read-only live check and prints aggregate counts only.
