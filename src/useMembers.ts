import { useEffect, useState } from "react";
import { members, pilots, skydivers, todayDate } from "./data/members";
import type { Member, MembershipType } from "./data/members";
import { emptyMemberDetails } from "./data/waiver";

export type MemberProfile = Pick<Member, "name" | "city" | "email" | "weight" | "membershipType" | "roles" | "membershipStartDate" | "details">;
export const memberRoles: Member["roles"] = ["Licensed", "Instructor", "Student", "Tandem instructor", "Tandem student", "Tandem camera", "SIL-Coach", "Pilot"];
const refreshParticipants = () => {
  skydivers.splice(0, skydivers.length, ...members.filter((member) => member.roles.some((role) => role !== "Pilot")));
  pilots.splice(0, pilots.length, ...members.filter((member) => member.roles.includes("Pilot")));
};
const storageKey = "osc-members-v2";
export const membershipTypes: MembershipType[] = ["Default", "Honorary", "Super honorary", "Non-jumping", "Tandem"];
const applyProfiles = (raw: string | null) => {
  if (!raw) return;
  try {
    const profiles = JSON.parse(raw);
    if (!Array.isArray(profiles)) return;
    for (const profile of profiles) {
      const member = members.find((person) => person.id === profile?.id);
      if (!member || typeof profile.name !== "string" || !profile.name.trim() ||
        typeof profile.city !== "string" || !profile.city.trim() ||
        typeof profile.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) ||
        !Number.isFinite(profile.weight) || profile.weight <= 0 ||
        !membershipTypes.includes(profile.membershipType)) continue;
      Object.assign(member, { name: profile.name, city: profile.city, email: profile.email,
        weight: profile.weight, membershipType: profile.membershipType });
      if (profile.details && typeof profile.details === "object") {
        const details = emptyMemberDetails();
        for (const key of Object.keys(details) as (keyof typeof details)[]) {
          const value = profile.details[key];
          if (key === "clubGearOnly") {
            if (typeof value === "boolean") details.clubGearOnly = value;
          } else if (key === "silMember") {
            if (value === true || value === false || value === null) details.silMember = value;
          } else if (key === "license") {
            if (["", "Student", "A", "B", "C", "D", "None"].includes(value)) details.license = value;
          } else if (typeof value === "string") details[key] = value;
        }
        member.details = details;
      }
      // Existing saved profiles receive their generated seed date on first load.
      if (typeof profile.membershipStartDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(profile.membershipStartDate) &&
        Number.isFinite(Date.parse(profile.membershipStartDate)) &&
        new Date(profile.membershipStartDate).toISOString().slice(0, 10) === profile.membershipStartDate &&
        profile.membershipStartDate <= todayDate()) {
        member.membershipStartDate = profile.membershipStartDate;
      }
      if (Array.isArray(profile.roles) && profile.roles.length > 0 && profile.roles.every((role: Member["roles"][number]) => memberRoles.includes(role))) {
        member.roles = [...new Set<Member["roles"][number]>(profile.roles)];
      }
    }
    refreshParticipants();
  } catch { /* Ignore invalid prototype storage. */ }
};
// Keep the shared member objects stable so loads, pilots and the queue see edits.
if (typeof window !== "undefined") {
  try { applyProfiles(localStorage.getItem(storageKey)); } catch { /* Storage may be unavailable. */ }
}

export const useMembers = () => {
  const [, setRevision] = useState(0);
  const [storageError, setStorageError] = useState(false);
  const persist = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(members.map(({ id, name, city, email, weight, membershipType, roles, membershipStartDate, details }) =>
        ({ id, name, city, email, weight, membershipType, roles, membershipStartDate, details }))));
      setStorageError(false);
    } catch { setStorageError(true); }
  };
  useEffect(() => {
    // Persist generated addresses once, keeping them stable across reloads.
    // Persisting the registry synchronizes browser storage and reports failures.
    // oxlint-disable-next-line react/set-state-in-effect -- Report the external storage operation's result.
    persist();
    const receive = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      applyProfiles(event.newValue);
      setRevision((revision) => revision + 1);
    };
    window.addEventListener("storage", receive);
    return () => window.removeEventListener("storage", receive);
  }, []);
  const updateMember = (id: string, profile: MemberProfile) => {
    const member = members.find((person) => person.id === id);
    if (!member) return;
    Object.assign(member, profile);
    refreshParticipants();
    persist();
    setRevision((revision) => revision + 1);
  };
  return { members, updateMember, storageError };
};
