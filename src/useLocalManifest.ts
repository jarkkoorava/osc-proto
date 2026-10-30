import { useEffect, useRef, useState } from "react";
import type { SetStateAction } from "react";
import { todayDate } from "./data/members";
import { demoHistory } from "./data/demoHistory";
import { reconcileTransactions } from "./data/transactions";
import type { Transaction } from "./data/transactions";
import {
  AIRCRAFT_EMPTY_WEIGHTS,
  LICENSE_JUMP_PRICES,
  altitudes,
  createLoad,
  createJump,
  jumpTypes,
  studentAltitudes,
  studentExercises,
  pilots,
  planes,
  skydivers,
  availableJumpTypes,
  flightStates,
  loadFlightState,
  renumberLoads,
} from "./data/manifest";
import type { Jump, Load } from "./data/manifest";

export const MANIFEST_STORAGE_KEY = "osc-manifest-v3";
type Manifest = {
  transactions?: Transaction[];
  aircraftWeightsVersion: 2;
  loads: Load[];
  history: Load[];
  demoHistoryVersion?: number;
  groundHistoryVersion?: number;
  nextLoad: number;
  queueIds: string[];
  queueMembershipVersion?: 1;
  queueJumps: Record<string, Jump>;
  licensePrices: Record<number, number>;
  emptyWeights: Record<string, number>;
};

const defaultManifest = (): Manifest => {
  return {
    aircraftWeightsVersion: 2,
    loads: [createLoad(1)],
    history: demoHistory(),
    demoHistoryVersion: 6,
    groundHistoryVersion: 1,
    nextLoad: 2,
    queueIds: skydivers.slice(0, 15).map((person) => person.id),
    queueMembershipVersion: 1,
    queueJumps: {},
    licensePrices: { ...LICENSE_JUMP_PRICES },
    emptyWeights: { ...AIRCRAFT_EMPTY_WEIGHTS },
  };
};

const splitDays = (data: Manifest): Manifest => {
  const today = todayDate();
  const current = data.loads.filter((load) => (load.date ?? today) === today);
  const archived = data.loads.filter((load) => load.date && load.date !== today);
  const history = [...new Map([...data.history, ...archived].map((load) => [load.id, load])).values()];
  return { ...data, history, loads: renumberLoads(current), nextLoad: current.length + 1 };
};

