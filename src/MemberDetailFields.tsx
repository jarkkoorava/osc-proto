import { todayDate } from "./data/members";
import { wingLoading } from "./data/waiver";
import type { MemberDetails, WaiverType } from "./data/waiver";
import type { ReactNode } from "react";

type MemberDetailFieldsProps = {
  details: MemberDetails;
  weight: number;
  update: (details: MemberDetails) => void;
  required?: boolean;
  children?: ReactNode;
  waiverType?: WaiverType;
};

export const MemberDetailFields = ({ details, weight, update, required = false, children, waiverType }: MemberDetailFieldsProps) => {
  const pilot = waiverType === "pilot";
  const basic = waiverType === "basic";
  const field = (key: Exclude<keyof MemberDetails, "silMember" | "license" | "clubGearOnly">, label: string, type = "text") =>
    <label key={key}>{label}<input type={type} required={required} value={details[key]}
      min={type === "number" ? key.includes("Size") ? "1" : "0" : undefined}
      step={type === "number" ? key.includes("Hours") ? "0.1" : "1" : undefined}
      max={key === "birthDate" ? todayDate() : undefined}
      pattern={key === "postalCode" ? "[0-9]{5}" : type === "text" || type === "tel" ? ".*\\S.*" : undefined}
      onChange={(event) => update({ ...details, [key]: event.target.value })} /></label>;
  const loading = wingLoading(weight, Number(details.mainCanopySize));
  return <div className="member-detail-fields">
    {!pilot && <fieldset><legend>Vakuutus</legend><div className="waiver-fields">
      <label>Suomen Ilmailuliiton jäsen<select aria-label="Suomen Ilmailuliiton jäsen" required={required} value={details.silMember === null ? "" : String(details.silMember)} onChange={(event) => update({ ...details, silMember: event.target.value === "" ? null : event.target.value === "true" })}>
        <option value="">Valitse</option><option value="true">Kyllä</option><option value="false">Ei</option>
      </select></label>
      {details.silMember === false && field("insuranceNumber", "Vakuutusnumero")}
    </div></fieldset>}
    <fieldset><legend>Jäsenen tiedot</legend><div className="waiver-fields">
      {children}
      {field("phone", "Puhelinnumero", "tel")}{field("address", "Osoite")}{field("postalCode", "Postinumero")}{field("birthDate", "Syntymäaika", "date")}
    </div></fieldset>
    {!pilot && !basic && <fieldset><legend>Hyppykokemus</legend><div className="waiver-fields">
      <label>Lisenssi<select aria-label="Lisenssi" required={required} value={details.license} onChange={(event) => update({ ...details, license: event.target.value as MemberDetails["license"] })}>
        <option value="">Valitse</option><option value="Student">Oppilas</option>{["A", "B", "C", "D"].map((license) => <option key={license}>{license}</option>)}<option value="None">Ei lisenssiä</option>
      </select></label>
      {field("totalJumps", "Hyppyjä yhteensä", "number")}{field("jumpsLastYear", "Hyppyjä viimeisen 12 kuukauden aikana", "number")}
    </div></fieldset>}
    {pilot && <fieldset><legend>Lentokokemus ja kelpoisuudet</legend><div className="waiver-fields">
      {field("totalFlightHours", "Lentotunnit yhteensä", "number")}
      {field("totalFlights", "Lennot yhteensä", "number")}
      {field("skydiveFlights", "Hyppylennot yhteensä", "number")}
      {field("skydiveFlightHours", "Hyppylentotunnit yhteensä", "number")}
    </div><div className="waiver-fields pilot-validity-fields">
      {field("sepValidUntil", "SEP voimassa", "date")}
      {field("englishExamValidUntil", "Kielikoe EN voimassa", "date")}
      {field("medicalValidUntil", "Medikaali voimassa", "date")}
    </div></fieldset>}
    {!pilot && !basic && <fieldset><legend>Varusteet ja tarkastukset</legend>
      <label className="club-gear-switch">
      <input type="checkbox" checked={details.clubGearOnly}
        onChange={(event) => update({ ...details, clubGearOnly: event.target.checked })} />
      Hyppään vain kerhon varjokalustolla
    </label>
    {!basic && !details.clubGearOnly && <div className="waiver-fields">
      {field("mainCanopyModel", "Päävarjon malli")}{field("mainCanopySize", "Päävarjon koko (ft²)", "number")}
      <div className="wing-loading"><span>Siipikuorma</span><output>{loading === null ? "—" : `${loading.toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} lb/ft²`}</output></div>
      {field("reserveCanopyModel", "Varavarjon malli")}{field("reserveCanopySize", "Varavarjon koko (ft²)", "number")}{field("containerModel", "Repun malli")}{field("aadModel", "AAD:n malli")}
      <label>Tarkastukset voimassa<input aria-label="Tarkastukset voimassa" type="date" required={required} value={details.inspectionsValidUntil} onChange={(event) => update({ ...details, inspectionsValidUntil: event.target.value })} /><small>Ensimmäinen päivämäärä joka menee vanhaksi</small></label>
    </div>}
    </fieldset>}
    <fieldset><legend>Lähiomainen hätätilanteessa</legend><div className="waiver-fields">
      {field("emergencyName", "Lähiomaisen nimi")}{field("emergencyRelation", "Suhde henkilöön")}{field("emergencyPhone", "Lähiomaisen puhelinnumero", "tel")}
    </div></fieldset>
  </div>;
};
