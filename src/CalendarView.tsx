import { useState } from "react";
import type { Member } from "./data/members";

import { useCalendarEnrollments } from "./useCalendarEnrollments";
import type { Enrollment } from "./useCalendarEnrollments";
import { roleLabels } from "./fi";
import { planes, roleClass } from "./data/manifest";
import type { Role } from "./data/members";
const dayMs = 86400000;
const key = (date: Date) => date.toISOString().slice(0, 10);
const monday = (date: Date) => new Date(date.getTime() - (date.getUTCDay() + 6) % 7 * dayMs);
const format = (date: Date, options: Intl.DateTimeFormatOptions) => date.toLocaleDateString("fi-FI", { ...options, timeZone: "UTC" });
const categories: { role: Role; label: string; className: string }[] = [
  { role: "Instructor", label: "Hyppymestareita", className: "instructor" },
  { role: "Licensed", label: "Lisenssihyppääjiä", className: "licensed" },
  { role: "Student", label: "Oppilaita", className: "student" },
  ...Object.entries(roleLabels).filter(([role]) => !["Instructor", "Licensed", "Student"].includes(role))
    .map(([role, label]) => ({ role: role as Role, label, className: roleClass(role) })),
];

const EnrollmentForm = ({ member, entryRole, entryPlanes, enroll, cancel }: {
  member: Member; entryRole?: Role; entryPlanes?: string[]; enroll: (role: Role, planes: string[]) => void; cancel: () => void;
}) => {
  const [role, setRole] = useState<Role>(entryRole && member.roles.includes(entryRole) ? entryRole : member.roles[0]);
  const [aircraft, setAircraft] = useState(entryPlanes ?? []);
  const [error, setError] = useState("");
  return <section className="calendar-enroll-card" aria-label="Oma ilmoittautuminen">
    <h2>{member.name}</h2><p>{entryRole ? `Ilmoittautunut: ${roleLabels[entryRole]}` : "Et ole ilmoittautunut tälle päivälle."}</p>
    <form onSubmit={(event) => {
      event.preventDefault();
      if (role === "Pilot" && !aircraft.length) { setError("Valitse vähintään yksi lentokone."); return; }
      setError(""); enroll(role, aircraft);
    }}>
      <label>Osallistun roolissa<select aria-label="Osallistun roolissa" value={role} onChange={(event) => setRole(event.target.value as Role)}>
        {member.roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
      </select></label>
      {role === "Pilot" && <fieldset className="calendar-pilot-choice"><legend>Lentokoneet</legend>
        {planes.map((plane) => <label key={plane}><input type="checkbox" checked={aircraft.includes(plane)}
          onChange={(event) => setAircraft(event.target.checked ? [...aircraft, plane] : aircraft.filter((value) => value !== plane))} />
          <span className={`aircraft-registration aircraft-${plane.toLowerCase()}`}>{plane.replace("OH-", "")}</span></label>)}
      </fieldset>}
      {error && <p role="alert" className="waiver-error">{error}</p>}
      <div className="waiver-actions"><button className="primary-button" type="submit">{entryRole ? "Päivitä ilmoittautuminen" : "Ilmoittaudu"}</button>
        {entryRole && <button className="queue-cancel-button" type="button" onClick={cancel}>Peru ilmoittautuminen</button>}</div>
    </form>
  </section>;
};

const PilotAvailability = ({ entries, members, detailed = false }: { entries: Enrollment[]; members: Member[]; detailed?: boolean }) => {
  const pilots = entries.filter((entry) => entry.role === "Pilot");
  if (!pilots.length) return null;
  return <div className="calendar-pilot-availability"><h3>Lentäjät</h3>
    {planes.filter((plane) => pilots.some((entry) => entry.planes?.includes(plane))).map((plane) => {
      const available = pilots.filter((entry) => entry.planes?.includes(plane));
      return <div className="calendar-plane-pilots" key={plane}>
        <span className={`aircraft-registration aircraft-${plane.toLowerCase()}`}>{plane.replace("OH-", "")}</span>
        {!detailed && <span>{available.map((entry) => members.find((member) => member.id === entry.memberId)?.name ?? entry.memberId).join(", ")}</span>}
        {detailed && <ul>{available.map((entry) => <li key={entry.memberId}>{members.find((member) => member.id === entry.memberId)?.name ?? entry.memberId}</li>)}</ul>}
      </div>;
    })}
    {pilots.some((entry) => !entry.planes?.length) && <p>Lentokonetta ei valittu: {pilots.filter((entry) => !entry.planes?.length).map((entry) => members.find((member) => member.id === entry.memberId)?.name).join(", ")}</p>}
  </div>;
};

export const CalendarView = ({ members }: { members: Member[] }) => {
  const [today] = useState(() => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Helsinki" }).format(new Date()));

  const [mode, setMode] = useState<"week" | "month">("week");
  const [anchor, setAnchor] = useState(today);
  const date = new Date(`${anchor}T12:00:00Z`);
  const { enrollments, save, storageError, enrollmentError } = useCalendarEnrollments(members);
  const [memberId, setMemberId] = useState(members[0]?.id ?? "");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const member = members.find((person) => person.id === memberId);
  const firstOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 12));
  const lastOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 12));
  const start = monday(mode === "week" ? date : firstOfMonth);
  const count = mode === "week" ? 7 : Math.ceil(((lastOfMonth.getTime() - start.getTime()) / dayMs + 1) / 7) * 7;
  const days = Array.from({ length: count }, (_, index) => new Date(start.getTime() + index * dayMs));
  const title = mode === "week"
    ? `${format(start, { day: "numeric", month: "numeric" })}–${format(days[6], { day: "numeric", month: "numeric", year: "numeric" })}`
    : format(date, { month: "long", year: "numeric" });
  const move = (direction: number) => {
    const next = mode === "week" ? new Date(date.getTime() + direction * 7 * dayMs)
      : new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + direction, 1, 12));
    setAnchor(key(next));
  };
  return <main className="members-view calendar-view">
    <div className="members-heading"><h1>Kalenteri</h1></div>
    <label className="member-search">Kenen näkymä<select aria-label="Kenen näkymä" value={memberId} onChange={(event) => setMemberId(event.target.value)}>
      {[...members].sort((a, b) => a.name.localeCompare(b.name, "fi")).map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
    </select></label>
    {storageError && <p role="alert" className="waiver-error">Ilmoittautumista ei voitu tallentaa selaimeen.</p>}
    {enrollmentError && <p role="alert" className="waiver-error">{enrollmentError}</p>}
    {selectedDay ? <>
      <div className="calendar-day-page-heading"><h2>{format(new Date(`${selectedDay}T12:00:00Z`), { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h2>
        <button className="secondary-button" onClick={() => setSelectedDay(null)}>Takaisin kalenteriin</button></div>
      <div className="calendar-day-layout"><div className="calendar-day-enrollment">
      {member && <EnrollmentForm key={`${selectedDay}:${member.id}`} member={member}
        entryRole={enrollments.find((entry) => entry.date === selectedDay && entry.memberId === member.id)?.role}
        entryPlanes={enrollments.find((entry) => entry.date === selectedDay && entry.memberId === member.id)?.planes}
        enroll={(role, aircraft) => save(selectedDay, member.id, role, aircraft)} cancel={() => save(selectedDay, member.id, null)} />}
      </div>
      <div className="calendar-enrolled-list"><h2>Ilmoittautuneet</h2>
        <PilotAvailability entries={enrollments.filter((entry) => entry.date === selectedDay)} members={members} detailed />
        {categories.filter(({ role }) => role !== "Pilot" && enrollments.some((entry) => entry.date === selectedDay && entry.role === role)).map(({ role, label, className }) => {
          const entries = enrollments.filter((entry) => entry.date === selectedDay && entry.role === role);
          return <section key={role}><h3><span className={`queue-role-tag calendar-role-heading ${className}`}>{label} ({entries.length})</span></h3>
            <ul>{entries.map((entry) => <li className={`queue-role-tag ${className}`} key={entry.memberId}>{members.find((person) => person.id === entry.memberId)?.name ?? entry.memberId}</li>)}</ul>
          </section>;
        })}
        {!enrollments.some((entry) => entry.date === selectedDay) && <p>Ei vielä ilmoittautumisia.</p>}
      </div>
      </div>
    </> : <>
    <div className="calendar-toolbar">
      <div className="calendar-date-navigation"><button className="secondary-button" aria-label="Edellinen jakso" onClick={() => move(-1)}>‹</button>
        <h2>{title}</h2><button className="secondary-button" aria-label="Seuraava jakso" onClick={() => move(1)}>›</button>
        <button className="secondary-button" onClick={() => setAnchor(today)}>Tänään</button></div>
      <div className="calendar-mode" role="tablist" aria-label="Kalenterin näkymä">
        <button id="calendar-week-tab" role="tab" aria-selected={mode === "week"} aria-controls="calendar-panel" onClick={() => setMode("week")}>Viikko</button>
        <button id="calendar-month-tab" role="tab" aria-selected={mode === "month"} aria-controls="calendar-panel" onClick={() => setMode("month")}>Kuukausi</button>
      </div>
    </div>
    <div id="calendar-panel" role="tabpanel" aria-labelledby={`calendar-${mode}-tab`} className={`calendar-panel calendar-${mode}`}>
      <div className="calendar-grid">
        {days.map((day) => {
          const dateKey = key(day);
          const enrolled = enrollments.filter((entry) => entry.date === dateKey);
          return <section key={dateKey} aria-label={format(day, { weekday: "long", day: "numeric", month: "long" })}
            className={`calendar-day ${dateKey === today ? "calendar-today" : ""} ${day.getUTCMonth() !== date.getUTCMonth() && mode === "month" ? "calendar-outside-month" : ""}`}>
            <button className="calendar-day-open" aria-label={`Avaa ${format(day, { day: "numeric", month: "numeric", year: "numeric" })}`} onClick={() => setSelectedDay(dateKey)}>
            <div className="calendar-day-heading"><span>{format(day, { weekday: "short" })}</span>
              <time dateTime={dateKey} aria-current={dateKey === today ? "date" : undefined}>{format(day, { day: "numeric", month: "numeric" })}</time></div>
            <dl className="calendar-counts">{categories.filter(({ role }) => role !== "Pilot" && enrolled.some((entry) => entry.role === role)).map(({ role, label, className }) => <div key={role} title={label}>
              <dt className="sr-only">{label}</dt><dd className={`queue-role-tag ${className}`}>{enrolled.filter((entry) => entry.role === role).length}</dd>
            </div>)}</dl>
            <PilotAvailability entries={enrolled} members={members} />
            {enrolled.some((entry) => entry.memberId === memberId) && <span className="calendar-own-enrollment">Ilmoittautunut</span>}
            </button>
          </section>;
        })}
      </div>
    </div>
    </>}
  </main>;
};
