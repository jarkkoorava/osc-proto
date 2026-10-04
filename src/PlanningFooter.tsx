import { todayDate } from "./data/members";
import { loadFlightState } from "./data/manifest";
import type { Load } from "./data/manifest";

const planningTotals = (loads: Load[], date = todayDate()) => {
  const today = loads.filter((load) => (load.date ?? date) === date);
  const jumped = today.filter((load) => loadFlightState(load) === "Dropped");
  const byPlane = new Map<string, number>();
  let total = 0;
  let students = 0;
  let tandems = 0;
  for (const load of jumped) {
    byPlane.set(load.plane, (byPlane.get(load.plane) ?? 0) + 1);
    const jumps = load.jumps.filter((jump) => !jump.returnedByPlane);
    const instructors = jumps.filter((jump) => jump.type === "Tandem instructor").length;
    const passengers = jumps.filter((jump) => jump.type === "Tandem student").length;
    // This footer alone counts a tandem pair as one jump; other jump accounting is unchanged.
    const tandemCount = Math.max(instructors, passengers);
    tandems += tandemCount;
    students += jumps.filter((jump) => jump.type === "Student").length;
    total += jumps.length - instructors - passengers + tandemCount;
  }
  return { planned: today.length - jumped.length, jumped: jumped.length, byPlane, total, students, tandems };
};

export const PlanningFooter = ({ loads }: { loads: Load[] }) => {
  const totals = planningTotals(loads);
  return <footer className="planning-footer" aria-label="Päivän yhteenveto">
    <section><h2>Pokat tänään</h2><dl>
      <div><dt>Suunnitellut</dt><dd>{totals.planned}</dd></div>
      <div><dt>Hypätyt</dt><dd>{totals.jumped}</dd></div>
    </dl></section>
    {totals.byPlane.size > 0 && <section><h2>Hypätyt pokat koneittain</h2><dl>
      {[...totals.byPlane].map(([plane, count]) => <div key={plane}>
        <dt><span className={`aircraft-registration aircraft-${plane.toLowerCase()}`}>{plane}</span></dt><dd>{count}</dd>
      </div>)}
    </dl></section>}
    <section><h2>Hypyt tänään</h2><dl>
      <div><dt>Yhteensä</dt><dd>{totals.total}</dd></div>
      <div><dt>Oppilaat</dt><dd>{totals.students}</dd></div>
      <div><dt>Tandemit</dt><dd>{totals.tandems}</dd></div>
    </dl></section>
  </footer>;
};
