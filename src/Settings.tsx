import {
  AIRCRAFT_EMPTY_ARMS,
  FUEL_ARM,
  PILOT_ARM,
  JUMPER_ARMS,
  FUEL_DENSITY,
  MTOM,
  planes,
  altitudes,
} from "./data/manifest";
import { formatNumber } from "./fi";

type SettingsProps = {
  emptyWeights: Record<string, number>;
  updateWeight: (plane: string, weight: number) => void;
  licensePrices: Record<number, number>;
  updatePrice: (altitude: number, price: number) => void;
};

export const Settings = ({ emptyWeights, updateWeight, licensePrices, updatePrice }: SettingsProps) => {
  return (
    <main className="settings-view">
      <h1>Asetukset</h1>
      <section className="settings-card" aria-labelledby="license-prices-heading">
        <h2 id="license-prices-heading">Lisenssihyppääjien hyppyhinnat</h2>
        <p className="settings-description">Hyppyhinta korkeuden mukaan. Muutokset tallentuvat automaattisesti.</p>
        <div className="assumption-fields">
          {altitudes.map((altitude) => <label key={altitude}>
            {altitude.toLocaleString("fi-FI")} m (€)
            <input type="number" min="0" step="0.01" value={licensePrices[altitude]}
              onChange={(event) => {
                if (event.target.value === "" || !event.target.validity.valid) return;
                const price = event.target.valueAsNumber;
                if (Number.isFinite(price)) updatePrice(altitude, Math.round(price * 100) / 100);
              }} />
          </label>)}
        </div>
      </section>
      <section
        className="settings-card"
        aria-labelledby="aircraft-settings-heading"
      >
        <h2 id="aircraft-settings-heading">Ilma-aluksen painotiedot</h2>
        <p className="settings-description">
          Syötä kunkin ilma-aluksen perusmassa punnitustodistuksesta.
        </p>
        <div className="assumption-fields">
          {planes.map((plane) => (
            <label key={plane}>
              {plane} perusmassa (kg)
              <input
                type="number"
                min="1"
                max={MTOM}
                value={emptyWeights[plane]}
                onChange={(event) =>
                  updateWeight(
                    plane,
                    Math.min(MTOM, Math.max(1, Number(event.target.value))),
                  )
                }
              />
            </label>
          ))}
        </div>
        <dl className="settings-facts">
          <div>
            <dt>MTOM</dt>
            <dd>{MTOM} kg</dd>
          </div>
          <div>
            <dt>100LL:n vakiotankkaus</dt>
            <dd>90 L · {formatNumber(90 * FUEL_DENSITY, 1)} kg</dd>
          </div>
          <div>
            <dt>100LL:n tiheys</dt>
            <dd>{formatNumber(FUEL_DENSITY, 2)} kg/L</dd>
          </div>
        </dl>
        <h2>Painopisteen lähtötiedot</h2>
        <dl className="settings-facts">
          {planes.map((plane) => (
            <div key={plane}>
              <dt>{plane} tyhjän koneen painopiste</dt>
              <dd>{formatNumber(AIRCRAFT_EMPTY_ARMS[plane], 2)} tuumaa</dd>
            </div>
          ))}
          <div>
            <dt>Polttoaineen momenttivarsi</dt>
            <dd>{formatNumber(FUEL_ARM, 1)} tuumaa</dd>
          </div>
          <div>
            <dt>Lentäjän momenttivarsi</dt>
            <dd>{PILOT_ARM} tuumaa</dd>
          </div>
          <div>
            <dt>Hyppääjien momenttivarret, paikat 1–5</dt>
            <dd>{JUMPER_ARMS.join(" / ")} tuumaa</dd>
          </div>
        </dl>
        <p className="settings-description">
          Hyppääjille käytettävissä oleva massa on suurin lentoonlähtömassa
          vähennettynä ilma-aluksen, lentäjän ja polttoaineen massalla.
          Painopiste perustuu annettuihin ilma-alustietoihin ja tiiviiseen
          istumajärjestykseen. Laskenta käyttää tuumia ja paunoja; kuvaaja
          näyttää kilogrammat. Prototyypin lähtötietojen tulee vastata
          ilma-aluksen hyväksyttyjä asiakirjoja ennen operatiivista käyttöä.
        </p>
        <a
          className="settings-source"
          href="https://www.epc.shell.com/DocumentManagement/BlobDocumentDownload?DocId=110457400"
          target="_blank"
          rel="noreferrer"
        >
          Shell 100LL:n tiheystiedot ↗
        </a>
      </section>
    </main>
  );
};
