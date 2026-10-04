import { test } from "node:test";
import assert from "node:assert/strict";
import { wingLoading } from "../src/data/waiver.ts";
import { loadStatistics, seasonProgress } from "../src/data/statistics.ts";
import { historySeed } from "../src/data/historySeed.ts";
import { memberSeed } from "../src/data/memberSeed.ts";
import { billedJumpPrice, memberBalance, reconcileTransactions } from "../src/data/transactions.ts";
import { LICENSE_JUMP_PRICES } from "../src/data/manifest.ts";
import { AIRCRAFT_EMPTY_WEIGHTS, groundPersonError } from "../src/data/manifest.ts";
import {
  members,
  skydivers,
  pilots,
  availableJumpTypes,
  createJump,
  createLoad,
  jumpRole,
  jumpPrice,
  hasInstructor,
  moveSkydiver,
  seatingPositions,
  tandemWarnings,
  loadBalance,
  loadWeights,
  isWithinCgEnvelope,
  flightStates,
  changeFlightState,
  loadFlightState,
  reorderQueuedLoads,
  renumberLoads,
  altitudes,
} from "../src/data/manifest.ts";
const person = (name) => members.find((member) => member.name === name);

test("ledger seeds every member, records zero-cost jumps and never double-charges or reprices history", () => {
  const ledger = reconcileTransactions(undefined, historySeed, LICENSE_JUMP_PRICES);
  assert.equal(ledger.filter((item) => item.kind === "opening").length, 100);
  assert.equal(ledger.filter((item) => item.kind === "jump").length, historySeed.reduce((sum, load) => sum + load.jumps.length, 0));
  assert.ok(ledger.some((item) => item.kind === "jump" && item.amountCents === 0));
  assert.deepEqual(reconcileTransactions(ledger, historySeed, { ...LICENSE_JUMP_PRICES, 3500: 99 }), ledger);
});

test("ledger handles plane returns, corrections, reversals and negative balances", () => {
  const jump = { ...createJump(person("Tuure Kalliosaari").id), type: "License", altitude: 3500, returnedByPlane: true };
  const load = { ...createLoad(1), flightState: "Dropped", jumpedAt: "2026-10-26T12:00:00Z", jumps: [jump] };
  assert.equal(billedJumpPrice(jump, load), 32);
  for (const type of ["Student", "Tandem instructor", "Tandem student", "Tandem camera"]) {
    assert.equal(billedJumpPrice({ ...jump, type }, load), 0);
  }
  let ledger = reconcileTransactions(undefined, [load], LICENSE_JUMP_PRICES);
  assert.equal(memberBalance(ledger, jump.skydiverId), 16800);
  const corrected = { ...load, jumps: [{ ...jump, altitude: 1000 }] };
  ledger = reconcileTransactions(ledger, [corrected], LICENSE_JUMP_PRICES);
  assert.equal(memberBalance(ledger, jump.skydiverId), 18300);
  assert.equal(ledger.at(-1).kind, "correction");
  assert.equal(ledger.at(-1).amountCents, 1500);
  ledger = reconcileTransactions(ledger, [], LICENSE_JUMP_PRICES);
  assert.equal(memberBalance(ledger, jump.skydiverId), 20000);
  assert.deepEqual(reconcileTransactions(ledger, [], LICENSE_JUMP_PRICES), ledger);
  ledger = reconcileTransactions(ledger, Array.from({ length: 8 }, (_, index) => ({ ...load, id: `load-test-${index}` })), LICENSE_JUMP_PRICES);
  assert.equal(memberBalance(ledger, jump.skydiverId), -5600);
});

