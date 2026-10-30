import { useLayoutEffect, useRef } from "react";
import { roleLabels, stateLabels, dragAccessibility } from "./fi";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  findSkydiver,
  jumpRole,
  hasInstructor,
  groundPersonError,
  loadWeights,
  roles,
  roleClass,
  tandemWarnings,
  flightStates,
  loadFlightState,
} from "./data/manifest";
import type { Jump, Load, Skydiver } from "./data/manifest";

const altitude = (metres: number) => `${metres.toLocaleString("en-FI")} m`;
type FlightStateControlsProps = {
  load: Load;
  changeState: (id: string, direction: number) => void;
};

const FlightStateControls = ({
  load,
  changeState,
}: FlightStateControlsProps) => {
  const state = loadFlightState(load);
  const index = flightStates.indexOf(state);
  return (
    <div className={`flight-state-controls state-${roleClass(state)}`}>
      <button
        type="button"
        disabled={index === 0}
        onClick={() => changeState(load.id, -1)}
        aria-label={`Pokan edellinen tila ${load.number}`}
        title={stateLabels[flightStates[index - 1]]}
      >
        ‹
      </button>
      <span className="flight-state-label">{stateLabels[state]}</span>
      <button
        type="button"
        disabled={index === flightStates.length - 1}
        onClick={() => changeState(load.id, 1)}
        aria-label={`Pokan seuraava tila ${load.number}`}
        title={stateLabels[flightStates[index + 1]]}
      >
        ›
      </button>
    </div>
  );
};
const needsAttention = (load: Load, emptyWeight: number) => {
  return (
    loadWeights(load, emptyWeight).remaining < 0 ||
    Boolean(groundPersonError(load)) ||
    tandemWarnings(load.jumps).length > 0 ||
    load.jumps.some(
      (jump) =>
        jumpRole(jump) === "Student" && !hasInstructor(jump, load.jumps),
    )
  );
};

type QueuedLoadProps = {
  load: Load;
  emptyWeight: number;
  edit: () => void;
  editing: boolean;
  changeState: (id: string, direction: number) => void;
};

const QueuedLoad = ({
  load,
  emptyWeight,
  edit,
  editing,
  changeState,
}: QueuedLoadProps) => {
  const jumped = loadFlightState(load) === "Dropped";
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: load.id, disabled: jumped });
  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`queued-load ${isDragging ? "dragging" : ""}`}
      data-load-id={load.id}
      aria-label={`${jumped ? "Hypätty poka" : "Jonossa oleva poka"} ${load.number}`}
    >
      <div className="queued-load-header">
        <button
          className="drag-handle"
          disabled={jumped}
          aria-label={`Järjestä jonossa oleva poka ${load.number}`}
          {...attributes}
          {...listeners}
        >
          <span aria-hidden="true" className="grip">
            ⠿
          </span>
        </button>
        <span className="queue-position">
          {String(load.number).padStart(2, "0")}
        </span>
        <h3>
          <span className={`aircraft-registration aircraft-${load.plane.toLowerCase()}`}>{load.plane}</span>
        </h3>
        <span className="queue-ground-person">{load.groundPersonId ? `Maahenkilö: ${findSkydiver(load.groundPersonId)?.name ?? "—"}` : "Ei maahenkilöä"}</span>
        {needsAttention(load, emptyWeight) && (
          <span className="status status-warning">Tarkistettava</span>
        )}
        <div className="queued-actions">
          <FlightStateControls load={load} changeState={changeState} />
          <button
            className="secondary-button"
            onClick={edit}
            disabled={editing}
            title={
              editing ? "Tallenna tai poista nykyinen poka ensin" : undefined
            }
            aria-label={`Muokkaa jonossa olevaa pokaa ${load.number}`}
          >
            Muokkaa pokaa
          </button>
        </div>
      </div>
      <ul className="queued-jumpers">
        {load.jumps.map((jump) => {
          const person = findSkydiver(jump.skydiverId);
          return (
            <li
              key={person.id}
              className={`jumper-chip role-${roleClass(jumpRole(jump!))}`}
            >
              <span>{person.name}</span>
              <strong>{altitude(jump.altitude)}</strong>
              {jump.returnedByPlane && <span className="returned-by-plane">Koneella alas</span>}
            </li>
          );
        })}
      </ul>
    </article>
  );
};

type LoadQueueProps = {
  loads: Load[];
  emptyWeights: Record<string, number>;
  edit: (id: string) => void;
  editing: boolean;
  changeState: (id: string, direction: number) => void;
  reorder: (activeId: string, overId: string) => void;
};

export const LoadQueue = (props: LoadQueueProps) => {
  const container = useRef<HTMLDivElement>(null);
  const previous = useRef(new Map<string, { x: number; y: number }>());
  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const origin = root.getBoundingClientRect();
    const next = new Map<string, { x: number; y: number }>();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const card of root.querySelectorAll<HTMLElement>("[data-load-id]")) {
      // Cancel an earlier layout animation before measuring its destination.
      card.getAnimations().forEach((animation) => animation.cancel());
      const rect = card.getBoundingClientRect();
      const position = { x: rect.left - origin.left, y: rect.top - origin.top };
      const id = card.dataset.loadId!;
      next.set(id, position);
      const before = previous.current.get(id);
      if (!reducedMotion && before && !card.classList.contains("dragging")) {
        const dx = before.x - position.x;
        const dy = before.y - position.y;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          card.animate([
            { translate: `${dx}px ${dy}px`, zIndex: 2 },
            { translate: "0px 0px", zIndex: 2 },
          ], { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
        }
      }
    }
    previous.current = next;
  }, [props.loads]);
  const active = props.loads.filter((load) => loadFlightState(load) !== "Dropped");
  const jumped = props.loads.filter((load) => loadFlightState(load) === "Dropped");
  return <div ref={container} className="load-queue-sections">
    <LoadQueueGroup {...props} loads={active} />
    {jumped.length > 0 && <LoadQueueGroup {...props} loads={jumped} completed />}
  </div>;
};

