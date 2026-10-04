// Development-only generator. The deployed app imports the committed snapshots, never this script.
import { writeFileSync } from "node:fs";
import { members } from "../src/data/members.ts";
import { availableJumpTypes, seatingPositions } from "../src/data/manifest.ts";

let seed = 20261026;
const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };
const snapshot = members.map((member, index) => ({
  ...member,
  email: `${member.id.slice(7).replaceAll("-", ".")}.${1000 + index}@example.com`,
  membershipStartDate: new Date(Date.UTC(2023, 0, 1) + (index * 37 % 1300) * 86400000).toISOString().slice(0, 10),
}));
const writeSnapshot = (file, type, name, data, source) => writeFileSync(new URL(file, import.meta.url),
  `// Fixed demo data. Regenerate explicitly with scripts/generate-demo-data.mjs.\nimport type { ${type} } from "${source}";\n\nexport const ${name}: ${type}[] = ${JSON.stringify(data, null, 2)};\n`);
writeSnapshot("../src/data/memberSeed.ts", "Member", "memberSeed", snapshot, "./members.ts");

const juha = snapshot.find((member) => member.name === "Eero Peltosaari");
const pilots = snapshot.filter((member) => member.roles.includes("Pilot"));
// Regulars, occasional visitors, and varying attendance produce uneven personal totals.
const activity = new Map(snapshot.map((person) => [person.id, 0.15 + random() ** 3 * 6]));
const attendance = Array.from({ length: 20 }, () => new Map(snapshot.map((person) =>
  [person.id, random() < 0.3 ? 0.03 : 0.5 + random()])));
const choose = (people, day) => {
  const weight = (person) => activity.get(person.id) * attendance[day].get(person.id);
  let ticket = random() * people.reduce((sum, person) => sum + weight(person), 0);
  return people.find((person) => (ticket -= weight(person)) <= 0) ?? people.at(-1);
};
const patterns = [
  ...Array(28).fill("license3500"), ...Array(24).fill("license1000"),
  ...Array(20).fill("student1000"), ...Array(10).fill("mixedLicense"),
  ...Array(6).fill("student3500"), ...Array(6).fill("student1800"), ...Array(6).fill("tandem"),
];
// Mix the patterns across days while preserving their deliberately weighted frequencies.
for (let index = patterns.length - 1; index > 0; index--) {
  const other = Math.floor(random() * (index + 1));
  [patterns[index], patterns[other]] = [patterns[other], patterns[index]];
}
const history = patterns.map((pattern, index) => {
  const jumps = [];
  const add = (type, altitude, exercise, instructorId = "") => {
    const candidates = snapshot.filter((person) => person.id !== juha.id &&
      !jumps.some((jump) => jump.skydiverId === person.id) && availableJumpTypes(person).includes(type) &&
      (person.weight <= 96 || type === "Tandem instructor"));
    const person = choose(candidates, Math.floor(index / 5));
    if (!person) throw new Error(`No candidate for ${type}`);
    jumps.push({ skydiverId: person.id, type, altitude, instructorId, ...(exercise ? { exercise } : {}) });
    return person.id;
  };
  const five = index % 2 === 0;
  if (pattern.startsWith("license") || pattern === "mixedLicense") {
    const altitude = pattern === "license1000" ? 1000 : 3500;
    add("License", pattern === "mixedLicense" ? 1000 : altitude);
    while (jumps.length < (five ? 5 : 4)) add("License", altitude);
  } else if (pattern === "student1000") {
    const instructor = add("Instructor", 1000);
    while (jumps.length < (five ? 5 : 4)) add("Student", 1000, ["PL1", "PL2", "PL3", "HV1", "HV2", "HV3"][Math.floor(random() * 6)], instructor);
  } else if (pattern === "student3500") {
    const first = add("Instructor", 3500);
    const second = add("Instructor", 3500);
    add("Student", 3500, "Ryhmähyppy", first);
    add("Student", 3500, "Vapaavalintainen", second);
  } else if (pattern === "student1800") {
    const instructor = add("Instructor", 1800);
    add("Student", 1000, "PL3", instructor);
    add("Student", 1200, "5 sek", instructor);
    add("Student", 1800, "15 sek", instructor);
  } else {
    add("Tandem instructor", 3500);
    add("Tandem student", 3500);
    add("Tandem camera", 3500);
    if (five) add("License", 3500);
  }
  const firstDay = Date.UTC(2026, 2, 1);
  const lastDay = Date.UTC(2026, 9, 20);
  const seasonDays = (lastDay - firstDay) / 86400000;
  const peakDay = (Date.UTC(2026, 6, 15) - firstDay) / 86400000;
  // Triangular seasonal density: sparse at the edges, busiest around 15 July.
  const quantile = Math.floor(index / 5) / 19;
  const offset = quantile <= peakDay / seasonDays
    ? Math.sqrt(quantile * seasonDays * peakDay)
    : seasonDays - Math.sqrt((1 - quantile) * seasonDays * (seasonDays - peakDay));
  const date = new Date(firstDay + Math.round(offset) * 86400000).toISOString().slice(0, 10);
  const groundPool = snapshot.filter((person) => person.roles.includes("Licensed") && person.id !== juha.id && !jumps.some((jump) => jump.skydiverId === person.id));
  const highest = Math.max(...jumps.map((jump) => jump.altitude));
  return {
    id: `load-demo-history-${index + 1}`, number: index % 5 + 1, date,
    jumpedAt: `${date}T${String(8 + index % 5).padStart(2, "0")}:30:00Z`,
    plane: index % 2 ? "OH-CVE" : "OH-EKO", pilotId: choose(pilots, Math.floor(index / 5)).id,
    groundPersonId: index < 65 ? juha.id : groundPool[Math.floor(random() * groundPool.length)].id,
    fuel: highest === 1000 ? 35 : 50, flightTimeMinutes: highest === 1000 ? 12 + index % 4 : highest === 1800 ? 18 + index % 4 : 25 + index % 6,
    status: "queued", hasBeenSaved: true, flightState: "Dropped",
    jumps: seatingPositions(jumps).filter(Boolean),
  };
});
writeSnapshot("../src/data/historySeed.ts", "Load", "historySeed", history, "./manifest.ts");