test("static demo has 100 qualified historical loads with consecutive daily numbers and valid ground people", () => {
  assert.equal(memberSeed.length, 100);
  assert.equal(historySeed.length, 100);
  const dates = [...new Set(historySeed.map((load) => load.date))].sort();
  assert.equal(dates[0], "2026-03-01");
  assert.equal(dates.at(-1), "2026-10-20");
  const months = new Map();
  for (const load of historySeed) months.set(load.date.slice(5, 7), (months.get(load.date.slice(5, 7)) ?? 0) + 1);
  assert.ok(months.get("07") > months.get("03"));
  assert.ok(months.get("07") > months.get("10"));
  assert.equal(Math.max(...months.values()), months.get("07"));
  const days = new Map();
  for (const load of historySeed) {
    assert.ok(load.date < "2026-10-26");
    assert.ok(load.jumpedAt.startsWith(load.date));
    assert.ok(load.jumps.length >= (load.jumps.some((jump) => jump.type === "Tandem student") ? 3 : 4));
    assert.ok(load.jumps.length <= 5);
    assert.equal(groundPersonError(load), "");
    assert.ok(loadWeights(load, AIRCRAFT_EMPTY_WEIGHTS[load.plane]).remaining >= 0, `Overweight: ${load.id}`);
    assert.equal(new Set(load.jumps.map((jump) => jump.skydiverId)).size, load.jumps.length);
    days.set(load.date, [...(days.get(load.date) ?? []), load.number]);
    for (const jump of load.jumps) {
      assert.ok(availableJumpTypes(members.find((member) => member.id === jump.skydiverId)).includes(jump.type));
      if (jump.type === "Student") {
        assert.ok(jump.exercise);
        assert.ok(hasInstructor(jump, load.jumps));
      }
    }
  }
  for (const numbers of days.values()) assert.deepEqual(numbers.sort((a, b) => a - b), [1, 2, 3, 4, 5]);
  const stats = loadStatistics(historySeed);
  assert.ok(new Set(stats.all.map((entry) => entry.count)).size >= 4);
  assert.ok(new Set(stats.students.map((entry) => entry.count)).size >= 4);
  assert.ok(stats.all[0].count < 50);
  const groundCounts = new Map();
  for (const load of historySeed) groundCounts.set(load.groundPersonId, (groundCounts.get(load.groundPersonId) ?? 0) + 1);
  assert.equal([...groundCounts].sort((a, b) => b[1] - a[1])[0][0], person("Eero Peltosaari").id);
});

test("season chart accumulates actual jumps within March–October and stops at today", () => {
  const season = seasonProgress(historySeed, "2026-10-26");
  assert.equal(season.start, "2026-03-01");
  assert.equal(season.end, "2026-10-31");
  assert.equal(season.goal, 500);
  const studentSeason = seasonProgress(historySeed, "2026-10-26", true);
  assert.equal(studentSeason.goal, 150);
  const tandemSeason = seasonProgress(historySeed, "2026-10-26", false, true);
  assert.equal(tandemSeason.goal, 50);
  assert.equal(tandemSeason.total, 6);
  assert.equal(studentSeason.total, loadStatistics(historySeed).totals.students);
  assert.equal(season.total, loadStatistics(historySeed).totals.jumps);
  assert.equal(season.points.at(-1).date, "2026-10-26");
  const earlier = seasonProgress(historySeed, "2026-04-01");
  assert.ok(earlier.total < season.total);
  assert.equal(earlier.points.at(-1).date, "2026-04-01");
  assert.equal(seasonProgress(historySeed, "2026-02-01").total, 0);
  assert.equal(seasonProgress(historySeed, "2027-10-26").total, 0);
});

test("statistics count personal tandem jumps, assigned student drops and completed pilot loads", () => {
  const instructor = createJump(person("Matti Pilviniemi").id);
  instructor.type = "Instructor";
  const student = { ...createJump(person("Riku Harjuniitty").id), instructorId: instructor.skydiverId };
  const tandemInstructor = { ...createJump(person("Heikki Kuusiranta").id), type: "Tandem instructor" };
  const tandemStudent = { ...createJump(skydivers.find((member) => member.roles.includes("Tandem student")).id), type: "Tandem student" };
  const returned = { ...createJump(person("Tuure Kalliosaari").id), returnedByPlane: true };
  const load = { ...createLoad(1), flightState: "Dropped", jumps: [instructor, student, tandemInstructor, tandemStudent, returned] };
  const stats = loadStatistics([load, load, { ...createLoad(2), jumps: [returned] }]);
  assert.equal(stats.all.reduce((sum, item) => sum + item.count, 0), 4);
  assert.equal(stats.students[0].id, student.skydiverId);
  assert.equal(stats.instructors[0].id, instructor.skydiverId);
  assert.equal(stats.instructors[0].count, 1);
  assert.equal(stats.tandems[0].id, tandemInstructor.skydiverId);
  assert.equal(stats.pilots[0].count, 1);
  assert.equal(stats.totals.loads, 1);
  assert.equal(stats.totals.jumps, 4);
  assert.equal(stats.totals.students, 1);
  assert.equal(stats.totals.jumpers, 4);
  assert.equal(stats.totals.days, 1);
  assert.deepEqual(stats.totals.loadsByPlane, [[load.plane, 1]]);
  assert.equal(stats.altitudes.reduce((sum, item) => sum + item.count, 0), 4);
});

