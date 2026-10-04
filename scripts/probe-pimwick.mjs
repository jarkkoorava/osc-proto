// Read-only connectivity/schema probe. Never print credentials, card codes or customer values.
const auth = `Basic ${Buffer.from(`${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`).toString("base64")}`;
const shape = (data, depth = 0) => {
  if (depth > 4) return Array.isArray(data) ? "array" : typeof data;
  if (Array.isArray(data)) return { count: data.length, item: data.length ? shape(data[0], depth + 1) : null };
  if (data && typeof data === "object") return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, shape(value, depth + 1)]));
  return typeof data;
};
for (const path of ["/pw-gift-cards?limit=100000"]) {
  try {
    const response = await fetch(`${process.env.PIMWICK_API_URL}${path}`, { headers: { Authorization: auth }, signal: AbortSignal.timeout(30000), redirect: "error" });
    const data = await response.json();
    console.log(JSON.stringify({ path, status: response.status, shape: shape(data) }));
    if (path === "" && response.ok) console.log(JSON.stringify({ routes: Object.keys(data.routes ?? {}) }));
    if (Array.isArray(data) && data.length) {
      console.log(JSON.stringify({ cards: data.length, productIds: [...new Set(data.map((card) => card.product_id))], withOrderItem: data.filter((card) => Number(card.order_item_id) > 0).length }));
      const card = data[0];
      const single = await fetch(`${process.env.PIMWICK_API_URL}/pw-gift-cards/${encodeURIComponent(card.pimwick_gift_card_id)}`, { headers: { Authorization: auth }, signal: AbortSignal.timeout(30000), redirect: "error" });
      console.log(JSON.stringify({ singleStatus: single.status, singleShape: shape(await single.json()) }));
      const actions = new Map();
      for (const card of data.slice(0, 10)) {
        const response = await fetch(`${process.env.PIMWICK_API_URL}/pw-gift-cards/${card.pimwick_gift_card_id}`, { headers: { Authorization: auth }, signal: AbortSignal.timeout(30000), redirect: "error" });
        const details = await response.json();
        for (const activity of details.activity ?? []) actions.set(activity.action, { amountSign: Math.sign(Number(activity.amount)), hasOrderReference: /order|tilaus/i.test(activity.note ?? "") });
      }
      console.log(JSON.stringify({ actions: Object.fromEntries(actions) }));
    }
  } catch { console.log(JSON.stringify({ path, error: "Connection failed" })); }
}
for (const route of ["products?include=13013,13039,13017&per_page=100&_fields=id,name,type", "orders?per_page=100&_fields=id,status,date_paid,date_created,pw_gift_cards_redeemed,line_items,refunds"]) {
  try {
    const response = await fetch(`${process.env.WOOCOMMERCE_URL}/wp-json/wc/v3/${route}`, { headers: { Authorization: auth }, signal: AbortSignal.timeout(30000), redirect: "error" });
    const data = await response.json();
    console.log(JSON.stringify({ route, status: response.status, pages: response.headers.get("x-wp-totalpages"), shape: shape(data) }));
    if (route.startsWith("products") && Array.isArray(data)) console.log(JSON.stringify({ products: data }));
    if (route.startsWith("orders") && Array.isArray(data)) {
      const redeemed = data.flatMap((order) => order.pw_gift_cards_redeemed ?? []);
      console.log(JSON.stringify({ redemptionShape: shape(redeemed), paidOrders: data.filter((order) => order.date_paid).length }));
    }
  } catch { console.log(JSON.stringify({ route, error: "Connection failed" })); }
}