const LoadQueueGroup = ({
  loads,
  emptyWeights,
  edit,
  editing,
  changeState,
  reorder,
  completed = false,
}: LoadQueueProps & { completed?: boolean }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  return (
    <section className="planning-load-queue" aria-label={completed ? "Hypätyt pokat" : "Pokajono"}>
      <div className="section-heading">
        <div>
          <h2>
            {completed ? "Hypätyt pokat" : "Pokajono"} <span className="count-badge">{loads.length}</span>
          </h2>
        </div>
      </div>
      {loads.length === 0 ? (
        <p className="queue-placeholder">
          Pokajono on tyhjä. Lisää hyppääjiä pokaan ja valitse ”Tallenna poka”.
        </p>
      ) : (
        <>
          <DndContext
            accessibility={dragAccessibility}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (over) reorder(String(active.id), String(over.id));
            }}
          >
            <SortableContext
              items={loads.map((load) => load.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="queued-loads">
                {loads.map((load) => (
                  <QueuedLoad
                    key={load.id}
                    load={load}
                    emptyWeight={emptyWeights[load.plane]}
                    edit={() => edit(load.id)}
                    editing={editing}
                    changeState={changeState}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </section>
  );
};

type QueueViewProps = {
  loads: Load[];
  queue: { person: Skydiver; jump: Jump }[];
  emptyWeights: Record<string, number>;
  storageError: boolean;
};

export const QueueView = ({
  loads,
  queue,
  emptyWeights,
  storageError,
}: QueueViewProps) => {
  return (
    <main className="tv-view">
      <div className="tv-content">
        <aside className="tv-queue-sidebar" aria-label="Hyppääjäjono">
          <h2>Hyppääjäjono <span className="count-badge">{queue.length}</span></h2>
          {[
            { label: 'Lisenssihyppääjät', student: false },
            { label: 'Oppilaat', student: true },
          ].map(group => {
            const people = queue.filter(({ jump }) => ['Student', 'Tandem student'].includes(jump.type) === group.student);
            return <section key={group.label} className={`tv-queue-group ${group.student ? 'tv-queue-students' : 'tv-queue-licensed'}`} aria-label={group.label}>
              <h3>{group.label}<span>{people.length}</span></h3>
              <ul>{people.map(({ person, jump }) => <li key={person.id}>
                <span className="tv-queue-name">{person.name}{person.roles.includes('Instructor') && <span className="queue-role-tag instructor tv-queue-instructor" title="Hyppymestari">HM</span>}</span>
                <span className="tv-queue-selection">{jump.type === 'Student'
                  ? jump.exercise ?? ''
                  : jump.type === 'License' && jump.altitude > 0 ? altitude(jump.altitude) : ''}</span>
              </li>)}</ul>
              {people.length === 0 && <p className="tv-queue-empty">Ei jonossa</p>}
            </section>;
          })}
        </aside>
        <div className="tv-loads-area">
      <header className="tv-header">
        <div>
          <h1>Pokajono</h1>
        </div>
        <div className="tv-tools">
          <span>
            {loads.length} {loads.length === 1 ? "poka" : "pokaa"} jonossa
          </span>
          <a href="#planning" className="primary-button queue-view-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="4" width="16" height="17" rx="2" />
              <path d="M8 2v4M16 2v4M8 10h8M8 14h8M8 18h4" />
            </svg>
            Pokasuunnittelu
          </a>
        </div>
      </header>
      <div className="tv-legend">
        {roles.map((role) => (
          <span key={role} className={`role-${roleClass(role)}`}>
            <i />
            {roleLabels[role]}
          </span>
        ))}
        {storageError && <span className="tv-sync">Paikallinen synkronointi ei ole käytettävissä</span>}
      </div>

      {loads.length === 0 ? (
        <div className="tv-empty">
          <h2>Odotetaan seuraavaa pokaa</h2>
          <p>Pokat näkyvät tässä, kun ne tallennetaan pokasuunnittelussa.</p>
        </div>
      ) : (
        <div className="tv-grid">
          {loads.map((load, index) => (
            <section
              key={load.id}
              className={`tv-load ${index === 0 ? "tv-next" : ""}`}
              aria-label={`Jonopaikka ${index + 1}, poka ${load.number}`}
            >
              <div className="tv-load-heading">
                <span className="tv-position">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2><span className={`aircraft-registration aircraft-${load.plane.toLowerCase()}`}>{load.plane}</span></h2>
                </div>
                <span
                  className={`flight-state-controls state-${roleClass(loadFlightState(load))}`}
                >
                  <span className="flight-state-label">
                    {stateLabels[loadFlightState(load)]}
                  </span>
                </span>
                {needsAttention(load, emptyWeights[load.plane]) && (
                  <span
                    className="tv-warning"
                    title="Tarkista paino ja hyppymestarin määritys pokasuunnittelussa"
                  >
                    Tarkista poka
                  </span>
                )}
              </div>
              <ul className="tv-jumpers">
                {load.jumps.map((jump) => {
                  const person = findSkydiver(jump.skydiverId);
                  return (
                    <li
                      key={person.id}
                      className={`role-${roleClass(jumpRole(jump!))}`}
                    >
                      <span className="tv-person">
                        <strong>{person.name}</strong>
                      </span>
                      <span className="tv-altitude">
                        {altitude(jump.altitude)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
        </div>
      </div>
    </main>
  );
};
