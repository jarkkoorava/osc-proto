The initial demo dataset is committed as typed data:

- `memberSeed.ts`: 100 fixed members, including IDs, emails, membership dates, roles and weights.
- `historySeed.ts`: 100 completed loads, five per jump day across 20 days from 1 March to 20 October 2026. Activity ramps up from a quiet March, peaks around 15 July, then tapers toward October.

The deployed app clones these snapshots. It does not generate members or historical loads at runtime. Local edits remain specific to each browser.

Historical load distribution:

| Pattern | Loads |
| --- | ---: |
| 4–5 licensed jumpers at 3500 m | 28 |
| 4–5 licensed jumpers at 1000 m | 24 |
| Instructor and 3–4 students at 1000 m | 20 |
| One licensed jumper at 1000 m, 3–4 at 3500 m | 10 |
| Two instructors and two students at 3500 m | 6 |
| Instructor at 1800 m, students at 1000/1200/1800 m | 6 |
| Tandem instructor, passenger, camera, optionally one licensed jumper | 6 |

To deliberately regenerate the committed snapshots during development:

```sh
node --experimental-strip-types scripts/generate-demo-data.mjs
```

The generator uses a fixed seed and fixed dates. Personal totals vary through seeded activity levels and daily attendance, with no forced jump leader. Eero Peltosaari leads ground-person assignments. Only generated history entries are replaced when migrating older demo storage; user-created loads and recorded flight times are retained. Existing local member edits are retained. Clear site storage to return completely to the baseline.


All 100 member identities are now marked fictional. The 45 formerly real identities have replacement names, opaque IDs and example.com emails. Existing fictional names, including Rami Rysälä, are retained. Member references in history and development fixtures were updated without regenerating loads or changing statistics.

Original records and the identity mapping are backed up only in the gitignored `.local-backups/` directory. Do not import these files into the app or publish them. The anonymized demo uses new localStorage namespaces (members v2, manifest v3, waivers v2, calendar enrollments v2). Previous browser data is left untouched under the old keys and is not read by the anonymized version.
