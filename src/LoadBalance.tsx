import { CG_ENVELOPE, KG_PER_LB, loadBalance } from "./data/manifest";
import type { Load } from "./data/manifest";
import { formatNumber } from "./fi";

type LoadBalanceProps = {
  load: Load;
  emptyWeight: number;
};

export const LoadBalance = ({ load, emptyWeight }: LoadBalanceProps) => {
  const balance = loadBalance(load, emptyWeight);
  const minX = Math.min(30, balance.arm - 1);
  const maxX = Math.max(51, balance.arm + 1);
  const minY = Math.min(750, balance.total - 50);
  const maxY = Math.max(1450, balance.total + 50);
  const x = (arm: number) => 55 + ((arm - minX) / (maxX - minX)) * 340;
  const y = (kg: number) => 230 - ((kg - minY) / (maxY - minY)) * 205;
  const summary = `${formatNumber(balance.arm, 2)} tuumaa · ${formatNumber(balance.total, 1)} kg · ${balance.withinLimits ? "Raja-arvojen sisällä" : "Raja-arvojen ulkopuolella"}`;
  return (
    <section className="load-balance" aria-label="Painopiste">
      <h3>
        Painopiste <strong>{formatNumber(balance.arm, 2)} tuumaa</strong>
        <span className={balance.withinLimits ? "cg-good" : "overweight-text"}>
          {balance.withinLimits
            ? "Raja-arvojen sisällä"
            : "Raja-arvojen ulkopuolella"}
        </span>
      </h3>
      <div className="balance-content">
        <svg
          viewBox="0 0 430 280"
          role="img"
          aria-label={`Painopiste: ${summary}`}
        >
          {[800, 1000, 1200, 1400].map((kg) => (
            <g key={kg}>
              <path d={`M55 ${y(kg)} H395`} stroke="#DFE4EB" />
              <text x="48" y={y(kg) + 4} textAnchor="end">
                {kg}
              </text>
            </g>
          ))}
          {[33, 37, 41, 45, 49].map((arm) => (
            <g key={arm}>
              <path d={`M${x(arm)} 25 V230`} stroke="#DFE4EB" />
              <text x={x(arm)} y="248" textAnchor="middle">
                {arm}
              </text>
            </g>
          ))}
          <polygon
            points={CG_ENVELOPE.map(
              ([arm, lb]) => `${x(arm)},${y(lb * KG_PER_LB)}`,
            ).join(" ")}
            fill="#EAF1F9"
            stroke="#005096"
            strokeWidth="2"
          />
          <circle
            cx={x(balance.arm)}
            cy={y(balance.total)}
            r="6"
            fill={balance.withinLimits ? "#267568" : "#B33F4A"}
            stroke="white"
            strokeWidth="2"
          >
            <title>{summary}</title>
          </circle>
          <text x="225" y="273" textAnchor="middle">
            Painopiste (tuumaa perustasosta)
          </text>
          <text x="55" y="15">
            Massa (kg)
          </text>
        </svg>
      </div>
    </section>
  );
};
