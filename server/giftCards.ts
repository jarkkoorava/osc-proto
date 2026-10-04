import type { IncomingMessage, ServerResponse } from 'node:http';
import { buildGiftCardReport } from '../src/data/giftCards.ts';
import type { GiftActivity, GiftCardStatus, GiftOrder, GiftRefund, RawGiftCard } from '../src/data/giftCards.ts';

export function giftCardApi(env: Record<string, string>) {
  const enabled = Boolean(env.WOOCOMMERCE_CONSUMER_KEY && env.WOOCOMMERCE_CONSUMER_SECRET && env.PIMWICK_API_URL && env.WOOCOMMERCE_URL);
  let state: GiftCardStatus | undefined;
  let completedAt = 0;
  async function request(base: string, path: string) {
    const url = new URL(`${base.replace(/\/$/, '')}/${path}`);
    if (url.protocol !== 'https:') throw new Error('HTTPS required');
    const response = await fetch(url, { headers: { Authorization: `Basic ${Buffer.from(`${env.WOOCOMMERCE_CONSUMER_KEY}:${env.WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64')}` }, redirect: 'error', signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`);
    return { data: await response.json(), pages: Number(response.headers.get('x-wp-totalpages') ?? 1) };
  }
  async function collect() {
    try {
      state = { status: 'loading', progress: 'Haetaan lahjakortteja ja tilauksia…' };
      const raw = (await request(env.PIMWICK_API_URL, 'pw-gift-cards?limit=100000')).data as RawGiftCard[];
      if (!Array.isArray(raw) || raw.length >= 100000) throw new Error('Incomplete gift card list');
      const ids = [...new Set(raw.map(card => card.product_id).filter(id => id && id !== '0'))];
      const woo = `${env.WOOCOMMERCE_URL.replace(/\/$/, '')}/wp-json/wc/v3`;
      const products = ids.length ? (await request(woo, `products?include=${ids.join(',')}&per_page=100&_fields=id,name`)).data as { id: number; name: string }[] : [];
      const orders: GiftOrder[] = [];
      let pages = 1;
      for (let page = 1; page <= pages; page++) {
        state = { status: 'loading', progress: `Haetaan tilauksia: sivu ${page} / ${pages}…` };
        const result = await request(woo, `orders?per_page=100&page=${page}&_fields=id,status,currency,date_paid,line_items,refunds`);
        pages = result.pages;
        orders.push(...result.data as GiftOrder[]);
      }
      const refunds: GiftRefund[] = [];
      for (const order of orders.filter(order => order.currency === 'EUR' && order.refunds?.length && order.line_items.some(line => ids.includes(String(line.product_id))))) {
        let refundPages = 1;
        for (let page = 1; page <= refundPages; page++) {
          const result = await request(woo, `orders/${order.id}/refunds?per_page=100&page=${page}&_fields=date_created,line_items`);
          refundPages = result.pages;
          refunds.push(...result.data as GiftRefund[]);
        }
      }
      const details = new Map<string, GiftActivity[]>();
      let next = 0;
      let done = 0;
      await Promise.all(Array.from({ length: 4 }, async () => {
        while (next < raw.length) {
          const card = raw[next++];
          try {
            const result = await request(env.PIMWICK_API_URL, `pw-gift-cards/${Number(card.pimwick_gift_card_id)}`);
            const data = result.data as { activity?: GiftActivity[] };
            if (Array.isArray(data.activity)) details.set(card.pimwick_gift_card_id, data.activity);
          } catch { /* Missing activity is reported explicitly in the report. */ }
          state = { status: 'loading', progress: `Haetaan korttien tapahtumia: ${++done} / ${raw.length}…` };
        }
      }));
      const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Helsinki' }).format(new Date());
      state = { status: 'ready', report: buildGiftCardReport(raw, details, new Map(products.map(product => [String(product.id), product.name])), orders, refunds, today) };
      completedAt = Date.now();
    } catch {
      state = { status: 'error', error: 'Lahjakorttien haku epäonnistui. Tarkista palvelimen API-asetukset ja yhteys verkkokauppaan.' };
    }
  }
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    if (!['/api/features', '/api/gift-cards', '/api/gift-cards/detail'].includes(url.pathname)) return next();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') { res.statusCode = 405; res.end('{}'); return; }
    if (url.pathname === '/api/features') { res.end(JSON.stringify({ giftCards: enabled })); return; }
    if (!enabled) { res.statusCode = 404; res.end('{}'); return; }
    if (url.pathname === '/api/gift-cards/detail') {
      const number = url.searchParams.get('number')?.trim();
      if (!number || number.length > 200) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Anna lahjakortin numero.' })); return; }
      void (async () => {
        try {
          // The installed Pimwick API accepts numeric IDs, not gift-card numbers.
          const cards = state?.report?.cards ?? (await request(env.PIMWICK_API_URL, 'pw-gift-cards?limit=100000')).data as RawGiftCard[];
          const card = cards.find(card => card.number.toLowerCase() === number.toLowerCase());
          if (!card) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Lahjakorttia ei löytynyt.' })); return; }
          const id = 'id' in card ? card.id : card.pimwick_gift_card_id;
          const result = await request(env.PIMWICK_API_URL, `pw-gift-cards/${Number(id)}`);
          res.end(JSON.stringify(result.data));
        } catch { res.statusCode = 502; res.end(JSON.stringify({ error: 'Lahjakortin tietojen haku epäonnistui. Yritä uudelleen.' })); }
      })();
      return;
    }
    if (!state || (state.status !== 'loading' && url.searchParams.has('refresh')) || (state.status === 'ready' && Date.now() - completedAt > 300000)) void collect();
    res.end(JSON.stringify(state));
  };
}
