import { membersById, pilots, todayDate } from "./members.ts";
import type { Member, Role } from "./members.ts";
export { members, skydivers, pilots, primaryRole } from "./members.ts";
export type { Role, MembershipType, Member } from "./members.ts";
export type Skydiver = Member;
export type Jump = {
  returnedByPlane?: boolean;
  skydiverId: string;
  altitude: number; // 0 means an instructor's queued/planned altitude is not selected yet.
  type: string;
  instructorId: string;
  exercise?: string;
  highOpening?: boolean;
  wingsuit?: boolean;
  gearRental?: boolean;
  additionalInfo?: string;
};
export type Load = {
  date?: string;
  jumpedAt?: string;
  groundPerson?: string;
  groundPersonId?: string;
  flightTimeMinutes?: number;
  id: string;
  number: number;
  plane: string;
  pilotId: string;
  fuel: number;
  jumps: Jump[];
  status: "planning" | "queued";
  flightState?: FlightState;
  hasBeenSaved?: boolean;
  additionalInfo?: string;
};
export const flightStates = [
  "Planning",
  "At the plane",
  "In the air",
  "Dropped",
] as const;
export type FlightState = (typeof flightStates)[number];
export const loadFlightState = (load: Load): FlightState => {
  return (
    load.flightState ??
    "Planning"
  );
};
export const changeFlightState = (
  loads: Load[],
  id: string,
  direction: number,
): Load[] => {
  return loads.map((load) => {
    if (load.id !== id) return load;
    const index = flightStates.indexOf(loadFlightState(load));
    const flightState = flightStates[Math.min(flightStates.length - 1, Math.max(0, index + Math.sign(direction)))];
    return {
      ...load,
      flightState,
      jumpedAt: flightState === "Dropped" ? load.jumpedAt ?? new Date().toISOString() : undefined,
    };
  });
};

export const planes = ["OH-EKO", "OH-CVE"];
export const altitudes = [1000, 1500, 2000, 3000, 3500, 4000];
export const jumpTypes = [
  "License",
  "Student",
  "Instructor",
  "Tandem instructor",
  "Tandem student",
  "Tandem camera",
];
export const roleClass = (role: string) =>
  role.toLowerCase().replaceAll(" ", "-");
export const availableJumpTypes = (member: Member): string[] => {
  const types: string[] = [];
  if (member.roles.includes("Licensed")) types.push("License");
  if (
    member.roles.some((role) => role === "Instructor" || role === "SIL-Coach")
  )
    types.push("Instructor");
  if (member.roles.includes("Student")) types.push("Student");
  if (member.roles.includes("Tandem instructor"))
    types.push("Tandem instructor");
  if (member.roles.includes("Tandem student")) types.push("Tandem student");
  if (member.roles.includes("Tandem camera")) types.push("Tandem camera");
  return types;
};
export const jumpRole = (jump: Jump): Role => {
  return jump.type === "License" ? "Licensed" : (jump.type as Role);
};
export const seatingPositions = (jumps: Jump[]) => {
  const seats: (Jump | undefined)[] = Array(5).fill(undefined);
  const regular: Jump[] = [];
  for (const jump of jumps) {
    const role = jumpRole(jump);
    if (role === "Tandem instructor" && !seats[2]) seats[2] = jump;
    else if (role === "Tandem student" && !seats[3]) seats[3] = jump;
    else regular.push(jump);
  }
  for (const jump of regular) seats[seats.findIndex((seat) => !seat)] = jump;
  return seats;
};
export const tandemWarnings = (jumps: Jump[]) => {
  if (
    ["Tandem instructor", "Tandem student"].some(
      (type) => jumps.filter((jump) => jump.type === type).length > 1,
    )
  )
    return [
      "Pokassa on tilaa yhdelle tandemparille. Tarkista tandemhyppääjät.",
    ];
  const instructor = jumps.some(
    (jump) => jumpRole(jump) === "Tandem instructor",
  );
  const student = jumps.some((jump) => jumpRole(jump) === "Tandem student");
  return instructor && !student
    ? ["Tandemhyppymestari tarvitsee tandemoppilaan samalle pokalle."]
    : student && !instructor
      ? ["Tandemoppilas tarvitsee tandemhyppymestarin samalle pokalle."]
      : [];
};
export const studentExercises = [
  { name: "PL1", shortName: "PL1", altitude: 1000 },
  { name: "PL2", shortName: "PL2", altitude: 1000 },
  { name: "PL3", shortName: "PL3", altitude: 1000 },
  { name: "HV1", shortName: "HV1", altitude: 1000 },
  { name: "HV2", shortName: "HV2", altitude: 1000 },
  { name: "HV3", shortName: "HV3", altitude: 1000 },
  { name: "3 sek", shortName: "3 sek", altitude: 1100 },
  { name: "5 sek", shortName: "5 sek", altitude: 1200 },
  { name: "10 sek", shortName: "10 sek", altitude: 1600 },
  { name: "15 sek", shortName: "15 sek", altitude: 1800 },
  { name: "Suora UH", shortName: "Suora", altitude: 1800 },
  { name: "Sukellus-UH", shortName: "Sukellus", altitude: 1800 },
  { name: "360 käännökset", shortName: "360", altitude: 3000 },
  { name: "Selkälento", shortName: "Selkä", altitude: 3000 },
  { name: "Tynnyri ja takavlotti", shortName: "Tynnyri", altitude: 3000 },
  { name: "Liuku", shortName: "Liuku", altitude: 3000 },
  { name: "FS-Liuku", shortName: "FS-Liuku", altitude: 3000 },
  { name: "Ryhmähyppy", shortName: "FS", altitude: 3000 },
  { name: "Vapaavalintainen", shortName: "Vapaa", altitude: 3000 },
  { name: "Koehyppy", shortName: "Koe", altitude: 3000 },
  { name: "Kuvunkäsittely", shortName: "Kupu", altitude: 2000 },
  { name: "Hupihyppy", shortName: "hupi", altitude: 3000 },
];
export const studentAltitudes = [
  ...new Set([
    ...altitudes,
    ...studentExercises.map((exercise) => exercise.altitude),
  ]),
].sort((a, b) => a - b);
export const roles: Role[] = [
  "Licensed",
  "Instructor",
  "Student",
  "Tandem instructor",
  "Tandem student",
  "Tandem camera",
  "SIL-Coach",
];
export const MTOM = 1406;
export const FUEL_DENSITY = 0.72;
export const MAX_JUMPERS = 5;
export const AIRCRAFT_EMPTY_WEIGHTS: Record<string, number> = {
  "OH-EKO": 805,
  "OH-CVE": 825,
};
export const AIRCRAFT_EMPTY_ARMS: Record<string, number> = {
  "OH-EKO": 38.15,
  "OH-CVE": 34.65,
};
export const FUEL_ARM = 46.5;
export const PILOT_ARM = 37;
export const JUMPER_ARMS = [31, 59, 65, 88, 82];
export const KG_PER_LB = 0.45359237;
// Envelope coordinates: inches aft of datum, pounds.
export const CG_ENVELOPE = [
  [33, 1800],
  [33, 2250],
  [41, 3100],
  [46, 3100],
  [46, 2950],
  [48.5, 2950],
  [48.5, 1800],
] as const;

