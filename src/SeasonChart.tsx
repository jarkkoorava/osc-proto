import { seasonProgress } from "./data/statistics";
import type { Load } from "./data/manifest";
import { useId } from "react";

export const SeasonChart = ({ loads, studentsOnly = false, tandemsOnly = false }: { loads: Load[]; studentsOnly?: boolean; tandemsOnly?: boolean }) => {
  const headingId = useId();
  const season = seasonProgress(loads, undefined, studentsOnly, tandemsOnly);
  const time = (date: string) => Date.parse(`${date}T00:00:00Z`);
  const start = time(season.start);
  const duration = time(season.end) - start;
  const step = tandemsOnly ? 10 : studentsOnly ? 50 : 100;
  const max = Math.ceil(Math.max(season.goal, season.total) / step) * step;
  const x = (date: string) => 60 + (time(date) - start) / duration * 880;
  const y = (total: number) => 280 - total / max * 240;
  // Weekly samples soften daily steps; monotone cubic curves preserve cumulative growth.
  const points = [{ date: season.start, total: 0 }, ...season.points.filter((_, index) =>
    index % 7 === 6 || index === season.points.length - 1)]
    .map((point) => ({ x: x(point.date), y: y(point.total) }));
  const slopes = points.slice(1).map((point, index) =>
    point.x === points[index].x ? 0 : (point.y - points[index].y) / (point.x - points[index].x));
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0] ?? 0;
    if (index === points.length - 1) return slopes[index - 1] ?? 0;
    const before = slopes[index - 1];
    const after = slopes[index];
    return before * after <= 0 ? 0 : 2 * before * after / (before + after);
  });
  const line = points.map((point, index) => {
    if (!index) return `M${point.x},${point.y}`;
    const previous = points[index - 1];
    const third = (point.x - previous.x) / 3;
    return `C${previous.x + third},${previous.y + tangents[index - 1] * third} ${point.x - third},${point.y - tangents[index] * third} ${point.x},${point.y}`;
  }).join(" ");
  const months = ["Maalis", "Huhti", "Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka"];
  return <section className="statistics-card season-chart" aria-labelledby={headingId}>
    <div className="season-chart-heading"><h2 id={headingId}>{tandemsOnly ? "Tandemhyppymäärä ja kauden tavoite" : studentsOnly ? "Oppilashyppymäärä ja kauden tavoite" : "Kerhon hyppymäärä ja kauden tavoite"}</h2>
      <p>{season.total} / {season.goal} hyppyä · {Math.round(season.total / season.goal * 100)} %</p></div>
    <div className="season-chart-legend"><span className="actual-legend">Kertyneet hypyt</span><span className="goal-legend">Kauden tavoite</span></div>
    <svg viewBox="0 0 1000 330" role="img" aria-label={`Kauden ${season.start.slice(0, 4)} ${tandemsOnly ? "tandemhyppymäärä" : studentsOnly ? "oppilashyppymäärä" : "hyppymäärä"}: ${season.total} hyppyä. Tavoite ${season.goal} hyppyä 31.10. mennessä.`}>
      {Array.from({ length: max / step + 1 }, (_, index) => index * step).map((count) => <g key={count}>
        <path d={`M60 ${y(count)}H940`} stroke="#dfe4eb" />
        <text x="48" y={y(count) + 5} textAnchor="end">{count}</text>
      </g>)}
      {months.map((month, index) => {
        const date = `${season.start.slice(0, 4)}-${String(index + 3).padStart(2, "0")}-01`;
        return <text key={month} x={x(date)} y="310" textAnchor="middle">{month}</text>;
      })}
      <text x="940" y="310" textAnchor="middle">31.10.</text>
      <path d={`M60 ${y(0)}L940 ${y(season.goal)}`} fill="none" stroke="#8ac4ee" strokeWidth="2.5" strokeDasharray="8 6" />
      <path d={line} fill="none" stroke="#005096" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  </section>;
};