const parseManifestData = (raw: string | null): Manifest => {
  if (!raw) return defaultManifest();
  try {
    const data = JSON.parse(raw) as Manifest;
    if (!Array.isArray(data.loads)) return defaultManifest();
    data.history = Array.isArray(data.history) ? data.history : demoHistory();
    if (data.demoHistoryVersion !== 6) {
      const existing = new Map(data.history.map((load) => [load.id, load]));
      data.history = [
        ...demoHistory().map((load) => ({ ...load,
          flightTimeMinutes: existing.get(load.id)?.flightTimeMinutes ?? load.flightTimeMinutes,
        })),
        ...data.history.filter((load) => !load.id.startsWith("load-demo-history-")),
      ];
      data.demoHistoryVersion = 6;
    }
    if (data.groundHistoryVersion !== 1) {
      const seeded = new Map(demoHistory().map((load) => [load.id, load.groundPersonId]));
      data.history = data.history.map((load) => seeded.has(load.id) && !load.groundPersonId
        ? { ...load, groundPersonId: seeded.get(load.id), groundPerson: undefined } : load);
      data.groundHistoryVersion = 1;
    }
    const partitioned = splitDays(data);
    data.loads = partitioned.loads;
    data.history = partitioned.history;
    const seen = new Set<string>();
    if (
      !Array.isArray(data.loads) ||
      !planes.every(
        (plane) =>
          Number.isFinite(data.emptyWeights?.[plane]) &&
          data.emptyWeights[plane] > 0 &&
          data.emptyWeights[plane] <= 1406,
      )
    )
      return defaultManifest();
    const loadIds = new Set<string>();
    for (const load of data.loads) {
      if ((load.flightState as string) === "Saved") load.flightState = "Planning";
      load.date ??= todayDate();
      if ((load.flightState as string) === "Landed") load.flightState = "Dropped";
      if (
        load.flightState !== undefined &&
        !flightStates.includes(load.flightState)
      )
        return defaultManifest();
      load.flightState = loadFlightState(load);
      if (load.flightState === "Dropped") load.jumpedAt ??= `${load.date}T12:00:00Z`;
      if (
        !Number.isInteger(load.number) ||
        load.number < 1 ||
        typeof load.id !== "string" || !load.id.startsWith("load-") ||
        loadIds.has(load.id) ||
        !planes.includes(load.plane) ||
        !pilots.some((pilot) => pilot.id === load.pilotId) ||
        !Number.isFinite(load.fuel) ||
        load.fuel < 0 ||
        load.fuel > 1000 ||
        !["planning", "queued"].includes(load.status) ||
        !Array.isArray(load.jumps) ||
        load.jumps.length > 5
      )
        return defaultManifest();
      loadIds.add(load.id);
      const loadMembers = new Set<string>();
      for (const jump of load.jumps) {
        // Preserve existing loads when migrating the former jump categories.
        if (
          [
            "Solo",
            "Formation",
            "Freefly",
            "Tracking",
            "Hop & pop",
            "Training",
          ].includes(jump.type) &&
          skydivers.some((person) => person.id === jump.skydiverId)
        ) {
          jump.type = createJump(jump.skydiverId).type;
        }
        if (
          !skydivers.some((person) => person.id === jump.skydiverId) ||
          loadMembers.has(jump.skydiverId) ||
          (loadFlightState(load) !== "Dropped" && seen.has(jump.skydiverId)) ||
          (!(jump.type === 'Instructor' && jump.altitude === 0) && !((jump.type === "Student" || jump.type === "Instructor") ? studentAltitudes : altitudes).includes(
            jump.altitude,
          )) ||
          (jump.exercise !== undefined &&
            jump.exercise !== "" &&
            !studentExercises.some(
              (exercise) => exercise.name === jump.exercise,
            )) ||
          !jumpTypes.includes(jump.type) ||
          !availableJumpTypes(
            skydivers.find((person) => person.id === jump.skydiverId)!,
          ).includes(jump.type) ||
          typeof jump.instructorId !== "string"
          || (jump.returnedByPlane !== undefined && typeof jump.returnedByPlane !== "boolean")
        )
          return defaultManifest();
        loadMembers.add(jump.skydiverId);
        if (loadFlightState(load) !== "Dropped") seen.add(jump.skydiverId);
        if (
          jump.exercise === "Kuvunkäsittely" &&
          jump.highOpening === undefined
        )
          jump.highOpening = true;
        if (jump.type === "Student") jump.type = "Student";
      }
    }
    // Keep one editable load when restoring older multi-load planning sessions.
    let hasPlanningLoad = false;
    for (const load of data.loads) {
      if (load.status !== "planning") continue;
      if (hasPlanningLoad) load.status = "queued";
      else hasPlanningLoad = true;
    }
    // Apply the new aircraft weights once to existing saved manifests.
    return {
      ...data,
      loads: renumberLoads(data.loads),
      nextLoad: data.loads.length + 1,
      licensePrices: Object.fromEntries(altitudes.map((altitude) => {
        const price = data.licensePrices?.[altitude];
        return [altitude, typeof price === "number" && Number.isFinite(price) && price >= 0
          ? Math.round(price * 100) / 100 : LICENSE_JUMP_PRICES[altitude]];
      })),
      queueJumps: Object.fromEntries(skydivers.flatMap((person) => {
        const jump = data.queueJumps?.[person.id];
        if (!jump || jump.skydiverId !== person.id ||
          !availableJumpTypes(person).includes(jump.type) ||
          (!(jump.type === 'Instructor' && jump.altitude === 0) && !((jump.type === "Student" || jump.type === "Instructor") ? studentAltitudes : altitudes).includes(jump.altitude)) ||
          (jump.exercise && !studentExercises.some((exercise) => exercise.name === jump.exercise))) return [];
        return [[person.id, { ...createJump(person.id), ...jump }]];
      })),
      queueMembershipVersion: 1,
      queueIds: Array.isArray(data.queueIds)
        ? [...new Set(data.queueIds.filter((id) => skydivers.some((person) => person.id === id) &&
          (data.queueMembershipVersion === 1 || !data.loads.some(load => loadFlightState(load) === 'Dropped' && load.jumps.some(jump => jump.skydiverId === id)))))]
        : [...skydivers.filter((person) => !seen.has(person.id)).slice(0, 15).map((person) => person.id), ...seen],
      aircraftWeightsVersion: 2,
      emptyWeights:
        data.aircraftWeightsVersion === 2
          ? data.emptyWeights
          : { ...AIRCRAFT_EMPTY_WEIGHTS },
    };
  } catch {
    return defaultManifest();
  }
};

const withTransactions = (data: Manifest): Manifest => ({ ...data,
  transactions: reconcileTransactions(data.transactions, [...data.history, ...data.loads], data.licensePrices),
});
const parseManifest = (raw: string | null) => withTransactions(parseManifestData(raw));

export const useLocalManifest = () => {
  const [manifest, setManifestState] = useState<Manifest>(() => {
    try {
      return parseManifest(localStorage.getItem(MANIFEST_STORAGE_KEY));
    } catch {
      return withTransactions(defaultManifest());
    }
  });
  const setManifest = (action: SetStateAction<Manifest>) => {
    setManifestState((current) => {
      const next = typeof action === "function" ? action(current) : action;
      if (next === current) return current;
      return withTransactions(splitDays(next));
    });
  };
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setManifestState((current) => current.loads.some((load) => load.date && load.date !== todayDate())
        ? splitDays(current) : current);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  // Loading a tab must never write its initial snapshot over a newer plan.
  const receivedManifest = useRef<Manifest | null>(manifest);
  useEffect(() => {
    // A display tab receives updates without echoing them back into storage.
    if (manifest === receivedManifest.current) return;
    try {
      localStorage.setItem(MANIFEST_STORAGE_KEY, JSON.stringify(manifest));
      // oxlint-disable-next-line react/set-state-in-effect -- Report the external storage operation's result.
      setStorageError(false);
    } catch {
      // oxlint-disable-next-line react/set-state-in-effect -- Report the external storage operation's result.
      setStorageError(true);
    }
  }, [manifest]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === MANIFEST_STORAGE_KEY || event.key === null) {
        // Ignore older events if the operator has already saved a newer change.
        if (
          event.key === MANIFEST_STORAGE_KEY &&
          localStorage.getItem(MANIFEST_STORAGE_KEY) !== event.newValue
        )
          return;
        const next = parseManifest(event.newValue);
        receivedManifest.current = next;
        setManifestState(next);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return { manifest, setManifest, storageError };
};