test("load numbers stay consecutive through deletion, reorder and saved-load editing", () => {
  const first = { ...createLoad(2, "load-first"), status: "queued", hasBeenSaved: true };
  const middle = { ...createLoad(5, "load-middle"), status: "queued", hasBeenSaved: true };
  const last = { ...createLoad(9, "load-last"), status: "queued", hasBeenSaved: true };
  const draft = createLoad(20, "load-draft");
  const normalized = renumberLoads([draft, first, middle, last]);
  assert.deepEqual(normalized.map((load) => load.number), [1, 2, 3, 4]);
  assert.deepEqual(normalized.map((load) => load.id), [first.id, middle.id, last.id, draft.id]);
  const deleted = renumberLoads(normalized.filter((load) => load.id !== middle.id));
  assert.deepEqual(deleted.map((load) => load.number), [1, 2, 3]);
  const reordered = renumberLoads(reorderQueuedLoads(deleted, last.id, first.id));
  assert.deepEqual(reordered.map((load) => load.id), [last.id, first.id, draft.id]);
  assert.deepEqual(reordered.map((load) => load.number), [1, 2, 3]);
  const editing = renumberLoads(normalized.map((load) => load.id === middle.id ? { ...load, status: "planning" } : load));
  assert.equal(editing.find((load) => load.id === middle.id).number, 2);
  assert.equal(new Set(editing.map((load) => load.id)).size, 4);
});

test("wing loading converts kilograms to pounds and rejects missing sizes", () => {
  assert.ok(Math.abs(wingLoading(85, 190) - 0.9862785413) < 0.000001);
  assert.equal(wingLoading(85, 0), null);
  assert.equal(wingLoading(0, 190), null);
});
const jump = (name, type) => ({
  ...createJump(person(name).id),
  ...(type ? { type } : {}),
});

