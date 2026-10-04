import { members } from "./members.ts";
import { jumpPrice, jumpTypes, LICENSE_JUMP_PRICES, loadFlightState } from "./manifest.ts";
import type { Jump, Load } from "./manifest.ts";

export type Transaction = {
  id: string; memberId: string; at: string; amountCents: number;
  kind: "opening" | "deposit" | "jump" | "correction";
  description: string; reference?: string; signature?: string; prices?: Record<number, number>;
  jumpType?: string; altitude?: number;
};

export const billedJumpPrice = (jump: Jump, load: Load, prices = LICENSE_JUMP_PRICES) => {
  if (jump.type.startsWith("Tandem")) return 0;
  if (jump.returnedByPlane && jump.type === "Student") return 0;
  return jumpPrice(jump, load.jumps, prices) ?? 0;
};

// Reconcile by stable load/member reference: repeat saves never charge twice.
// Corrections append adjustments; original transactions and price snapshots remain intact.
export const reconcileTransactions = (existing: Transaction[] | undefined, loads: Load[], prices: Record<number, number>, now = new Date().toISOString()): Transaction[] => {
  const metadata = new Map<string, { jumpType: string; altitude: number }>();
  const result = (existing ?? []).map((item) => {
    // Older ledger entries already contain their original jump details in the signature.
    let details = item.reference ? metadata.get(item.reference) : undefined;
    try {
      const signature = JSON.parse(item.signature ?? "null");
      if (Array.isArray(signature) && jumpTypes.includes(signature[0]) && Number.isFinite(signature[1])) {
        details = { jumpType: signature[0], altitude: signature[1] };
      }
    } catch { /* Reversals use the non-JSON signature "void". */ }
    if (item.reference && details) metadata.set(item.reference, details);
    return details ? { ...details, ...item } : item;
  });
  const ids = new Set(result.map((item) => item.id));
  for (const member of members) {
    const id = `opening-${member.id}`;
    if (!ids.has(id)) result.push({ id, memberId: member.id, at: "2026-02-28T12:00:00Z", amountCents: 20000,
      kind: "opening", description: "Alkusaldo" });
  }
  const charged = new Map<string, { total: number; last: Transaction; prices: Record<number, number> }>();
  for (const item of result) {
    if (!item.reference) continue;
    const previous = charged.get(item.reference);
    charged.set(item.reference, { total: (previous?.total ?? 0) + item.amountCents, last: item,
      prices: previous?.prices ?? item.prices ?? prices });
  }
  const wanted = new Set<string>();
  for (const load of new Map(loads.map((load) => [load.id, load])).values()) {
    if (loadFlightState(load) !== "Dropped") continue;
    for (const jump of load.jumps) {
      const reference = `${load.id}:${jump.skydiverId}`;
      wanted.add(reference);
      const old = charged.get(reference);
      const rate = old?.prices ?? (load.id.startsWith("load-demo-history-") ? LICENSE_JUMP_PRICES : prices);
      const amount = -Math.round(billedJumpPrice(jump, load, rate) * 100) || 0;
      const signature = JSON.stringify([jump.type, jump.altitude, jump.instructorId, Boolean(jump.returnedByPlane),
        load.jumps.filter((item) => item.type === "Student" && item.instructorId === jump.skydiverId).map((item) => item.skydiverId).sort()]);
      if (old && old.total === amount && old.last.signature === signature) continue;
      result.push({ id: `ledger-${result.length + 1}`, memberId: jump.skydiverId,
        at: old ? now : load.jumpedAt ?? `${load.date}T12:00:00Z`, amountCents: amount - (old?.total ?? 0),
        kind: old ? "correction" : "jump", reference, signature, prices: { ...rate },
        jumpType: jump.type, altitude: jump.altitude,
        description: `${old ? "Korjaus · " : ""}Poka ${load.number} · ${load.date} · ${jump.altitude} m${jump.returnedByPlane ? " · Koneella alas" : ""}` });
    }
  }
  for (const [reference, old] of charged) {
    if (wanted.has(reference) || old.last.signature === "void") continue;
    result.push({ id: `ledger-${result.length + 1}`, memberId: old.last.memberId, at: now,
      amountCents: -old.total, kind: "correction", reference, signature: "void", prices: old.prices,
      jumpType: old.last.jumpType, altitude: old.last.altitude,
      description: "Hyppyveloituksen peruutus" });
  }
  return result;
};

export const memberBalance = (transactions: Transaction[], memberId: string) => transactions
  .filter((item) => item.memberId === memberId).reduce((sum, item) => sum + item.amountCents, 0);
