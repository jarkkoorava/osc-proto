import { useState } from 'react';
import { altitudes, availableJumpTypes, createJump, studentExercises } from './data/manifest';
import type { Jump, Load, Member } from './data/manifest';
import { jumpTypeLabel, stateLabels } from './fi';

const details = (jump: Jump) => jump.type === 'Student' ? jump.exercise || 'Harjoitus valitsematta' : jump.altitude === 0 ? 'Korkeus valitsematta' : `${jump.altitude.toLocaleString('fi-FI')} m`;

export function AccountQueue({ member, queue, queueJump, load, join }: { member: Member; queue: Jump[]; queueJump?: Jump; load?: Load; join: (jump: Jump) => void }) {
  const [draft, setDraft] = useState(() => createJump(member.id));
  const types = availableJumpTypes(member);
  const assigned = load?.jumps.find(jump => jump.skydiverId === member.id);
  const students = queue.filter(jump => jump.type === 'Student' || jump.type === 'Tandem student').length;
  return <section className="account-queue" aria-label="Hyppääjäjono">
    <h2>Hyppääjäjono <span className="account-queue-counts">- tällä hetkellä jonossa {queue.length - students} lisenssihyppääjää ja {students} oppilasta</span></h2>
    {queueJump ? <div className="account-queue-status" role="status"><strong>Olet jonossa</strong><span>{details(queueJump)}</span></div>
      : assigned && load ? <div className="account-queue-status" role="status"><strong>Olet pokassa {load.number}</strong><span>{details(assigned)} · {stateLabels[load.flightState ?? 'Planning']}</span></div>
      : !types.length ? <p>Jonoon liittyminen on käytettävissä hyppääjille.</p>
      : <form onSubmit={event => {
        event.preventDefault();
        if (!types.includes(draft.type) || (draft.type === 'Student' && !studentExercises.some(exercise => exercise.name === draft.exercise))) return;
        join(draft);
      }}>
        <div className="account-queue-fields">
          {types.length > 1 && <label><select aria-label="Jonon hyppääjätyyppi" value={draft.type} onChange={event => setDraft({ ...createJump(member.id), type: event.target.value, exercise: undefined })}>{types.map(type => <option key={type} value={type}>{jumpTypeLabel(type)}</option>)}</select></label>}
          {draft.type === 'Student' ? <label>Harjoitus<select required aria-label="Jonon harjoitus" value={draft.exercise ?? ''} onChange={event => {
            const exercise = studentExercises.find(exercise => exercise.name === event.target.value);
            setDraft({ ...draft, exercise: event.target.value || undefined, ...(exercise ? { altitude: exercise.altitude, highOpening: exercise.name === 'Kuvunkäsittely' } : {}) });
          }}><option value="">Valitse harjoitus</option>{studentExercises.map(exercise => <option key={exercise.name} value={exercise.name}>{exercise.name}</option>)}</select></label>
            : <label><select aria-label="Jonon hyppykorkeus" value={draft.altitude} onChange={event => setDraft({ ...draft, altitude: Number(event.target.value) })}>{draft.type === 'Instructor' && <option value={0}>Ei valittu</option>}{altitudes.map(altitude => <option key={altitude} value={altitude}>{altitude.toLocaleString('fi-FI')} m</option>)}</select></label>}
          <button type="submit" className="primary-button" disabled={draft.type === 'Student' && !draft.exercise}>Liity jonoon</button>
        </div>
      </form>}
  </section>;
}
