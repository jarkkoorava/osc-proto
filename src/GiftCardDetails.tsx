import { useEffect, useRef, useState } from 'react';

const labels: Record<string, string> = {
  gift_card: 'Lahjakortti', activity: 'Tapahtumat', number: 'Kortin numero', balance: 'Saldo (€)',
  active: 'Aktiivinen', create_date: 'Luotu', expiration_date: 'Voimassa asti',
  recipient_email: 'Saajan sähköposti', recipient_name: 'Saajan nimi', from: 'Lähettäjä',
  message: 'Viesti', delivery_date: 'Toimituspäivä', product_id: 'Tuotteen ID', variation_id: 'Variaation ID',
  order_item_id: 'Tilausrivin ID', email_design_id: 'Sähköpostipohjan ID',
  pimwick_gift_card_id: 'Lahjakortin ID', pimwick_gift_card_parent: 'Alkuperäinen lahjakortti',
  pimwick_gift_card_activity_id: 'Tapahtuman ID', activity_date: 'Aika', action: 'Toiminto',
  user: 'Käyttäjä', user_email: 'Käyttäjän sähköposti', amount: 'Summa (€)', note: 'Huomautus', last_activity: 'Viimeisin tapahtuma',
};
function Fields({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === '') return <>—</>;
  if (Array.isArray(value)) return value.length ? <div className="gift-detail-items">{value.map((item, index) => <section key={index}><Fields value={item} /></section>)}</div> : <>Ei tietoja.</>;
  if (typeof value === 'object') return <dl className="gift-detail-fields">{Object.entries(value).map(([key, item]) => <div key={key}><dt>{labels[key] ?? key}</dt><dd><Fields value={item} /></dd></div>)}</dl>;
  return <>{String(value)}</>;
}
export function GiftCardDetails({ number, close }: { number: string; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [data, setData] = useState<Record<string, unknown>>();
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => { dialog.current?.showModal(); }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/gift-cards/detail?number=${encodeURIComponent(number)}`, { signal: controller.signal, cache: 'no-store' })
      .then(async response => { const result = await response.json(); if (!response.ok) throw new Error(result.error ?? 'Tietojen haku epäonnistui.'); return result; })
      .then(setData).catch((reason: Error) => { if (!controller.signal.aborted) setError(reason.message); });
    return () => controller.abort();
  }, [number, attempt]);
  return <dialog ref={dialog} className="gift-detail-dialog" aria-labelledby="gift-detail-title" onCancel={close} onClose={close}>
    <div className="gift-detail-heading"><h2 id="gift-detail-title">Lahjakortti {number}</h2><button className="primary-button gift-card-button" type="button" onClick={close}>Sulje</button></div>
    {!data && !error && <p role="status">Haetaan lahjakortin tietoja…</p>}
    {error && <div role="alert"><p>{error}</p><button className="primary-button gift-card-button" onClick={() => { setError(''); setAttempt(value => value + 1); }}>Yritä uudelleen</button></div>}
    {data && Object.entries(data).map(([key, value]) => <section key={key}><h3>{labels[key] ?? key}</h3><Fields value={value} /></section>)}
  </dialog>;
}