test("registry contains exactly 100 unique members and preserves supplied data", () => {
  assert.equal(members.length, 100);
  const today = new Date().toLocaleDateString("sv-SE");
  assert.ok(members.every((member) => member.membershipStartDate >= "2023-01-01" && member.membershipStartDate <= today));
  assert.equal(person("Jouko Saarivaara").city, "Helsinki");
  assert.equal(members.filter((member) => member.city === "Oulu").length, 99);
  assert.equal(new Set(members.map((member) => member.email)).size, 100);
  assert.ok(members.every((member) => /^[^\s@]+@example\.com$/.test(member.email)));
  assert.equal(new Set(members.map((member) => member.id)).size, 100);
  assert.equal(new Set(members.map((member) => member.name)).size, 100);
  assert.ok(members.every((member) => member.fictional));
  assert.equal(members.filter((member) => /^member-demo-\d{3}$/.test(member.id)).length, 45);
  assert.equal(pilots.length, 7);
  assert.equal(skydivers.length, 93);
  // The final 54 members are the original generated student/licensed cohort.
  const generated = members.slice(46);
  assert.equal(generated.length, 54);
  assert.equal(
    generated.filter((member) => member.roles.includes("Tandem student"))
      .length,
    2,
  );
  for (const member of generated) {
    assert.ok(
      member.roles.every((role) =>
        ["Licensed", "Student", "Tandem student"].includes(role),
      ),
    );
    assert.equal(
      member.membershipType,
      member.roles.includes("Tandem student") ? "Tandem" : "Default",
    );
  }
  assert.equal(person("Kalle Havulahti").membershipType, "Honorary");
  assert.equal(person("Rami Rysälä").membershipType, "Super honorary");
  assert.equal(person("Heikki Kuusiranta").weight, 110);
  assert.equal(pilots[0].weight, 60);
  assert.deepEqual(person("Samu Kuusivaara").roles, [
    "Licensed",
    "Tandem instructor",
    "Instructor",
    "Tandem camera",
  ]);
});
test("jump choices depend on qualifications; coach grants instructor duty", () => {
  assert.deepEqual(availableJumpTypes(person("Tuure Kalliosaari")), ["License"]);
  assert.deepEqual(availableJumpTypes(person("Arto Koivulahti")), [
    "License",
    "Instructor",
    "Tandem instructor",
  ]);
  assert.deepEqual(availableJumpTypes(person("Ilkka Pihlaniemi")), [
    "License",
    "Instructor",
    "Tandem camera",
  ]);
  assert.equal(jumpRole(jump("Ilkka Pihlaniemi")), "Licensed");
  assert.equal(jumpRole(jump("Heikki Kuusiranta")), "Licensed");
});
test("only assigned instructor duty qualifies for free jumps and student references", () => {
  const fun = jump("Ilkka Pihlaniemi");
  const instruction = jump("Ilkka Pihlaniemi", "Instructor");
  const student = { ...jump("Riku Harjuniitty"), instructorId: fun.skydiverId };
  assert.equal(hasInstructor(student, [fun, student]), false);
  assert.equal(hasInstructor(student, [instruction, student]), true);
  assert.equal(jumpPrice(fun, [fun, student]), 32);
  assert.equal(jumpPrice(instruction, [instruction, student]), 0);
  assert.equal(
    jumpPrice(instruction, [instruction, { ...student, instructorId: "" }]),
    32,
  );
  const coach = jump("Arto Koivulahti", "Instructor");
  assert.equal(
    hasInstructor({ ...student, instructorId: coach.skydiverId }, [
      coach,
      student,
    ]),
    true,
  );
  assert.equal(
    jumpPrice(jump("Ilkka Pihlaniemi", "Tandem camera"), [student]),
    32,
  );
});
test("licensed and student pricing remains correct", () => {
  assert.deepEqual(
    altitudes.map((altitude) =>
      jumpPrice({ ...jump("Tuure Kalliosaari"), altitude }, []),
    ),
    [17, 23, 28, 30, 32, 40],
  );
  assert.deepEqual(
    altitudes.map((altitude) =>
      jumpPrice({ ...jump("Riku Harjuniitty"), altitude }, []),
    ),
    [30, 30, 30, 45, 45, 45],
  );
});
test("selected tandem duties reserve seats while fun jumps do not", () => {
  const instructor = jump("Heikki Kuusiranta", "Tandem instructor");
  const student = jump("Emilia Meriluoto");
  const regular = ["Tuure Kalliosaari", "Sakari Lehtivaara", "Elina Koivuniemi"].map((name) =>
    jump(name),
  );
  assert.deepEqual(
    seatingPositions([...regular, instructor, student]).map(
      (item) => item?.skydiverId,
    ),
    [
      regular[0].skydiverId,
      regular[1].skydiverId,
      instructor.skydiverId,
      student.skydiverId,
      regular[2].skydiverId,
    ],
  );
  assert.equal(
    seatingPositions([jump("Heikki Kuusiranta")])[0].skydiverId,
    instructor.skydiverId,
  );
  assert.deepEqual(tandemWarnings([instructor, student]), []);
  assert.equal(tandemWarnings([instructor]).length, 1);
  assert.equal(tandemWarnings([student]).length, 1);
  assert.equal(jumpPrice(instructor, [student]), null);
});
test("CG uses new pilot weights and actual occupied seats", () => {
  const load = {
    ...createLoad(1),
    jumps: [jump("Heikki Kuusiranta", "Tandem instructor")],
  };
  const expected =
    (805 * 38.15 + 60 * 37 + 64.8 * 46.5 + 110 * 65) / (805 + 60 + 64.8 + 110);
  assert.ok(Math.abs(loadBalance(load, 805).arm - expected) < 1e-10);
  assert.equal(loadWeights(load, 805).jumpers, 110);
  assert.equal(loadWeights({ ...load, pilotId: pilots[1].id }, 805).pilot, 73);
});
test("CG boundaries include the upper aft step", () => {
  assert.equal(isWithinCgEnvelope(33, 1800), true);
  assert.equal(isWithinCgEnvelope(37, 2675), true);
  assert.equal(isWithinCgEnvelope(36.99, 2675), false);
  assert.equal(isWithinCgEnvelope(48.5, 2950), true);
  assert.equal(isWithinCgEnvelope(48, 2951), false);
  assert.equal(isWithinCgEnvelope(46, 3100), true);
  assert.equal(isWithinCgEnvelope(45, 3101), false);
});
test("moves preserve details, uniqueness and capacity and lock saved loads", () => {
  let loads = [createLoad(1), createLoad(2)];
  for (const name of [
    "Tuure Kalliosaari",
    "Sakari Lehtivaara",
    "Elina Koivuniemi",
    "Ilkka Pihlaniemi",
    "Riku Harjuniitty",
  ])
    loads = moveSkydiver(loads, person(name).id, "load-1");
  assert.equal(loads[0].jumps.length, 5);
  assert.equal(
    moveSkydiver(loads, person("Hanna Metsälahti").id, "load-1"),
    loads,
  );
  loads[0].jumps[4].additionalInfo = "Radio";
  loads = moveSkydiver(loads, person("Riku Harjuniitty").id, "load-2");
  assert.equal(loads[1].jumps[0].additionalInfo, "Radio");
  assert.equal(
    loads
      .flatMap((load) => load.jumps)
      .filter((item) => item.skydiverId === person("Riku Harjuniitty").id)
      .length,
    1,
  );
  loads[1].status = "queued";
  assert.equal(moveSkydiver(loads, person("Riku Harjuniitty").id, null), loads);
});
test("flight states preserve editing and stop at boundaries", () => {
  let loads = [createLoad(1)];
  for (const state of flightStates) {
    assert.equal(loadFlightState(loads[0]), state);
    assert.equal(loads[0].status, "planning");
    loads = changeFlightState(loads, "load-1", 1);
  }
  assert.equal(loadFlightState(loads[0]), "Dropped");
  loads = changeFlightState(loads, "load-1", -1);
  assert.equal(loadFlightState(loads[0]), "In the air");
});
test("load ordering preserves an active editor", () => {
  const loads = [
    { ...createLoad(1), status: "queued" },
    createLoad(2),
    { ...createLoad(3), status: "queued" },
  ];
  assert.deepEqual(
    reorderQueuedLoads(loads, "load-3", "load-1").map((load) => load.number),
    [3, 2, 1],
  );
});
