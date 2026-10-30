import { useRef, useState } from "react";
import type { Member } from "./data/members";
import { memberBalance } from "./data/transactions";
import type { Transaction } from "./data/transactions";
import { loadFlightState, roleClass } from "./data/manifest";
import { roleLabels } from "./fi";
import { AccountQueue } from './AccountQueue';
import type { Jump, Load } from './data/manifest';

export const AccountView = ({ members, transactions, deposit, queue, loads, joinQueue }: {
  queue: Jump[]; loads: Load[]; joinQueue: (jump: Jump) => void;
  members: Member[]; transactions: Transaction[]; deposit: (memberId: string, amountCents: number) => void;
}) => {
  const [memberId, setMemberId] = useState(members[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const euro = (cents: number) => (cents / 100).toLocaleString("fi-FI", { style: "currency", currency: "EUR" });
  const balance = memberBalance(transactions, memberId);
  const entries = transactions.filter((item) => item.memberId === memberId).sort((a, b) => b.at.localeCompare(a.at));
  return <main className="members-view account-view">
    <div className="members-heading"><h1>Oma sivu</h1></div>
    <label className="member-search">Jäsen<select aria-label="Jäsen" value={memberId} onChange={(event) => setMemberId(event.target.value)}>
      {[...members].sort((a, b) => a.name.localeCompare(b.name, "fi")).map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
    </select></label>
    {members.find(member => member.id === memberId) && <AccountQueue key={memberId} member={members.find(member => member.id === memberId)!} queue={queue}
      queueJump={queue.find(jump => jump.skydiverId === memberId)} load={loads.find(load => loadFlightState(load) !== 'Dropped' && load.jumps.some(jump => jump.skydiverId === memberId))} join={joinQueue} />}
    <section className="account-balance"><h2>Nykyinen saldo</h2><strong className={balance < 0 ? "waiver-error" : ""}>{euro(balance)}</strong>
      <button className="primary-button" onClick={() => { setAmount(""); dialog.current?.showModal(); }}>Lisää saldoa</button></section>
    <div className="members-table-wrap"><table className="members-table"><thead><tr><th>Päivämäärä</th><th>Tapahtuma</th><th>Hyppääjän tyyppi</th><th>Korkeus</th><th>Summa</th></tr></thead>
      <tbody>{entries.map((item) => <tr key={item.id}><td>{new Date(item.at).toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" })}</td>
        <td>{item.description}</td>
        <td>{item.jumpType && <span className={`account-jump-type queue-role-tag ${roleClass(item.jumpType === "License" ? "Licensed" : item.jumpType)}`}>
              {roleLabels[item.jumpType === "License" ? "Licensed" : item.jumpType] ?? item.jumpType}
            </span>}</td>
        <td className="account-altitude">{item.altitude !== undefined ? `${item.altitude.toLocaleString("fi-FI")} m` : ""}</td>
        <td className={item.amountCents > 0 ? "transaction-positive" : item.amountCents < 0 ? "transaction-negative" : "transaction-zero"}>{euro(item.amountCents)}</td></tr>)}</tbody></table></div>
    <dialog ref={dialog} className="history-edit-dialog" aria-labelledby="deposit-heading"><form className="waiver-form" onSubmit={(event) => {
      event.preventDefault();
      const cents = Math.round(Number(amount) * 100);
      if (!Number.isSafeInteger(cents) || cents <= 0) return;
      deposit(memberId, cents); dialog.current?.close();
    }}><h2 id="deposit-heading">Lisää saldoa</h2><label>Talletettava summa (€)<input autoFocus required type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
      <div className="waiver-actions"><button className="primary-button" type="submit">Talleta</button><button className="queue-cancel-button" type="button" onClick={() => dialog.current?.close()}>Peruuta</button></div>
    </form></dialog>
  </main>;
};
