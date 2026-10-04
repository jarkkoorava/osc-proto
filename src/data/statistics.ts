import { findSkydiver, loadFlightState } from "./manifest.ts";
import type { Load } from "./manifest.ts";
import { todayDate } from "./members.ts";

export const seasonProgress = (loads: Load[], today = todayDate(), studentsOnly = false, tandemsOnly = false) => {
  const year = Number(today.slice(0, 4));
  const start = `${year}-03-01`;
  const end = `${year}-10-31`;
  const until = today < end ? today : end;
  const byDay = new Map<string, number>();
  for (const load of new Map(loads.map((load) => [load.id, load])).values()) {
    if (loadFlightState(load) !== "Dropped") continue;
    const date = load.jumpedAt && Number.isFinite(Date.parse(load.jumpedAt))
      ? new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Helsinki" }).format(new Date(load.jumpedAt)) : load.date;
    if (!date || date < start || date > until) continue;
    const jumped = load.jumps.filter((jump) => !jump.returnedByPlane);
    // This graph counts completed instructor/passenger pairs, excluding the camera jumper.
    const count = tandemsOnly
      ? Math.min(jumped.filter((jump) => jump.type === "Tandem instructor").length, jumped.filter((jump) => jump.type === "Tandem student").length)
      : jumped.filter((jump) => !studentsOnly || jump.type === "Student").length;
    byDay.set(date, (byDay.get(date) ?? 0) + count);
  }
  const points: { date: string; total: number }[] = [];
  let total = 0;
  for (let time = Date.parse(`${start}T00:00:00Z`); time <= Date.parse(`${until}T00:00:00Z`); time += 86400000) {
    const date = new Date(time).toISOString().slice(0, 10);
    total += byDay.get(date) ?? 0;
    points.push({ date, total });
  }
  return { start, end, points, total, goal: tandemsOnly ? 50 : studentsOnly ? 150 : 500 };
};

export type RankingEntry = { id: string; label: string; count: number };

export const loadStatistics = (loads: Load[]) => {
  const all = new Map<string, number>();
  const students = new Map<string, number>();
  const pilots = new Map<string, number>();
  const instructors = new Map<string, number>();
  const tandems = new Map<string, number>();
  const altitudes = new Map<string, number>();
  const loadsByPlane = new Map<string, number>();
  const days = new Set<string>();
  let totalLoads = 0;
  const increment = (counts: Map<string, number>, id: string) => counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const load of new Map(loads.map((load) => [load.id, load])).values()) {
    if (loadFlightState(load) !== "Dropped") continue;
    totalLoads++;
    increment(loadsByPlane, load.plane);
    const day = load.jumpedAt && Number.isFinite(Date.parse(load.jumpedAt))
      ? new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Helsinki" }).format(new Date(load.jumpedAt))
      : load.date;
    if (day) days.add(day);
    increment(pilots, load.pilotId);
    for (const jump of load.jumps) {
      if (jump.returnedByPlane) continue;
      // Statistics count each tandem participant's personal jump separately, as requested.
      increment(all, jump.skydiverId);
      increment(altitudes, String(jump.altitude));
      if (jump.type === "Student") {
        increment(students, jump.skydiverId);
        if (load.jumps.some((other) => other.skydiverId === jump.instructorId && other.type === "Instructor")) {
          increment(instructors, jump.instructorId);
        }
      }
      if (jump.type === "Tandem instructor") increment(tandems, jump.skydiverId);
    }
  }
  const rank = (counts: Map<string, number>): RankingEntry[] => [...counts]
    .map(([id, count]) => ({ id, label: findSkydiver(id)?.name ?? id, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "fi"))
    .slice(0, 10);
  return {
    totals: {
      jumps: [...all.values()].reduce((sum, count) => sum + count, 0),
      loads: totalLoads,
      loadsByPlane: [...loadsByPlane].sort(([a], [b]) => a.localeCompare(b, "fi")),
      students: [...students.values()].reduce((sum, count) => sum + count, 0),
      days: days.size,
      jumpers: all.size,
    },
    all: rank(all), students: rank(students), pilots: rank(pilots), instructors: rank(instructors), tandems: rank(tandems),
    altitudes: [...altitudes].sort((a, b) => b[1] - a[1] || Number(a[0]) - Number(b[0])).slice(0, 10)
      .map(([id, count]) => ({ id, label: `${Number(id).toLocaleString("fi-FI")} m`, count })),
  };
};
