import { useEffect, useRef, useState } from 'react';
import { altitudes, availableJumpTypes, createJump, findSkydiver, loadWeights, MAX_JUMPERS, planes, studentAltitudes, studentExercises } from './data/manifest';
import type { Jump, Load, Member } from './data/manifest';
import { helsinkiDateTime, historyLoadErrors, historyTimestamp } from './data/historyEditing';
import { todayDate } from './data/members';
import { jumpTypeLabel } from './fi';
import { LoadSeating } from './LoadSeating';

export function HistoryLoadEditor({ load, members, emptyWeights, save, close }: { load: Load; members: Member[]; emptyWeights: Record<string, number>; save: (load: Load) => void; close: () => void }) {
  const [draft, setDraft] = useState<Load>(() => structuredClone(load));
  const [time, setTime] = useState(() => load.jumpedAt ? helsinkiDateTime(load.jumpedAt).time : '12:00');
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  const patch = (change: Partial<Load>) => setDraft(current => ({ ...current, ...change }));
  const patchJump = (index: number, change: Partial<Jump>) => patch({ jumps: draft.jumps.map((jump, i) => i === index ? { ...jump, ...change } : jump) });
  const move = (index: number, direction: number) => {
    const jumps = [...draft.jumps];
    [jumps[index], jumps[index + direction]] = [jumps[index + direction], jumps[index]];
    patch({ jumps });
  };
  const jumpers = members.filter(member => availableJumpTypes(member).length > 0);
  const available = jumpers.filter(member => !draft.jumps.some(jump => jump.skydiverId === member.id) && member.id !== draft.pilotId && member.id !== draft.groundPersonId && member.name.toLocaleLowerCase('fi').includes(search.toLocaleLowerCase('fi')));
  const balanceDraft = { ...draft, fuel: Number.isFinite(draft.fuel) ? draft.fuel : 0 };
  const weights = loadWeights(balanceDraft, emptyWeights[draft.plane]);
  return <dialog ref={dialog} className="history-load-editor" aria-labelledby="history-edit-heading" onCancel={close} onClose={close}>
    <form onSubmit={event => {
      event.preventDefault();
      const edited = { ...draft, jumpedAt: historyTimestamp(draft.date ?? '', time) };
      const issues = historyLoadErrors(edited);
      setErrors(issues);
      if (issues.length) dialog.current?.querySelector('.history-editor-body')?.scrollTo({ top: 0, behavior: 'smooth' });
      if (!issues.length) { save(edited); close(); }
    }}>
      <header className="history-editor-heading"><div><h2 id="history-edit-heading">Muokkaa pokaa {draft.number}</h2><p>Hypätyn pokan tiedot</p></div><button type="button" className="secondary-button" onClick={close}>Sulje</button></header>
      <div className="history-editor-body">
        {errors.length > 0 && <div role="alert" className="history-editor-errors"><strong>Tarkista tiedot</strong><ul>{errors.map(error => <li key={error}>{error}</li>)}</ul></div>}
        <fieldset className="history-editor-fields"><legend>Lennon tiedot</legend>
          <label>Lentopäivä<input type="date" required max={todayDate()} value={draft.date ?? ''} onChange={event => patch({ date: event.target.value })} /></label>
          <label>Hypätty klo (Suomen aika)<input type="time" required value={time} onChange={event => setTime(event.target.value)} /></label>
          <label>Pokan numero<input type="number" min="1" step="1" required value={Number.isNaN(draft.number) ? '' : draft.number} onChange={event => patch({ number: event.target.valueAsNumber })} /></label>
          <label>Lentokone<select aria-label="Lentokone" value={draft.plane} onChange={event => patch({ plane: event.target.value })}>{planes.map(plane => <option key={plane}>{plane}</option>)}</select></label>
          <label>Lentäjä<select aria-label="Lentäjä" value={draft.pilotId} onChange={event => patch({ pilotId: event.target.value })}>{members.filter(member => member.roles.includes('Pilot')).map(member => <option key={member.id} value={member.id} disabled={draft.jumps.some(jump => jump.skydiverId === member.id)}>{member.name}</option>)}</select></label>
          <label>Maahenkilö<select aria-label="Maahenkilö" value={draft.groundPersonId ?? ''} onChange={event => patch({ groundPersonId: event.target.value || undefined })}><option value="">Ei maahenkilöä</option>{members.filter(member => member.roles.includes('Licensed')).map(member => <option key={member.id} value={member.id} disabled={draft.jumps.some(jump => jump.skydiverId === member.id)}>{member.name}</option>)}</select></label>
          <label>Polttoaine (l)<input type="number" min="0" max="1000" step="0.1" required value={Number.isNaN(draft.fuel) ? '' : draft.fuel} onChange={event => patch({ fuel: event.target.valueAsNumber })} /></label>
          <label>Lentoaika (min)<input type="number" min="0" step="1" value={draft.flightTimeMinutes ?? ''} onChange={event => patch({ flightTimeMinutes: event.target.value === '' ? undefined : event.target.valueAsNumber })} /></label>
        </fieldset>
        <p className="history-editor-hint">Pokan numero on järjestysnumero valitulle päivälle. Päivän muut pokat numeroidaan automaattisesti uudelleen.</p>
        <div className="history-editor-layout"><section className="history-editor-jumpers"><div className="history-editor-section-heading"><h3>Hyppääjät ({draft.jumps.length}/{MAX_JUMPERS})</h3><label className="history-editor-check"><input type="checkbox" checked={draft.jumps.length > 0 && draft.jumps.every(jump => jump.returnedByPlane)} onChange={event => patch({ jumps: draft.jumps.map(jump => ({ ...jump, returnedByPlane: event.target.checked })) })} />Koko poka koneella alas</label></div>
          {draft.jumps.map((jump, index) => <fieldset className="history-jump-editor" key={jump.skydiverId}><legend>{index + 1}. {findSkydiver(jump.skydiverId)?.name}</legend>
            <div className="history-jump-fields">
              <label>Hyppääjä<select aria-label="Hyppääjä" value={jump.skydiverId} onChange={event => patch({ jumps: draft.jumps.map((item, i) => i === index ? createJump(event.target.value) : item).map(item => item.instructorId === jump.skydiverId ? { ...item, instructorId: '' } : item) })}>{jumpers.map(member => <option key={member.id} value={member.id} disabled={member.id !== jump.skydiverId && (draft.jumps.some(item => item.skydiverId === member.id) || member.id === draft.groundPersonId || member.id === draft.pilotId)}>{member.name}</option>)}</select></label>
              <label>Rooli<select aria-label="Rooli" value={jump.type} onChange={event => { const type = event.target.value; patchJump(index, { type, exercise: type === 'Student' ? jump.exercise : undefined, instructorId: '', altitude: ((type === 'Student' || type === 'Instructor') ? studentAltitudes : altitudes).includes(jump.altitude) ? jump.altitude : 3500 }); }}>{availableJumpTypes(findSkydiver(jump.skydiverId)).map(type => <option key={type} value={type}>{jumpTypeLabel(type)}</option>)}</select></label>
              <label>Korkeus (m)<select aria-label="Korkeus (m)" value={jump.altitude} onChange={event => patchJump(index, { altitude: Number(event.target.value) })}>{((jump.type === 'Student' || jump.type === 'Instructor') ? studentAltitudes : altitudes).map(altitude => <option key={altitude} value={altitude}>{altitude.toLocaleString('fi-FI')}</option>)}</select></label>
              {jump.type === 'Student' && <><label>Harjoitus<select aria-label="Harjoitus" value={jump.exercise ?? ''} onChange={event => { const exercise = studentExercises.find(item => item.name === event.target.value); patchJump(index, { exercise: event.target.value || undefined, ...(exercise ? { altitude: exercise.altitude } : {}) }); }}><option value="">Ei valittu</option>{studentExercises.map(exercise => <option key={exercise.name}>{exercise.name}</option>)}</select></label><label>Hyppymestari<select aria-label="Hyppymestari" value={jump.instructorId} onChange={event => patchJump(index, { instructorId: event.target.value })}><option value="">Valitse hyppymestari</option>{draft.jumps.filter(item => item.type === 'Instructor').map(item => <option key={item.skydiverId} value={item.skydiverId}>{findSkydiver(item.skydiverId)?.name}</option>)}</select></label></>}
            </div>
            <div className="history-jump-options">{([['returnedByPlane', 'Koneella alas'], ['highOpening', 'Korkea avaus'], ['wingsuit', 'Wingsuit'], ['gearRental', 'Kamavuokra']] as const).map(([key, label]) => <label className="history-editor-check" key={key}><input type="checkbox" checked={Boolean(jump[key])} onChange={event => patchJump(index, { [key]: event.target.checked })} />{label}</label>)}</div>
            <label>Hypyn lisätiedot<textarea aria-label="Hypyn lisätiedot" rows={2} value={jump.additionalInfo ?? ''} onChange={event => patchJump(index, { additionalInfo: event.target.value })} /></label>
            <div className="history-jump-actions"><button className="secondary-button" type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Siirrä ylemmäs: ${findSkydiver(jump.skydiverId)?.name}`}>↑</button><button className="secondary-button" type="button" disabled={index === draft.jumps.length - 1} onClick={() => move(index, 1)} aria-label={`Siirrä alemmas: ${findSkydiver(jump.skydiverId)?.name}`}>↓</button><button className="queue-cancel-button" type="button" onClick={() => patch({ jumps: draft.jumps.filter((_, i) => i !== index).map(item => item.instructorId === jump.skydiverId ? { ...item, instructorId: '' } : item) })}>Poista hyppääjä</button></div>
          </fieldset>)}
          {draft.jumps.length < MAX_JUMPERS && <fieldset className="history-add-jumper"><legend>Lisää hyppääjä</legend><label>Hae nimellä<input value={search} onChange={event => setSearch(event.target.value)} /></label><label>Valitse hyppääjä<select aria-label="Valitse hyppääjä" value="" onChange={event => { if (event.target.value) { patch({ jumps: [...draft.jumps, createJump(event.target.value)] }); setSearch(''); } }}><option value="">{available.length ? 'Valitse lisättävä hyppääjä' : 'Ei hakutuloksia'}</option>{available.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label></fieldset>}
        </section><div className="history-editor-balance"><LoadSeating load={balanceDraft} emptyWeight={emptyWeights[draft.plane]} update={patch} /><p>Kokonaismassa <strong>{weights.total.toLocaleString('fi-FI', { maximumFractionDigits: 1 })} kg</strong></p>{weights.remaining < 0 && <p className="history-editor-errors">Ylipainoa {(-weights.remaining).toLocaleString('fi-FI', { maximumFractionDigits: 1 })} kg</p>}</div></div>
        <label className="history-load-notes">Pokan lisätiedot<textarea aria-label="Pokan lisätiedot" rows={3} value={draft.additionalInfo ?? ''} onChange={event => patch({ additionalInfo: event.target.value })} /></label>
      </div>
      <footer className="history-editor-footer"><p>Tallennus päivittää myös tilastot ja hyppyveloitusten korjaukset.</p><button type="button" className="queue-cancel-button" onClick={close}>Peruuta</button><button type="submit" className="primary-button">Tallenna muutokset</button></footer>
    </form>
  </dialog>;
}