export const isWithinCgEnvelope = (arm: number, weightLb: number) => {
  const forward = weightLb <= 2250 ? 33 : 33 + ((weightLb - 2250) * 8) / 850;
  const aft = weightLb <= 2950 ? 48.5 : 46;
  return weightLb >= 1800 && weightLb <= 3100 && arm >= forward && arm <= aft;
};

export const loadBalance = (load: Load, emptyWeight: number) => {
  const weights = loadWeights(load, emptyWeight);
  const moment =
    emptyWeight * AIRCRAFT_EMPTY_ARMS[load.plane] +
    weights.pilot * PILOT_ARM +
    weights.fuel * FUEL_ARM +
    seatingPositions(load.jumps).reduce(
      (sum, jump, index) =>
        sum +
        (jump ? findSkydiver(jump.skydiverId).weight * JUMPER_ARMS[index] : 0),
      0,
    );
  const arm = moment / weights.total;
  const weightLb = weights.total / KG_PER_LB;
  return {
    arm,
    weightLb,
    total: weights.total,
    withinLimits: isWithinCgEnvelope(arm, weightLb) && weights.total <= MTOM,
  };
};
export const findSkydiver = (id: string) => membersById.get(id)!;

// Keep identity stable while display numbers follow saved queue order. Unsaved drafts come last.
export const renumberLoads = (loads: Load[]): Load[] => {
  const ordered = [
    ...loads.filter((load) => load.status === "queued" || load.hasBeenSaved),
    ...loads.filter((load) => load.status === "planning" && !load.hasBeenSaved),
  ];
  return ordered.map((load, index) => load.number === index + 1 ? load : { ...load, number: index + 1 });
};

