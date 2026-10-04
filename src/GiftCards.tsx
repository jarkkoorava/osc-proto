import { GiftCardDetails } from './GiftCardDetails';
import { useEffect, useState } from 'react';
import { giftCardYears } from './data/giftCards';
import type { GiftCardStatus } from './data/giftCards';

const euros = (cents: number) => new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(cents / 100);
const date = (value: string | null) => value ? value.split('-').reverse().join('.') : '—';

export function GiftCards() {
  const [state, setState] = useState<GiftCardStatus>({ status: 'loading' });
  const [revision, setRevision] = useState(0);
  const [type, setType] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    async function poll(refresh = false) {
      try {
        const response = await fetch(`/api/gift-cards${refresh ? '?refresh=1' : ''}`, { cache: 'no-store' });
        if (!response.ok) throw new Error();
        const result = await response.json() as GiftCardStatus;
        if (cancelled) return;
        setState(result);
        if (result.status === 'loading') timer = setTimeout(() => void poll(), 1500);
      } catch { if (!cancelled) setState({ status: 'error', error: 'Lahjakortteja ei voitu hakea palvelimelta.' }); }
    }
    void poll(revision > 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [revision]);
  const report = state.report;
  const [today] = useState(() => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Helsinki' }).format(new Date()));
  const years = report ? giftCardYears(report, today, type) : [];
  const current = years.find(row => row.year === Number(today.slice(0, 4)));
  const cards = report?.cards.filter(card => (type === 'all' || card.productId === type) && card.number.toLowerCase().includes(query.toLowerCase())) ?? [];
  const types = [...new Map(report?.cards.map(card => [card.productId, card.type]) ?? [])];
  return <main className="members-view gift-cards-view">
    <div className="members-heading"><h1>Lahjakortit</h1><button className="primary-button" disabled={state.status === 'loading'} onClick={() => setRevision(value => value + 1)}>Päivitä tiedot</button></div>
    {state.status === 'loading' && <p role="status">{state.progress ?? 'Haetaan tietoja…'} Ensimmäinen haku voi kestää muutaman minuutin.</p>}
    {state.status === 'error' && <p role="alert">{state.error}</p>}
    {report && <>
      <div className="gift-card-filters"><label>Tyyppi<select value={type} onChange={event => { setType(event.target.value); setPage(0); }}><option value="all">Kaikki lahjakortit</option>{types.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label><label>Hae kortin numerolla<input value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} /></label></div>
      <section className="statistics-card statistics-totals"><h2>Vuosi {today.slice(0, 4)}</h2><dl>
        <div><dt>Lahjakorttimyynti</dt><dd>{euros(current?.revenueCents ?? 0)}</dd></div>
        <div><dt>Ostettuja kortteja</dt><dd>{current?.bought ?? 0}</dd></div>
        <div><dt>Käytettyjä kortteja</dt><dd>{current?.used ?? 0}</dd></div>
        <div><dt>Vanhentuneita kortteja</dt><dd>{current?.expired ?? 0}</dd></div>
        <div><dt>Vanhentunut käyttämätön saldo</dt><dd>{euros(current?.expiredUnusedCents ?? 0)}{current?.unknownExpiryBalances ? ' + puuttuvia tietoja' : ''}</dd></div>
      </dl></section>
      <section className="statistics-card"><h2>Vuositilastot</h2><div className="gift-card-table"><table><thead><tr><th>Vuosi</th><th>Myynti</th><th>Ostettuja</th><th>Käytettyjä</th><th>Vanhentuneita</th><th>Vanhentunut käyttämätön saldo</th></tr></thead><tbody>{years.map(row => <tr key={row.year}><td>{row.year}</td><td>{euros(row.revenueCents)}</td><td>{row.bought}</td><td>{row.used}</td><td>{row.expired}</td><td>{euros(row.expiredUnusedCents)}{row.unknownExpiryBalances > 0 && <small> + {row.unknownExpiryBalances} kortin saldo tuntematon</small>}</td></tr>)}</tbody></table></div></section>
      <section className="statistics-card"><h2>Lahjakortit ({cards.length})</h2><div className="gift-card-table"><table><thead><tr><th>Numero</th><th>Tyyppi</th><th>Luotu</th><th>Voimassa asti</th><th>Saldo</th><th>Tila</th><th>Tiedot</th></tr></thead><tbody>{cards.slice(page * 50, page * 50 + 50).map(card => <tr key={card.id}><td className="gift-card-number">{card.number}</td><td>{card.type}</td><td>{date(card.created)}</td><td>{date(card.expires)}</td><td>{euros(card.balanceCents)}</td><td>{card.expires && card.expires < today ? 'Vanhentunut' : !card.active ? 'Ei aktiivinen' : card.balanceCents <= 0 ? 'Käytetty' : 'Voimassa'}</td><td><button className="primary-button gift-card-button" type="button" onClick={() => setSelectedNumber(card.number)}>Näytä tiedot</button></td></tr>)}</tbody></table></div>{cards.length === 0 && <p>Ei hakua vastaavia lahjakortteja.</p>}<div className="gift-card-pagination"><button className="primary-button gift-card-button" disabled={page === 0} onClick={() => setPage(value => value - 1)}>Edellinen</button><span>Sivu {page + 1} / {Math.max(1, Math.ceil(cards.length / 50))}</span><button className="primary-button gift-card-button" disabled={(page + 1) * 50 >= cards.length} onClick={() => setPage(value => value + 1)}>Seuraava</button></div></section>
      <details className="statistics-card gift-card-notes"><summary>Tilastojen laskentaperusteet ja tietojen puutteet</summary>{report.warnings.map(warning => <p key={warning}>{warning}</p>)}<p>Käytetty kortti lasketaan kerran käyttövuotta kohti. Vanhentuneiden määrä sisältää myös loppuun käytetyt kortit. Tiedot haettu {new Date(report.fetchedAt).toLocaleString('fi-FI')}.</p></details>
    </>}
    {selectedNumber && <GiftCardDetails key={selectedNumber} number={selectedNumber} close={() => setSelectedNumber(null)} />}
  </main>;
}
