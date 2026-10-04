export type GiftActivity = { activity_date?: string; action?: string; amount?: string | number };
export type RawGiftCard = {
  pimwick_gift_card_id: string; number: string; active?: string; create_date?: string;
  expiration_date?: string; product_id?: string; order_item_id?: string; balance?: string;
};
export type GiftOrderLine = { id: number; product_id: number; name: string; quantity: number; total: string; total_tax?: string };
export type GiftOrder = { id: number; status: string; currency?: string; date_paid?: string; date_paid_gmt?: string; line_items: GiftOrderLine[]; refunds?: { id: number }[] };
export type GiftRefund = { date_created?: string; line_items?: { total: string; total_tax?: string; product_id: number; meta_data?: { key: string; value: unknown }[] }[] };
export type GiftCard = {
  id: string; number: string; productId: string; type: string; created: string; expires: string | null;
  balanceCents: number; active: boolean; usedYears: number[]; purchaseYear: number | null;
  expiredUnusedCents: number | null; activityAvailable: boolean;
};
export type GiftSales = { year: number; productId: string; cents: number };
export type GiftYear = { year: number; revenueCents: number; bought: number; used: number; expired: number; expiredUnusedCents: number; unknownExpiryBalances: number };
export type GiftCardReport = { cards: GiftCard[]; sales: GiftSales[]; fetchedAt: string; warnings: string[]; currency: "EUR" };
export type GiftCardStatus = { status: "loading" | "ready" | "error"; progress?: string; report?: GiftCardReport; error?: string };

export const moneyCents = (value: string | number | undefined) => Math.round(Number(value ?? 0) * 100);
const dateOnly = (value?: string) => value && /^\d{4}-\d{2}-\d{2}/.test(value) && !value.startsWith("0000") ? value.slice(0, 10) : null;
const yearOf = (value?: string) => { const date = dateOnly(value); return date ? Number(date.slice(0, 4)) : null; };