export const createLoad = (number: number, id = `load-${number}`): Load => {
  return {
    date: todayDate(),
    id,
    number,
    plane: planes[0],
    pilotId: pilots[0].id,
    fuel: 90,
    jumps: [],
    status: "planning",
    flightState: "Planning",
  };
};
export const createJump = (skydiverId: string): Jump => {
  const type = availableJumpTypes(findSkydiver(skydiverId))[0];
  const student = type === "Student";
  return {
    skydiverId,
    altitude: student ? 2000 : 3500,
    type,
    instructorId: "",
  };
};
export const LICENSE_JUMP_PRICES: Record<number, number> = {
  1000: 17, 1500: 23, 2000: 28, 3000: 30, 3500: 32, 4000: 40,
};
export const jumpPrice = (jump: Jump, jumps: Jump[], licensePrices = LICENSE_JUMP_PRICES): number | null => {
  const role = jumpRole(jump);
  if (role === "Licensed") return licensePrices[jump.altitude] ?? LICENSE_JUMP_PRICES[jump.altitude];
  if (role === "Tandem instructor" || role === "Tandem student") return null;
  if (role === "Student") return jump.altitude <= 2000 ? 30 : 45;
  if (
    role === "Instructor" &&
    jumps.some(
      (other) =>
        jumpRole(other) === "Student" && other.instructorId === jump.skydiverId,
    )
  )
    return 0;
  return LICENSE_JUMP_PRICES[jump.altitude] ?? null;
};
export const hasInstructor = (jump: Jump, jumps: Jump[]): boolean => {
  return jumps.some(
    (other) =>
      other.skydiverId === jump.instructorId &&
      jumpRole(other) === "Instructor",
  );
};
export const groundPersonError = (load: Load): string => {
  if (load.groundPersonId) {
    if (!findSkydiver(load.groundPersonId)?.roles.includes("Licensed")) return "Maahenkilön pitää olla lisenssihyppääjä.";
    if (load.jumps.some((jump) => jump.skydiverId === load.groundPersonId)) return "Maahenkilö ei voi olla pokan hyppääjä.";
  } else if (load.jumps.some((jump) => jump.type === "Student" || jump.type.startsWith("Tandem"))) {
    return "Oppilas- ja tandempokalle on valittava maahenkilö.";
  }
  return "";
};
export const loadWeights = (load: Load, emptyWeight: number) => {
  const pilot = pilots.find((person) => person.id === load.pilotId)!;
  const fuel = load.fuel * FUEL_DENSITY;
  const jumpers = load.jumps.reduce(
    (sum, jump) => sum + findSkydiver(jump.skydiverId).weight,
    0,
  );
  const total = emptyWeight + pilot.weight + fuel + jumpers;
  return {
    pilot: pilot.weight,
    fuel,
    jumpers,
    total,
    remaining: MTOM - total,
    jumperAllowance: MTOM - emptyWeight - pilot.weight - fuel,
  };
};

// A jumper belongs to the queue or one active load; completed jumps stay intact.
export const moveSkydiver = (
  loads: Load[],
  skydiverId: string,
  targetLoadId: string | null,
  beforeId?: string,
  queueJumps: Record<string, Jump> = {},
): Load[] => {
  const source = loads.find((load) =>
    loadFlightState(load) !== 'Dropped' && load.jumps.some((jump) => jump.skydiverId === skydiverId),
  );
  const target = loads.find((load) => load.id === targetLoadId);
  if (target && loadFlightState(target) === 'Dropped') return loads;
  if (target?.groundPersonId === skydiverId) return loads;
  if (source?.status === "queued" || target?.status === "queued") return loads;
  if (targetLoadId !== null && !target) return loads;
  if (target && source?.id !== target.id && target.jumps.length >= MAX_JUMPERS)
    return loads;
  if (beforeId === skydiverId) return loads;
  const jump =
    source?.jumps.find((item) => item.skydiverId === skydiverId) ??
    { ...(queueJumps[skydiverId] ?? createJump(skydiverId)), returnedByPlane: false };
  if (
    target &&
    ["Tandem instructor", "Tandem student"].includes(jump.type) &&
    target.jumps.some(
      (other) => other.skydiverId !== skydiverId && other.type === jump.type,
    )
  )
    return loads;
  return loads.map((load) => {
    if (loadFlightState(load) === 'Dropped') return load;
    const jumps = load.jumps.filter((item) => item.skydiverId !== skydiverId);
    if (load.id === targetLoadId) {
      const index = beforeId
        ? jumps.findIndex((item) => item.skydiverId === beforeId)
        : -1;
      jumps.splice(index < 0 ? jumps.length : index, 0, jump);
    }
    return {
      ...load,
      jumps: seatingPositions(jumps).filter((jump): jump is Jump =>
        Boolean(jump),
      ),
    };
  });
};

export const reorderQueuedLoads = (
  loads: Load[],
  activeId: string,
  overId: string,
): Load[] => {
  const queued = loads.filter((load) => load.status === "queued" && loadFlightState(load) !== "Dropped");
  const from = queued.findIndex((load) => load.id === activeId);
  const to = queued.findIndex((load) => load.id === overId);
  if (from < 0 || to < 0 || from === to) return loads;
  const [moved] = queued.splice(from, 1);
  queued.splice(to, 0, moved);
  let index = 0;
  return loads.map((load) =>
    load.status === "queued" && loadFlightState(load) !== "Dropped" ? queued[index++] : load,
  );
};
