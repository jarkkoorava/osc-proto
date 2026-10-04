import { useEffect, useState } from "react";
import { membersById } from "./data/members";
import { emptyMemberDetails, waiverTerms, waiverTypeLabels } from "./data/waiver";
import type { Waiver } from "./data/waiver";

const storageKey = "osc-waivers-v2";
const readWaivers = (raw: string | null): Waiver[] => {
  try {
    const data = JSON.parse(raw ?? "[]");
    if (!Array.isArray(data)) return [];
    const latest = new Map<string, Waiver>();
    for (const waiver of data) {
      // Existing records were licensed-jumper waivers.
      if (waiver && waiver.type === undefined) waiver.type = "licensed";
      if (!membersById.has(waiver?.memberId) || !Number.isFinite(Date.parse(waiver.submittedAt)) ||
        !Object.hasOwn(waiverTypeLabels, waiver.type) ||
        typeof waiver.name !== "string" || typeof waiver.email !== "string" || typeof waiver.city !== "string" ||
        !Number.isFinite(waiver.weight) || waiver.weight <= 0 ||
        !waiver.details || typeof waiver.details.inspectionsValidUntil !== "string" ||
        !Array.isArray(waiver.acceptedTerms) || waiver.acceptedTerms.length !== waiverTerms.length ||
        !waiver.acceptedTerms.every((accepted: unknown) => accepted === true) || typeof waiver.marketingConsent !== "boolean") continue;
      waiver.details = { ...emptyMemberDetails(), ...waiver.details };
      latest.set(`${waiver.memberId}:${waiver.type}`, waiver);
    }
    return [...latest.values()];
  } catch { return []; }
};

export const useWaivers = () => {
  const [waivers, setWaivers] = useState(() => {
    try { return readWaivers(localStorage.getItem(storageKey)); } catch { return []; }
  });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const receive = (event: StorageEvent) => {
      if (event.key === storageKey) setWaivers(readWaivers(event.newValue));
    };
    window.addEventListener("storage", receive);
    return () => window.removeEventListener("storage", receive);
  }, []);
  const saveWaiver = (waiver: Waiver) => {
    let current = waivers;
    try { current = readWaivers(localStorage.getItem(storageKey)); } catch { /* Keep in-memory data. */ }
    const next = [...current.filter((record) => record.memberId !== waiver.memberId || record.type !== waiver.type), waiver];
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setStorageError(false);
    } catch { setStorageError(true); }
    setWaivers(next);
  };
  return { waivers, saveWaiver, storageError };
};
