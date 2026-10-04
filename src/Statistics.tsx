import { loadStatistics } from "./data/statistics";
import type { RankingEntry } from "./data/statistics";
import type { Load } from "./data/manifest";
import { SeasonChart } from "./SeasonChart";

const Ranking = ({ title, entries, unit }: { title: string; entries: RankingEntry[]; unit: string }) =>
  <section className="statistics-card" aria-label={title}>
    <h2>{title}</h2>
    {entries.length ? <table><thead><tr><th>#</th><th>{unit === "Hyppyjä korkeudelta" ? "Korkeus" : "Nimi"}</th><th>{unit}</th></tr></thead>
      <tbody>{entries.map((entry, index) => <tr key={entry.id}><td>{index + 1}</td><td>{entry.label}</td><td>{entry.count}</td></tr>)}</tbody>
    </table> : <p className="statistics-empty">Ei vielä tilastoitavia suorituksia.</p>}
  </section>;

export const Statistics = ({ loads }: { loads: Load[] }) => {
  const stats = loadStatistics(loads);
  return <main className="members-view statistics-view">
    <div className="members-heading"><h1>Tilastot</h1></div>
    <div className="statistics-layout">
    <div className="statistics-overview">
    <section className="statistics-card statistics-totals" aria-label="Yhteensä">
      <h2>Yhteensä</h2>
      <dl>
        <div><dt>Hyppyjä yhteensä</dt><dd>{stats.totals.jumps}</dd></div>
        <div><dt>Pokia yhteensä</dt><dd>{stats.totals.loads}</dd></div>
        {stats.totals.loadsByPlane.map(([plane, count]) => <div key={plane}>
          <dt><span className={`aircraft-registration aircraft-${plane.toLowerCase()}`}>{plane}</span></dt><dd>{count}</dd>
        </div>)}
        <div><dt>Oppilashyppyjä yhteensä</dt><dd>{stats.totals.students}</dd></div>
        <div><dt>Hyppypäiviä</dt><dd>{stats.totals.days}</dd></div>
        <div><dt>Eri hyppääjiä</dt><dd>{stats.totals.jumpers}</dd></div>
      </dl>
    </section>
    <SeasonChart loads={loads} />
    <SeasonChart loads={loads} studentsOnly />
    <SeasonChart loads={loads} tandemsOnly />
    </div>
    <div className="statistics-grid">
      <Ranking title="Top 10 – kaikki hypyt" entries={stats.all} unit="Hyppyjä" />
      <Ranking title="Top 10 – oppilaat" entries={stats.students} unit="Oppilashyppyjä" />
      <Ranking title="Top 10 – lentäjien pokat" entries={stats.pilots} unit="Pokia" />
      <Ranking title="Top 10 – oppilaiden pudotukset" entries={stats.instructors} unit="Pudotuksia" />
      <Ranking title="Top 10 – tandemhyppymestarit" entries={stats.tandems} unit="Tandemhyppyjä" />
      <Ranking title="Top 10 – hyppykorkeudet" entries={stats.altitudes} unit="Hyppyjä korkeudelta" />
    </div>
    </div>
  </main>;
};
