import { useRef, useState } from "react";
import type { Member } from "./data/members";
import { todayDate } from "./data/members";
import { roleLabels } from "./fi";
import { membershipTypes, memberRoles } from "./useMembers";
import type { MemberProfile } from "./useMembers";
import { MemberDetailFields } from "./MemberDetailFields";
import { emptyMemberDetails } from "./data/waiver";
import type { Transaction } from "./data/transactions";

const membershipLabels = { Default: "Varsinainen", Honorary: "Kunniajäsen", "Super honorary": "Kunniahyppääjä", "Non-jumping": "Ei-hyppäävä", Tandem: "Tandem" };
const columns = [ ["name", "Nimi"], ["city", "Kaupunki"], ["email", "Sähköposti"], ["roles", "Roolit"], ["weight", "Paino (kg)"], ["membershipType", "Jäsenyystyyppi"], ["membershipStartDate", "Jäsenyyden alkamispäivä"] ] as const;
type SortKey = typeof columns[number][0] | "balance";
const searchName = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fi-FI");

type MembersProps = {
  members: Member[];
  transactions: Transaction[];
  updateMember: (id: string, profile: MemberProfile) => string | null;
};

export const Members = ({ members, updateMember, transactions }: MembersProps) => {
  const balances = new Map<string, number>();
  for (const transaction of transactions) balances.set(transaction.memberId, (balances.get(transaction.memberId) ?? 0) + transaction.amountCents);
  const [search, setSearch] = useState("");
  const [membersSince, setMembersSince] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; descending: boolean }>({ key: "name", descending: false });
  const [editing, setEditing] = useState<Member | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const sortValue = (member: Member) => sort.key === "balance" ? balances.get(member.id) ?? 0 : sort.key === "roles" ? member.roles.map((role) => roleLabels[role]).join(", ") : sort.key === "membershipType" ? membershipLabels[member.membershipType] : member[sort.key];
  const filtered = members.filter((member) => searchName(member.name).includes(searchName(search.trim())) && (!membersSince || member.membershipStartDate >= membersSince)).sort((a, b) => {
    const first = sortValue(a), second = sortValue(b);
    const result = typeof first === "number" && typeof second === "number" ? first - second : String(first).localeCompare(String(second), "fi-FI");
    return sort.descending ? -result : result;
  });
  return <main className="members-view">
    <div className="members-heading"><h1>Jäsenet</h1><span>{filtered.length} / {members.length}</span></div>
    <dl className="membership-summary" aria-label="Jäsenyystyyppien yhteenveto">
      {membershipTypes.map((type) => <div key={type}><dt>{membershipLabels[type]}</dt><dd>{members.filter((member) => member.membershipType === type).length}</dd></div>)}
    </dl>
    <div className="member-filters">
    <label className="member-search">Hae nimellä<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Jäsenen nimi" /></label>
    <label className="member-search">Jäsenet alkaen<input type="date" max={todayDate()} value={membersSince} onChange={(event) => setMembersSince(event.target.value)} /></label>
    {membersSince && <button className="secondary-button" onClick={() => setMembersSince("")}>Tyhjennä päivämäärä</button>}
    </div>
    <div className="members-table-wrap"><table className="members-table member-directory-table">
      <thead><tr>{columns.map(([key, label]) => <th key={key} scope="col" aria-sort={sort.key === key ? sort.descending ? "descending" : "ascending" : "none"}>
        <button onClick={() => setSort({ key, descending: sort.key === key ? !sort.descending : false })}>{label}<span aria-hidden="true">{sort.key === key ? sort.descending ? " ↓" : " ↑" : " ↕"}</span></button>
      </th>)}<th scope="col" aria-sort={sort.key === "balance" ? sort.descending ? "descending" : "ascending" : "none"}>
        <button onClick={() => setSort({ key: "balance", descending: sort.key === "balance" ? !sort.descending : false })}>Saldo (€)<span aria-hidden="true">{sort.key === "balance" ? sort.descending ? " ↓" : " ↑" : " ↕"}</span></button>
      </th><th scope="col">Toiminnot</th></tr></thead>
      <tbody>{filtered.map((member) => <tr key={member.id}>
        <td className="member-name">{member.name}</td><td>{member.city}</td><td>{member.email}</td><td>{member.roles.map((role) => roleLabels[role]).join(", ")}</td><td>{member.weight.toLocaleString("fi-FI")}</td><td>{membershipLabels[member.membershipType]}</td><td><time dateTime={member.membershipStartDate}>{new Date(`${member.membershipStartDate}T12:00:00`).toLocaleDateString("fi-FI")}</time></td>
        <td className={(balances.get(member.id) ?? 0) < 0 ? "transaction-negative" : undefined}>{((balances.get(member.id) ?? 0) / 100).toLocaleString("fi-FI", { style: "currency", currency: "EUR" })}</td>
        <td><button className="secondary-button" aria-label={`Muokkaa: ${member.name}`} onClick={() => { setError(null); setEditing({ ...member, roles: [...member.roles] }); dialog.current?.showModal(); }}>Muokkaa</button></td>
      </tr>)}</tbody>
    </table>{filtered.length === 0 && <p className="members-empty">Ei hakua vastaavia jäseniä.</p>}</div>
    <dialog ref={dialog} className="jump-details-dialog member-dialog" aria-labelledby="member-editor-title" onClose={() => setEditing(null)}>
      {editing && <form className="jump-details-content" onSubmit={(event) => {
        event.preventDefault();
        if (!editing.roles.length) { setError("Valitse vähintään yksi rooli."); return; }
        const saveError = updateMember(editing.id, { name: editing.name.trim(), city: editing.city.trim(), email: editing.email.trim(), weight: editing.weight, membershipType: editing.membershipType, roles: editing.roles, membershipStartDate: editing.membershipStartDate, details: editing.details });
        if (saveError) { setError(saveError); return; }
        dialog.current?.close();
      }}>
        <h2 id="member-editor-title">Muokkaa jäsentä</h2>
        {([ ["name", "Nimi"], ["city", "Kaupunki"], ["email", "Sähköposti"] ] as const).map(([key, label]) => <label key={key}>{label}<input required type={key === "email" ? "email" : "text"} value={editing[key]} pattern={key !== "email" ? ".*\\S.*" : undefined} onChange={(event) => setEditing({ ...editing, [key]: event.target.value })} /></label>)}
        <label>Paino (kg)<input required type="number" min="1" max="300" step="0.1" value={editing.weight} onChange={(event) => setEditing({ ...editing, weight: Number(event.target.value) })} /></label>
        <label>Jäsenyyden alkamispäivä<input required type="date" max={todayDate()} value={editing.membershipStartDate} onChange={(event) => setEditing({ ...editing, membershipStartDate: event.target.value })} /></label>
        <label>Jäsenyystyyppi<select value={editing.membershipType} onChange={(event) => setEditing({ ...editing, membershipType: event.target.value as Member["membershipType"] })}>{membershipTypes.map((type) => <option key={type} value={type}>{membershipLabels[type]}</option>)}</select></label>
        <fieldset className="member-roles"><legend>Roolit</legend>{memberRoles.map((role) => <label key={role}><input type="checkbox" checked={editing.roles.includes(role)} onChange={(event) => setEditing({ ...editing, roles: event.target.checked ? [...editing.roles, role] : editing.roles.filter((value) => value !== role) })} />{roleLabels[role]}</label>)}</fieldset>
        <details className="member-extra-details"><summary>Waiverin tiedot</summary><MemberDetailFields details={{ ...emptyMemberDetails(), ...editing.details }} weight={editing.weight} update={(details) => setEditing({ ...editing, details })} /></details>
        {error && <p role="alert">{error}</p>}
        <div className="member-editor-actions"><button type="button" className="secondary-button" onClick={() => dialog.current?.close()}>Peruuta</button><button type="submit" className="primary-button">Tallenna</button></div>
      </form>}
    </dialog>
  </main>;
};