export const buildGiftCardReport = (raw: RawGiftCard[], details: Map<string, GiftActivity[]>, products: Map<string, string>, orders: GiftOrder[], refunds: GiftRefund[], today: string): GiftCardReport => {
  const giftProductIds = new Set(raw.map((card) => String(card.product_id ?? "0")).filter((id) => id !== "0"));
  const byLine = new Map<number, { order: GiftOrder; line: GiftOrderLine }>();
  const sales: GiftSales[] = [];
  let missingPaidDates = 0;
  let otherCurrencies = 0;
  for (const order of orders) {
    if (!["completed", "processing", "refunded"].includes(order.status)) continue;
    for (const line of order.line_items ?? []) byLine.set(line.id, { order, line });
    const lines = (order.line_items ?? []).filter((line) => giftProductIds.has(String(line.product_id)));
    if (!lines.length) continue;
    if (order.currency !== "EUR") { otherCurrencies++; continue; }
    const year = yearOf(order.date_paid);
    if (!year) { missingPaidDates++; continue; }
    for (const line of lines) sales.push({ year, productId: String(line.product_id), cents: moneyCents(line.total) + moneyCents(line.total_tax) });
  }
  let unallocatedRefunds = 0;
  for (const refund of refunds) {
    const year = yearOf(refund.date_created);
    if (!refund.line_items?.length) { unallocatedRefunds++; continue; }
    if (!year) continue;
    for (const line of refund.line_items) if (giftProductIds.has(String(line.product_id))) {
      sales.push({ year, productId: String(line.product_id), cents: -Math.abs(moneyCents(line.total) + moneyCents(line.total_tax)) });
    }
  }
  const cards: GiftCard[] = raw.map((card) => {
    const activity = details.get(card.pimwick_gift_card_id);
    const purchase = byLine.get(Number(card.order_item_id));
    const expires = dateOnly(card.expiration_date);
    const productId = String(card.product_id || purchase?.line.product_id || "0");
    const balanceCents = moneyCents(card.balance);
    const sum = activity?.reduce((total, item) => total + moneyCents(item.amount), 0);
    // Reconstruct the balance at expiry, rather than treating the original face value as unused.
    const expiredUnusedCents = expires && expires < today && activity && sum === balanceCents
      ? Math.max(0, activity.filter((item) => dateOnly(item.activity_date) && item.activity_date!.slice(0, 10) <= expires)
        .reduce((total, item) => total + moneyCents(item.amount), 0)) : null;
    return {
      id: card.pimwick_gift_card_id, number: card.number, productId,
      type: products.get(productId) ?? purchase?.line.name ?? "Muu / ei tuotetietoa",
      created: dateOnly(card.create_date) ?? "", expires, balanceCents, active: String(card.active) === "1",
      usedYears: [...new Set((activity ?? []).filter((item) => moneyCents(item.amount) < 0 && item.action === "transaction")
        .map((item) => yearOf(item.activity_date)).filter((year): year is number => year !== null))],
      purchaseYear: purchase && purchase.order.currency === "EUR" ? yearOf(purchase.order.date_paid) : null,
      expiredUnusedCents, activityAvailable: activity !== undefined,
    };
  });
  const warnings = [
    "Käyttömäärät perustuvat korttien negatiivisiin saldotapahtumiin; mukana voi olla myös manuaalisia saldokorjauksia.",
    "Vanhentunut käyttämätön saldo lasketaan kortin saldosta vanhenemispäivän lopussa. Se ei ole alkuperäinen lahjakorttiarvo.",
    "Myynti perustuu maksettujen WooCommerce-tilausten lahjakorttiriveihin, sisältää verot ja vähentää eritellyt palautukset palautusvuonna.",
  ];
  const unlinked = cards.filter((card) => card.purchaseYear === null).length;
  if (unlinked) warnings.push(`${unlinked} kortin ostovuotta ei voitu vahvistaa tilauksesta. Näitä ei lasketa ostettujen korttien lukumäärään.`);
  const missing = cards.filter((card) => !card.activityAvailable).length;
  if (missing) warnings.push(`${missing} kortin tapahtumia ei saatu haettua. Käyttö- ja vanhenemistilastot ovat näiltä osin puutteelliset.`);
  if (missingPaidDates) warnings.push(`${missingPaidDates} lahjakorttitilaukselta puuttuu maksupäivä, eikä sitä ole laskettu myyntiin.`);
  if (otherCurrencies) warnings.push(`${otherCurrencies} muun valuutan tilausta jätettiin euromääräisestä myynnistä pois.`);
  if (unallocatedRefunds) warnings.push(`${unallocatedRefunds} palautusta ei ollut eritelty tuoteriveille; niitä ei ole kohdistettu lahjakorttimyyntiin.`);
  return { cards, sales, fetchedAt: new Date().toISOString(), warnings, currency: "EUR" };
};

export const giftCardYears = (report: GiftCardReport, today: string, productId = "all"): GiftYear[] => {
  const years = new Map<number, GiftYear>();
  const get = (year: number) => {
    if (!years.has(year)) years.set(year, { year, revenueCents: 0, bought: 0, used: 0, expired: 0, expiredUnusedCents: 0, unknownExpiryBalances: 0 });
    return years.get(year)!;
  };
  get(Number(today.slice(0, 4)));
  for (const sale of report.sales) if (productId === "all" || sale.productId === productId) get(sale.year).revenueCents += sale.cents;
  for (const card of report.cards) {
    if (productId !== "all" && card.productId !== productId) continue;
    if (card.purchaseYear) get(card.purchaseYear).bought++;
    for (const year of card.usedYears) get(year).used++;
    if (card.expires && card.expires < today) {
      const row = get(Number(card.expires.slice(0, 4)));
      row.expired++;
      if (card.expiredUnusedCents === null) row.unknownExpiryBalances++;
      else row.expiredUnusedCents += card.expiredUnusedCents;
    }
  }
  return [...years.values()].sort((a, b) => b.year - a.year);
};
