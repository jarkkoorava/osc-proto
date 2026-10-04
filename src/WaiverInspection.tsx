import { useState } from "react";
import { jumperReviewChecks, pilotReviewChecks, waiverTerms } from "./data/waiver";
import type { Waiver } from "./data/waiver";

const date = (value: string) => value ? new Date(`${value}T12:00:00`).toLocaleDateString("fi-FI") : "—";
const license = (value: string) => value === "Student" ? "Oppilas" : value === "None" ? "Ei lisenssiä" : value || "—";

export const WaiverInspection = ({ waiver, save, close }: {
  waiver: Waiver;
  save: (waiver: Waiver) => void;
  close: () => void;
}) => {
  const pilot = waiver.type === "pilot";
  const details = waiver.details;
  const labels = pilot ? pilotReviewChecks : jumperReviewChecks;
  const [checks, setChecks] = useState(labels.map((_, index) => waiver.review?.checks[index] === true));
  const [weight, setWeight] = useState(String(waiver.weight));
  const [gearDate, setGearDate] = useState(details.inspectionsValidUntil);
  const [note, setNote] = useState(waiver.review?.note ?? "");
  const [saved, setSaved] = useState(false);
  const hasGear = !pilot && waiver.type !== "basic" && !details.clubGearOnly &&
    [details.mainCanopyModel, details.reserveCanopyModel, details.containerModel, details.aadModel, details.inspectionsValidUntil].some(Boolean);
  const facts = (items: [string, string][]) => <dl className="waiver-review-facts">{items.map(([label, value]) => <div key={label}>
    <dt>{label}</dt><dd>{value || "—"}</dd>
  </div>)}</dl>;
  return <main className="members-view waiver-view">
    <div className="members-heading"><h1>Waiverin tarkastus</h1></div>
    <form className="waiver-form" onChange={() => setSaved(false)} onSubmit={(event) => {
      event.preventDefault();
      save({ ...waiver,
        ...(!pilot ? { weight: Number(weight), details: { ...details, ...(hasGear ? { inspectionsValidUntil: gearDate } : {}) } } : {}),
        review: { checks, note: pilot ? "" : note, savedAt: new Date().toISOString() },
      });
      setSaved(true);
    }}>
      <fieldset className="inspection-personal-details"><legend>{pilot ? "Lentäjän tiedot" : "Hyppääjän tiedot"}</legend>
        {facts([
          ["Nimi", waiver.name],
          ...(!pilot ? [["Lisenssi", license(details.license)], ["Hyppyjä yhteensä", details.totalJumps],
            ["Hyppyjä viimeisen 12 kuukauden aikana", details.jumpsLastYear],
            ["SIL-jäsenyys", details.silMember === true ? "Kyllä" : details.silMember === false ? "Ei" : "—"],
            ...(details.silMember === false ? [["Vakuutusnumero", details.insuranceNumber]] : [])] as [string, string][] : []),
          ["Syntymäaika", date(details.birthDate)],
          ["Täytetty", new Date(waiver.submittedAt).toLocaleString("fi-FI")],
          ...(pilot ? [["Paino (kg)", String(waiver.weight)]] as [string, string][] : []),
        ])}
        {!pilot && <label className="review-edit-field">Exit-paino (kg)<input type="number" min="1" max="300" step="0.1" required
          value={weight} onChange={(event) => setWeight(event.target.value)} /></label>}
      </fieldset>
      <fieldset><legend>Lähiomainen hätätilanteessa</legend>{facts([
        ["Lähiomaisen nimi", details.emergencyName], ["Suhde henkilöön", details.emergencyRelation], ["Lähiomaisen puhelinnumero", details.emergencyPhone],
      ])}</fieldset>
      {pilot && <fieldset><legend>Lentokokemus ja kelpoisuudet</legend>{facts([
        ["Lentotunnit yhteensä", details.totalFlightHours], ["Lennot yhteensä", details.totalFlights],
        ["Hyppylennot yhteensä", details.skydiveFlights], ["Hyppylentotunnit yhteensä", details.skydiveFlightHours],
        ["SEP voimassa", date(details.sepValidUntil)], ["Kielikoe EN voimassa", date(details.englishExamValidUntil)], ["Medikaali voimassa", date(details.medicalValidUntil)],
      ])}</fieldset>}
      {!pilot && <fieldset><legend>Varusteet ja tarkastukset</legend>
        {details.clubGearOnly || waiver.type === "basic" ? <p>Hyppää vain kerhon varjokalustolla.</p> : hasGear ? <>
          {facts(([
            ["Päävarjon malli", details.mainCanopyModel], ["Päävarjon koko (ft²)", details.mainCanopySize],
            ["Varavarjon malli", details.reserveCanopyModel], ["Varavarjon koko (ft²)", details.reserveCanopySize],
            ["Repun malli", details.containerModel], ["AAD:n malli", details.aadModel],
          ] as [string, string][]).filter(([, value]) => Boolean(value)))}
          <label className="review-edit-field">Tarkastukset voimassa<input type="date" required value={gearDate} onChange={(event) => setGearDate(event.target.value)} /></label>
        </> : <p>Varustetietoja ei annettu.</p>}
      </fieldset>}
      {pilot && <fieldset><legend>Suostumukset</legend>
        <ul>{waiverTerms.map((term, index) => <li key={term}>{term}: {waiver.acceptedTerms[index] ? "Hyväksytty" : "Ei hyväksytty"}</li>)}</ul>
        <p>Markkinointilupa: {waiver.marketingConsent ? "Kyllä" : "Ei"}</p>
      </fieldset>}
      <fieldset className="waiver-terms"><legend>Olen tarkastanut seuraavat tiedot:</legend>
        {labels.map((label, index) => <label key={label}><input type="checkbox" checked={checks[index]}
          onChange={(event) => setChecks(checks.map((checked, position) => position === index ? event.target.checked : checked))} />{label}</label>)}
      </fieldset>
      {!pilot && <label>Huomautus<textarea aria-label="Huomautus" rows={3} value={note} onChange={(event) => setNote(event.target.value)} /></label>}
      {saved && <p role="status" className="waiver-success">Tarkastus tallennettu.</p>}
      <div className="waiver-actions"><button className="primary-button" type="submit">Tallenna tarkastus</button>
        <button className="secondary-button" type="button" onClick={close}>Takaisin</button></div>
    </form>
  </main>;
};
