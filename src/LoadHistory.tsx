import { useState } from "react";
import { findSkydiver, jumpRole, roleClass, loadFlightState } from "./data/manifest";
import { roleLabels, roleTags } from "./fi";
import { HistoryLoadEditor } from "./HistoryLoadEditor";
import type { Load, Member } from "./data/manifest";

export const LoadHistory = ({ loads, members, emptyWeights, saveLoad, updateFlightTime }: { loads: Load[]; members: Member[]; emptyWeights: Record<string, number>; saveLoad: (load: Load) => void; updateFlightTime: (id: string, minutes: number | undefined) => void }) => {
  const [editing, setEditing] = useState<Load | null>(null);
  const jumped = loads.filter((load) => loadFlightState(load) === "Dropped")
    .sort((a, b) => (b.jumpedAt ?? b.date ?? "").localeCompare(a.jumpedAt ?? a.date ?? ""));
  return <main className="members-view load-history-view">
    <div className="members-heading"><h1>Pokahistoria</h1><span>{jumped.length} pokaa</span></div>
    <div className="members-table-wrap"><table className="members-table"><thead><tr>
      <th>Päivämäärä</th><th>Poka</th><th>Lentokone</th><th>Hyppääjät</th><th>Lentäjä</th><th>Maahenkilö</th><th>Lentoaika (min)</th><th>Muokkaa</th>
    </tr></thead><tbody>{jumped.map((load) => <tr key={load.id}>
      <td>{new Date(load.jumpedAt ?? `${load.date}T12:00:00Z`).toLocaleDateString("fi-FI", { timeZone: "Europe/Helsinki" })}</td>
      <td>{String(load.number).padStart(2, "0")}</td>
      <td><span className={`aircraft-registration aircraft-${load.plane.toLowerCase()}`}>{load.plane}</span></td>
      <td><ul className="history-jumpers">{load.jumps.map((jump) => <li key={jump.skydiverId}>
        <strong>{findSkydiver(jump.skydiverId)?.name ?? jump.skydiverId}</strong>
        <span className={`queue-role-tag ${roleClass(jumpRole(jump))}`} title={roleLabels[jumpRole(jump)]}>{roleTags[jumpRole(jump)]}</span>
        <span>{jump.altitude.toLocaleString("fi-FI")} m</span>
        {jump.exercise && <span>{jump.exercise}</span>}
        {jump.returnedByPlane && <span className="returned-by-plane">Koneella alas</span>}
      </li>)}</ul></td>
      <td>{findSkydiver(load.pilotId)?.name ?? "—"}</td>
      <td className="history-ground-person">{load.groundPersonId ? findSkydiver(load.groundPersonId)?.name ?? "—" : "Ei maahenkilöä"}</td>
      <td><input className="history-flight-time" type="number" min="0" step="1"
        aria-label={`Lentoaika: ${load.id}`} value={load.flightTimeMinutes ?? ""}
        onChange={(event) => {
          if (event.target.value === "") updateFlightTime(load.id, undefined);
          else if (event.target.validity.valid && Number.isFinite(event.target.valueAsNumber)) updateFlightTime(load.id, event.target.valueAsNumber);
        }} /></td>
      <td><button className="primary-button" onClick={() => setEditing(load)}>Muokkaa pokaa</button></td>

    </tr>)}</tbody></table>{jumped.length === 0 && <p className="members-empty">Ei hypättyjä pokia.</p>}</div>
    {editing && <HistoryLoadEditor key={editing.id} load={editing} members={members} emptyWeights={emptyWeights} save={saveLoad} close={() => setEditing(null)} />}
  </main>;
};
