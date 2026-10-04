import { useState } from "react";
import { todayDate } from "./data/members";
import { findSkydiver, jumpRole, loadFlightState, loadWeights, MTOM, pilots, roleClass } from "./data/manifest";
import type { Load } from "./data/manifest";
import { roleLabels, roleTags, stateLabels, formatNumber } from "./fi";
import { LoadBalance } from "./LoadBalance";

export const PilotView = ({ loads, emptyWeights, updateFlightTime }: {
  loads: Load[];
  emptyWeights: Record<string, number>;
  updateFlightTime: (id: string, pilotId: string, minutes: number | undefined) => void;
}) => {
  const [pilotId, setPilotId] = useState(pilots[0]?.id ?? "");
  const [ownOnly, setOwnOnly] = useState(false);
  const today = loads.filter((load) => load.date === todayDate() && (!ownOnly || load.pilotId === pilotId)).sort((a, b) => a.number - b.number);
  const kg = (weight: number) => `${formatNumber(weight, 1)} kg`;
  return <main className="members-view pilot-view">
    <div className="members-heading"><h1>Lentäjänäkymä</h1></div>
    <label className="pilot-selector">Lentäjä<select aria-label="Lentäjä" value={pilotId} onChange={(event) => setPilotId(event.target.value)}>
      {pilots.map((pilot) => <option key={pilot.id} value={pilot.id}>{pilot.name}</option>)}
    </select></label>
    <label className="pilot-own-filter"><input type="checkbox" role="switch" checked={ownOnly}
      onChange={(event) => setOwnOnly(event.target.checked)} />Omat pokat</label>
    <h2 className="pilot-day-heading">Tänään · {new Date(`${todayDate()}T12:00:00`).toLocaleDateString("fi-FI")} · {today.length} pokaa</h2>
    <div className="pilot-load-list">{today.map((load) => {
      const own = load.pilotId === pilotId;
      const weights = loadWeights(load, emptyWeights[load.plane]);
      return <article key={load.id} className={`pilot-load ${own ? "pilot-own-load" : ""}`} aria-label={`Poka ${load.number}`}>
        <header className="pilot-load-heading">
          <h2>Poka {String(load.number).padStart(2, "0")}</h2>
          <span className={`aircraft-registration aircraft-${load.plane.toLowerCase()}`}>{load.plane}</span>
          <span className={`flight-state-controls state-${roleClass(loadFlightState(load))}`}><span className="flight-state-label">{stateLabels[loadFlightState(load)]}</span></span>
          {own && <span className="pilot-own-label">Oma poka</span>}
        </header>
        <div className="pilot-load-meta"><span>Lentäjä: <strong>{findSkydiver(load.pilotId)?.name ?? "—"}</strong></span>
          <span className="pilot-ground-person">{load.groundPersonId ? `Maahenkilö: ${findSkydiver(load.groundPersonId)?.name ?? "—"}` : "Ei maahenkilöä"}</span></div>
        <div className="pilot-load-content"><div>
          <h3>Hyppääjät</h3>
          <ul className="pilot-jumpers">{load.jumps.map((jump) => {
            const person = findSkydiver(jump.skydiverId);
            return <li key={jump.skydiverId}>
              <div className="pilot-jumper-name"><strong>{person.name}</strong><span className={`queue-role-tag ${roleClass(jumpRole(jump))}`} title={roleLabels[jumpRole(jump)]}>{roleTags[jumpRole(jump)]}</span></div>
              <div className="pilot-jumper-details"><span className="pilot-jumper-role">{roleLabels[jumpRole(jump)]}</span>
                {jump.exercise && <span className="pilot-jumper-exercise">{jump.exercise}</span>}<span className="pilot-jumper-weight">{kg(person.weight)}</span></div>
              <div className="pilot-altitude"><strong>{formatNumber(jump.altitude, 0)} m</strong><span>{formatNumber(Math.ceil(jump.altitude / 0.3048 / 100) * 100, 0)} ft</span></div>
              {(jump.highOpening || jump.wingsuit) && <div className="pilot-jump-flags">
                {jump.highOpening && <span>Korkea avaus</span>}
                {jump.wingsuit && <span>Wingsuit</span>}
              </div>}
              {jump.returnedByPlane && <span className="returned-by-plane">Koneella alas</span>}
            </li>;
          })}</ul>
          {load.jumps.length === 0 && <p className="muted">Ei vielä hyppääjiä.</p>}
          <div className="pilot-flight-time">
            {own ? <label>Lentoaika (min)<input type="number" inputMode="numeric" min="0" step="1"
              aria-label={`Lentoaika: poka ${load.number}`} value={load.flightTimeMinutes ?? ""}
              onChange={(event) => {
                if (event.target.value === "") updateFlightTime(load.id, pilotId, undefined);
                else if (event.target.validity.valid && Number.isFinite(event.target.valueAsNumber)) updateFlightTime(load.id, pilotId, event.target.valueAsNumber);
              }} /><small>Tallentuu automaattisesti</small></label>
              : <p>Lentoaika: <strong>{load.flightTimeMinutes === undefined ? "Ei kirjattu" : `${load.flightTimeMinutes} min`}</strong></p>}
          </div>
        </div><div className="pilot-weight-panel">
          <LoadBalance load={load} emptyWeight={emptyWeights[load.plane]} />
          <h3>Massat</h3><dl className="pilot-weight-details">
            {([
              ["Ilma-aluksen perusmassa", kg(emptyWeights[load.plane])], ["Lentäjä", kg(weights.pilot)],
              [`Polttoaine · ${load.fuel} L`, kg(weights.fuel)], ["Hyppääjät", kg(weights.jumpers)],
              ["Lentoonlähtömassa", kg(weights.total)], ["Suurin lentoonlähtömassa", kg(MTOM)],
              ["Massaa jäljellä", kg(weights.remaining)], ["Hyppääjille käytettävissä", kg(weights.jumperAllowance)],
            ] as const).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          {weights.remaining < 0 && <p className="waiver-error">Suurin sallittu lentoonlähtömassa ylittyy.</p>}
        </div></div>
      </article>;
    })}</div>
    {today.length === 0 && <p className="members-empty">{ownOnly ? "Ei omia pokia tänään." : "Ei tämän päivän pokia."}</p>}
  </main>;
};
