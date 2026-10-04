import { useEffect, useState } from "react";
import type { Member, Role } from "./data/members";
import { planes } from "./data/manifest";

export type Enrollment = { date: string; memberId: string; role: Role; planes?: string[] };
const storageKey = "osc-calendar-enrollments-v2";
const seed = (members: Member[]): Enrollment[] => {
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Helsinki" }).format(new Date());
  const monday = new Date(`${today}T12:00:00Z`);
  monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
  const entries: Enrollment[] = [];
  for (const [offset, amounts] of [[4, [3, 9, 5]], [5, [5, 16, 9]]] as const) {
    const date = new Date(monday.getTime() + offset * 86400000).toISOString().slice(0, 10);
    (["Instructor", "Licensed", "Student"] as const).forEach((role, index) => {
      members.filter((member) => member.roles.includes(role) && !entries.some((entry) => entry.date === date && entry.memberId === member.id))
        .slice(0, amounts[index]).forEach((member) => entries.push({ date, memberId: member.id, role }));
    });
    members.filter((member) => member.roles.includes("Pilot")).slice(0, 2).forEach((pilot, index) =>
      entries.push({ date, memberId: pilot.id, role: "Pilot", planes: [planes[index % planes.length]] }));
  }
  return entries;
};

export const useCalendarEnrollments = (members: Member[]) => {
  const read = (raw: string | null): Enrollment[] => {
    if (!raw) return seed(members);
    try {
      const data = JSON.parse(raw);
      const records: Enrollment[] = Array.isArray(data) ? data : data.enrollments;
      if (!Array.isArray(records)) return seed(members);
      const unique = new Map<string, Enrollment>();
      const defaults = seed(members);
      for (const record of records) {
        if (typeof record?.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(record.date) ||
          !members.some((member) => member.id === record.memberId && member.roles.includes(record.role))) continue;
        const seededPilot = data.version !== 3 && record.role === "Pilot" && record.planes?.length === 2
          ? defaults.find((entry) => entry.role === "Pilot" && entry.date === record.date && entry.memberId === record.memberId) : undefined;
        unique.set(`${record.date}:${record.memberId}`, { ...record,
          ...(record.role === "Pilot" ? { planes: seededPilot?.planes ?? (Array.isArray(record.planes) ? [...new Set(record.planes.filter((plane) => planes.includes(plane)))] : []) } : {}),
        });
      }
      if (Array.isArray(data)) for (const entry of seed(members).filter((entry) => entry.role === "Pilot")) {
        const id = `${entry.date}:${entry.memberId}`;
        if (!unique.has(id)) unique.set(id, entry);
      }
      return [...unique.values()];
    } catch { return seed(members); }
  };
  const [enrollments, setEnrollments] = useState(() => {
    try { return read(localStorage.getItem(storageKey)); } catch { return seed(members); }
  });
  const [storageError, setStorageError] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState("");
  useEffect(() => {
    const receive = (event: StorageEvent) => {
      if (event.key === storageKey) setEnrollments(read(event.newValue));
    };
    window.addEventListener("storage", receive);
    return () => window.removeEventListener("storage", receive);
  });
  const save = (date: string, memberId: string, role: Role | null, aircraft: string[] = []) => {
    if (role && !members.some((member) => member.id === memberId && member.roles.includes(role))) return;
    if (role === "Pilot" && (!aircraft.length || aircraft.some((plane) => !planes.includes(plane)))) return;
    let current = enrollments;
    try { const raw = localStorage.getItem(storageKey); if (raw) current = read(raw); } catch { /* Use the in-memory state. */ }
    if (role === "Pilot" && current.some((entry) => entry.date === date && entry.memberId !== memberId && entry.role === "Pilot" && entry.planes?.some((plane) => aircraft.includes(plane)))) {
      setEnrollmentError("Lentokoneelle on jo ilmoittautunut lentäjä."); return;
    }
    setEnrollmentError("");
    const next = current.filter((entry) => entry.date !== date || entry.memberId !== memberId);
    if (role) next.push({ date, memberId, role, ...(role === "Pilot" ? { planes: [...new Set(aircraft)] } : {}) });
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 3, enrollments: next })); setStorageError(false); }
    catch { setStorageError(true); }
    setEnrollments(next);
  };
  return { enrollments, save, storageError, enrollmentError };
};
