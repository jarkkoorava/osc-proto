import { useRef } from "react";
import type { Jump } from "./data/manifest";

type JumpDetailsProps = {
  jump: Jump;
  name: string;
  update: (patch: Partial<Jump>) => void;
};

export const JumpDetails = ({ jump, name, update }: JumpDetailsProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const hasInfo =
    jump.highOpening ||
    jump.wingsuit ||
    jump.gearRental ||
    Boolean(jump.additionalInfo?.trim());
  return (
    <>
      <button
        type="button"
        className={`jump-more-button ${hasInfo ? "has-info" : ""}`}
        aria-label={`Lisää: ${name}`}
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        Lisää
      </button>
      <dialog
        ref={dialog}
        className="jump-details-dialog"
        aria-label={`Hypyn lisätiedot: ${name}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="jump-details-content">
          <h2>{name}</h2>
          {(
            [
              ["highOpening", "Korkea avaus"],
              ["wingsuit", "Wingsuit"],
              ["gearRental", "Kamavuokra"],
            ] as const
          ).map(([key, label]) => (
            <label className="jump-option" key={key}>
              <input
                type="checkbox"
                checked={Boolean(jump[key])}
                onChange={(event) => update({ [key]: event.target.checked })}
              />
              {label}
            </label>
          ))}
          <label className="additional-info-field">
            Lisätiedot
            <textarea
              value={jump.additionalInfo ?? ""}
              onChange={(event) =>
                update({ additionalInfo: event.target.value })
              }
              rows={3}
            />
          </label>
          <button
            type="button"
            className="primary-button"
            onClick={() => dialog.current?.close()}
          >
            Valmis
          </button>
        </div>
      </dialog>
    </>
  );
};
