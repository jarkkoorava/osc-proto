import { useState } from "react";
import { todayDate } from "./data/members";
import type { Member } from "./data/members";
import { emptyMemberDetails, waiverTerms, waiverTypeLabels } from "./data/waiver";
import type { Waiver, WaiverType } from "./data/waiver";
import type { MemberProfile } from "./useMembers";
import { MemberDetailFields } from "./MemberDetailFields";
import { WaiverInspection } from "./WaiverInspection";

type WaiverFormProps = {
  member: Member;
  updateMember: (id: string, profile: MemberProfile) => void;
  saveWaiver: (waiver: Waiver) => void;
  hasWaiver: boolean;
  waiverType: WaiverType;
  changeType: (type: WaiverType) => void;
  cancel: () => void;
};

const WaiverForm = ({ member, updateMember, saveWaiver, hasWaiver, waiverType, changeType, cancel }: WaiverFormProps) => {
  const parts = member.name.split(" ");
  const [firstName, setFirstName] = useState(parts.slice(0, -1).join(" "));
  const [lastName, setLastName] = useState(parts.at(-1) ?? "");
  const [profile, setProfile] = useState({ ...member, details: {
    ...emptyMemberDetails(), ...member.details,
    ...(waiverType === "basic" ? { clubGearOnly: true } : {}),
  } });
  const [acceptedTerms, setAcceptedTerms] = useState(waiverTerms.map(() => false));
  const [marketingConsent, setMarketingConsent] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  return <form className="waiver-form" onSubmit={(event) => {
    event.preventDefault();
    setMessage("");
    if (waiverType === "licensed" && Number(profile.details.jumpsLastYear) > Number(profile.details.totalJumps)) {
      setError("Viimeisen 12 kuukauden hyppymäärä ei voi ylittää kokonaismäärää."); return;
    }
    if (waiverType === "pilot" && (Number(profile.details.skydiveFlights) > Number(profile.details.totalFlights) ||
      Number(profile.details.skydiveFlightHours) > Number(profile.details.totalFlightHours))) {
      setError("Hyppylentojen määrä tai tunnit eivät voi ylittää lentojen kokonaismäärää tai kokonaistunteja."); return;
    }
    if (marketingConsent === null || acceptedTerms.some((accepted) => !accepted)) return;
    const name = `${firstName.trim()} ${lastName.trim()}`;
    updateMember(member.id, { ...profile, name, email: profile.email.trim(), city: profile.city.trim() });
    saveWaiver({ type: waiverType, memberId: member.id, submittedAt: new Date().toISOString(), name,
      email: profile.email.trim(), city: profile.city.trim(), weight: profile.weight,
      details: { ...profile.details }, acceptedTerms: [...acceptedTerms], marketingConsent });
    setError("");
    setMessage("Waiver tallennettu. Jäsenen tiedot on päivitetty.");
    setAcceptedTerms(waiverTerms.map(() => false));
    setMarketingConsent(null);
  }}>
    <label className="member-search">Waiverin tyyppi<select value={waiverType} onChange={(event) => changeType(event.target.value as WaiverType)}>
      {Object.entries(waiverTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    </select></label>
    {hasWaiver && <p className="waiver-note">Uusi waiver korvaa tämän jäsenen aiemman samantyyppisen waiverin.</p>}
    <MemberDetailFields waiverType={waiverType} details={profile.details} weight={profile.weight} required update={(details) => setProfile({ ...profile, details })}>
      <label>Etunimi<input required value={firstName} pattern=".*\S.*" onChange={(event) => setFirstName(event.target.value)} /></label>
      <label>Sukunimi<input required value={lastName} pattern=".*\S.*" onChange={(event) => setLastName(event.target.value)} /></label>
      <label>{waiverType === "pilot" ? "Paino (kg)" : "Exit-paino (kg)"}<input type="number" required min="1" max="300" step="0.1" value={profile.weight} onChange={(event) => setProfile({ ...profile, weight: Number(event.target.value) })} /></label>
      <label>Sähköposti<input type="email" required value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label>
      <label>Postitoimipaikka<input required pattern=".*\S.*" value={profile.city} onChange={(event) => setProfile({ ...profile, city: event.target.value })} /></label>
    </MemberDetailFields>
    <fieldset className="waiver-terms"><legend>Sitoudun toimimaan seuraavien mukaisesti:</legend>
      {waiverTerms.map((term, index) => <label key={term}><input type="checkbox" required checked={acceptedTerms[index]} onChange={(event) => setAcceptedTerms(acceptedTerms.map((accepted, position) => position === index ? event.target.checked : accepted))} />{term}</label>)}
    </fieldset>
    <fieldset><legend>Markkinointi</legend><p>Minusta otettuja kuvia ja videomateriaalia saa käyttää Oulu Skydive Center ry:n markkinoinnissa.</p>
      <div className="waiver-radio">{([ [true, "Kyllä"], [false, "Ei"] ] as const).map(([value, label]) => <label key={label}><input type="radio" required name="marketingConsent" checked={marketingConsent === value} onChange={() => setMarketingConsent(value)} />{label}</label>)}</div>
    </fieldset>
    {error && <p role="alert" className="waiver-error">{error}</p>}
    {message && <p role="status" className="waiver-success">{message}</p>}
    <div className="waiver-actions">
      <button type="submit" className="primary-button">Tallenna waiver</button>
      <button type="button" className="queue-cancel-button" onClick={cancel}>Peruuta</button>
    </div>
  </form>;
};

type FillWaiverProps = {
  members: Member[];
  waivers: Waiver[];
  updateMember: (id: string, profile: MemberProfile) => void;
  saveWaiver: (waiver: Waiver) => void;
};

export const FillWaiver = ({ members, waivers, updateMember, saveWaiver }: FillWaiverProps) => {
  const [waiverType, setWaiverType] = useState<WaiverType>("licensed");
  const [memberId, setMemberId] = useState("");
  const member = members.find((person) => person.id === memberId);
  return <main className="members-view waiver-view"><h1>Täytä waiver</h1>
    {!member && <label className="member-search waiver-person-picker"><span>Testaa waiverin täyttämistä seuraavalle henkilölle:</span><select aria-label="Jäsen" value={memberId} onChange={(event) => setMemberId(event.target.value)}>
      <option value="">Valitse jäsen</option>{[...members].sort((a, b) => a.name.localeCompare(b.name, "fi-FI")).map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
    </select></label>}
    {member && <WaiverForm key={`${member.id}:${waiverType}`} waiverType={waiverType} changeType={setWaiverType}
      cancel={() => { setMemberId(""); setWaiverType("licensed"); }} member={member} updateMember={updateMember} saveWaiver={saveWaiver} hasWaiver={waivers.some((waiver) => waiver.memberId === member.id && waiver.type === waiverType)} />}
  </main>;
};

type WaiverReviewProps = { waivers: Waiver[]; save: (waiver: Waiver) => void };

const validityDate = (date: string) => date
  ? <span className={date < todayDate() ? "waiver-expired" : ""}>{new Date(`${date}T12:00:00`).toLocaleDateString("fi-FI")}</span>
  : "—";

export const WaiverReview = ({ waivers, save }: WaiverReviewProps) => {
  const [selected, setSelected] = useState("");
  const waiver = waivers.find((item) => `${item.memberId}:${item.type}` === selected);
  if (waiver) return <WaiverInspection key={`${selected}:${waiver.submittedAt}`} waiver={waiver} save={save} close={() => setSelected("")} />;
  return <main className="members-view">
  <div className="members-heading"><h1>Waiverin tarkastus</h1><span>{waivers.length}</span></div>
  <div className="members-table-wrap"><table className="members-table"><thead><tr>
    <th scope="col">Nimi</th><th scope="col">Waiverin tyyppi</th><th scope="col">Täytetty</th><th scope="col">Lisenssi / lentokokemus</th><th scope="col">Voimassaolo</th><th scope="col">Tarkastus</th>
  </tr></thead><tbody>{[...waivers].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).map((waiver) => <tr key={`${waiver.memberId}:${waiver.type}`}>
    <td><button className="waiver-open-button" onClick={() => setSelected(`${waiver.memberId}:${waiver.type}`)}>{waiver.name}</button></td><td>{waiverTypeLabels[waiver.type]}</td><td>{new Date(waiver.submittedAt).toLocaleString("fi-FI")}</td>
    <td>{waiver.type === "pilot" ? <>
      <div>Lentotunnit: {waiver.details.totalFlightHours} · Lennot: {waiver.details.totalFlights}</div>
      <div>Hyppylennot: {waiver.details.skydiveFlights} · Hyppylentotunnit: {waiver.details.skydiveFlightHours}</div>
    </> : waiver.type === "basic" ? "—" : waiver.details.license === "Student" ? "Oppilas" : waiver.details.license === "None" ? "Ei lisenssiä" : waiver.details.license}</td>
    <td>{waiver.type === "pilot" ? <>
      <div>SEP: {validityDate(waiver.details.sepValidUntil)}</div>
      <div>Kielikoe EN: {validityDate(waiver.details.englishExamValidUntil)}</div>
      <div>Medikaali: {validityDate(waiver.details.medicalValidUntil)}</div>
    </> : waiver.details.clubGearOnly ? "Kerhon varjokalusto" : waiver.type === "basic" ? "—" : validityDate(waiver.details.inspectionsValidUntil)}</td>
    <td><div className="waiver-review-actions">
      {waiver.review && <span>{`${waiver.review.checks.filter(Boolean).length} / ${waiver.type === "pilot" ? 2 : 5}`}</span>}
      {!Array.from({ length: waiver.type === "pilot" ? 2 : 5 }, (_, index) => waiver.review?.checks[index] === true).every(Boolean) &&
        <button className="primary-button" onClick={() => setSelected(`${waiver.memberId}:${waiver.type}`)}>Tarkasta</button>}
    </div></td>
  </tr>)}</tbody></table>{waivers.length === 0 && <p className="members-empty">Ei täytettyjä waivereita.</p>}</div>
</main>;
};
