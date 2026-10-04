import { replaceHistoryLoad } from "./data/historyEditing";
import { useEffect, useState } from "react";
import type { SetStateAction } from "react";
import { useLocalManifest } from "./useLocalManifest";
import { useQueueTimes } from "./useQueueTimes";
import { LoadQueue, QueueView } from "./LoadQueue";
import { Settings } from "./Settings";
import { Members } from "./Members";
import { useMembers } from "./useMembers";
import { useWaivers } from "./useWaivers";
import { FillWaiver, WaiverReview } from "./Waivers";
import { emptyMemberDetails } from "./data/waiver";
import { roleLabels, roleTags, jumpTypeLabel, dragAccessibility } from "./fi";
import { JumpDetails } from "./JumpDetails";
import { LoadSeating } from "./LoadSeating";
import { PlanningFooter } from "./PlanningFooter";
import { LoadHistory } from "./LoadHistory";
import { GiftCards } from "./GiftCards";
import { Statistics } from "./Statistics";
import { PilotView } from "./PilotView";
import { AccountView } from "./AccountView";
import { CalendarView } from "./CalendarView";
import { todayDate } from "./data/members";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  CollisionDetection,
  DragEndEvent,
  KeyboardCoordinateGetter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MAX_JUMPERS,
  MTOM,
  altitudes,
  createLoad,
  createJump,
  findSkydiver,
  hasInstructor,
  groundPersonError,
  jumpPrice,
  availableJumpTypes,
  jumpRole,
  primaryRole,
  seatingPositions,
  roleClass,
  tandemWarnings,
  loadFlightState,
  changeFlightState,
  studentExercises,
  studentAltitudes,
  loadWeights,
  moveSkydiver,
  reorderQueuedLoads,
  pilots,
  planes,
  roles,
  skydivers,
} from "./data/manifest";
import type { Jump, Load, Skydiver } from "./data/manifest";

const euros = (value: number) =>
  new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
const kg = (value: number) =>
  `${value.toLocaleString("fi-FI", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
const collisionDetection: CollisionDetection = (args) => {
  if (!args.pointerCoordinates) return closestCenter(args);
  // Container bounds can change during scrolling or when the local font loads.
  const droppableRects = new Map(args.droppableRects);
  for (const container of args.droppableContainers) {
    if (
      (container.id === "queue" || String(container.id).startsWith("load-")) &&
      container.node.current
    ) {
      droppableRects.set(
        container.id,
        container.node.current.getBoundingClientRect(),
      );
    }
  }
  const liveArgs = { ...args, droppableRects };
  const hits = pointerWithin(liveArgs);
  return hits.length ? hits : rectIntersection(liveArgs);
};

const keyboardCoordinates: KeyboardCoordinateGetter = (event, args) => {
  if (event.code === "ArrowUp" || event.code === "ArrowDown")
    return sortableKeyboardCoordinates(event, args);
  if (event.code !== "ArrowLeft" && event.code !== "ArrowRight")
    return undefined;
  const { collisionRect, droppableContainers, droppableRects } = args.context;
  if (!collisionRect) return undefined;
  event.preventDefault();
  const x = collisionRect.left + collisionRect.width / 2;
  const y = collisionRect.top + collisionRect.height / 2;
  const targets = droppableContainers
    .getEnabled()
    .flatMap((container) => {
      // Moving right leaves the queue; its centre must not be a candidate.
      if (event.code === "ArrowRight" && container.id === "queue") return [];
      if (event.code === "ArrowLeft" && container.id !== "queue") return [];
      if (container.id !== "queue" && !String(container.id).startsWith("load-"))
        return [];
      const rect =
        container.node.current?.getBoundingClientRect() ??
        droppableRects.get(container.id);
      if (!rect) return [];
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      if (event.code === "ArrowRight" ? centerX <= x + 1 : centerX >= x - 1)
        return [];
      return [{ rect, distance: Math.hypot(centerX - x, centerY - y) }];
    })
    .sort((a, b) => a.distance - b.distance);
  const target = targets[0]?.rect;
  return target
    ? {
        x: target.left + (target.width - collisionRect.width) / 2,
        y: target.top + (target.height - collisionRect.height) / 2,
      }
    : undefined;
};

const Grip = () => {
  return (
    <span aria-hidden="true" className="grip">
      ⠿
    </span>
  );
};
type PersonCardProps = {
  person: Skydiver;
  minutes: number;
  jump: Jump;
};

const PersonCard = ({ person, minutes, jump }: PersonCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: person.id,
  });
  return (
    <div
      ref={setNodeRef}
      className={`person-card ${isDragging ? "dragging" : ""}`}
    >
      <button
        className="drag-handle"
        aria-label={`Vedä ${person.name}`}
        {...attributes}
        {...listeners}
      >
        <Grip />
      </button>
      <div className="min-w-0 flex-1">
        <span className="person-name">
          {person.name}{" "}
          {person.roles.map((role) => (
            <span
              key={role}
              className={`queue-role-tag ${roleClass(role)}`}
              title={roleLabels[role]}
            >
              {roleTags[role]}
            </span>
          ))}
        </span>
        <span className="person-detail queue-jump-detail">
          {jumpRole(jump) === "Student"
            ? jump.exercise || "Harjoitus valitsematta"
            : `${jump.altitude.toLocaleString("en-FI")} m`}
        </span>
        <span className="person-detail">
          {person.weight} kg -{" "}
          <span
            className={`queue-time ${minutes < 60 ? "wait-short" : minutes < 120 ? "wait-medium" : "wait-long"}`}
            data-minutes={minutes}
          >
            {Math.floor(minutes / 60)} t {String(minutes % 60).padStart(2, "0")}{" "}
            min
          </span>
        </span>
      </div>
    </div>
  );
};
type QueueProps = {
  people: Skydiver[];
  queueTimes: Record<string, number>;
  available: Skydiver[];
  add: (jump: Jump) => void;
  queueJumps: Record<string, Jump>;
};

const JumperPicker = ({ people, label, onSelect, selectedId, emptyOption }: {
  people: Skydiver[];
  label: string;
  onSelect: (id: string) => void;
  selectedId?: string;
  emptyOption?: string;
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0 });
  const matches = people.filter((person) => person.name.toLocaleLowerCase("fi").includes(query.toLocaleLowerCase("fi")));
  const showEmpty = emptyOption && emptyOption.toLocaleLowerCase("fi").includes(query.toLocaleLowerCase("fi"));
  const select = (id: string) => {
    onSelect(id);
    setQuery("");
    setOpen(false);
  };
  return <div className="jumper-picker" onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <input role="combobox" aria-label={label} placeholder={label}
      aria-expanded={open} aria-controls={`${label}-options`} aria-autocomplete="list"
      value={!open && selectedId !== undefined ? people.find((person) => person.id === selectedId)?.name ?? emptyOption ?? "" : query} onFocus={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPosition({ left: rect.left, top: rect.bottom + 4, width: rect.width });
        setOpen(true);
      }}
      onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === "ArrowDown") && (matches.length || showEmpty)) {
          event.preventDefault();
          if (event.key === "Enter") select(showEmpty ? "" : matches[0].id);
          else event.currentTarget.parentElement?.querySelector<HTMLButtonElement>("button")?.focus();
        }
        if (event.key === "Escape") setOpen(false);
      }} />
    {open && <div className="jumper-options" style={{ position: "fixed", ...position }} role="listbox" id={`${label}-options`} aria-label={label}>
      {showEmpty && <button type="button" role="option" aria-selected={selectedId === ""} onClick={() => select("")}>{emptyOption}</button>}
      {matches.map((person) => <button type="button" role="option" aria-selected={false} key={person.id}
        onClick={() => select(person.id)}>{person.name}{selectedId === undefined ? ` · ${person.weight} kg` : ""}</button>)}
      {!matches.length && !showEmpty && <span>Ei hakutuloksia</span>}
    </div>}
  </div>;
};

const Queue = ({ people, queueTimes, available, add, queueJumps }: QueueProps) => {
  const [tab, setTab] = useState<"role" | "time">("role");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Jump | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const { setNodeRef, isOver } = useDroppable({ id: "queue" });
  return (
    <aside ref={setNodeRef} className={`queue ${isOver ? "queue-over" : ""}`}>
      <div className="queue-heading">
        <div>
          <h2>Hyppääjäjono</h2>
        </div>
        <div className="queue-heading-actions">
          <span className="count-badge">{people.length}</span>
          <button className="primary-button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setPopupPosition({ top: rect.bottom + 8, left: Math.max(8, rect.right - 300) });
              setDraft(null);
              setAdding(true);
              event.currentTarget.parentElement?.querySelector("dialog")?.showModal();
            }}>+ Lisää</button>
          <dialog id="queue-add-popup" className="queue-add-popup" style={popupPosition}
            aria-label="Lisää hyppääjä jonoon" onClose={() => setAdding(false)}>
            {adding && <>
              <JumperPicker people={available} label="Lisää hyppääjä jonoon" onSelect={(id) => setDraft(createJump(id))} />
              {draft && <p className="queue-selected-name">{findSkydiver(draft.skydiverId).name}</p>}
              {draft?.type === "Student" ? <label>Harjoitus
                <select aria-label="Jonoon lisättävän oppilaan harjoitus" value={draft.exercise ?? ""}
                  onChange={(event) => {
                    const exercise = studentExercises.find((item) => item.name === event.target.value);
                    setDraft({ ...draft, exercise: event.target.value, altitude: exercise?.altitude ?? draft.altitude,
                      highOpening: exercise?.name === "Kuvunkäsittely" });
                  }}>
                  <option value="">Valitse harjoitus</option>
                  {studentExercises.map((exercise) => <option key={exercise.name} value={exercise.name}>{exercise.name}</option>)}
                </select>
              </label> : <label>Hyppykorkeus
                <select aria-label="Jonoon lisättävän hyppääjän korkeus" disabled={!draft} value={draft?.altitude ?? 3500}
                  onChange={(event) => { if (draft) setDraft({ ...draft, altitude: Number(event.target.value) }); }}>
                  {altitudes.map((altitude) => <option key={altitude} value={altitude}>{altitude.toLocaleString("en-FI")} m</option>)}
                </select>
              </label>}
              <div className="queue-add-actions">
              <button className="primary-button" disabled={!draft || (draft.type === "Student" && !draft.exercise)}
                onClick={(event) => {
                  if (!draft) return;
                  add(draft);
                  event.currentTarget.closest("dialog")?.close();
                }}>Lisää jonoon</button>
              <button className="queue-cancel-button" onClick={(event) => {
                event.currentTarget.closest("dialog")?.close();
              }}>Peruuta</button>
              </div>
            </>}
          </dialog>
        </div>
      </div>
      <div className="queue-tabs" role="tablist" aria-label="Jonon järjestys">
        <button
          role="tab"
          id="queue-role-tab"
          aria-controls="queue-list"
          aria-selected={tab === "role"}
          onClick={() => setTab("role")}
        >
          Rooli
        </button>
        <button
          role="tab"
          id="queue-time-tab"
          aria-controls="queue-list"
          aria-selected={tab === "time"}
          onClick={() => setTab("time")}
        >
          Jonotusaika
        </button>
      </div>
      <div
        id="queue-list"
        role="tabpanel"
        aria-labelledby={tab === "role" ? "queue-role-tab" : "queue-time-tab"}
      >
        {tab === "time"
          ? [...people]
              .sort((a, b) => queueTimes[b.id] - queueTimes[a.id])
              .map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  jump={queueJumps[person.id] ?? createJump(person.id)}
                  minutes={queueTimes[person.id]}
                />
              ))
          : roles.map((role) => {
              const group = people.filter(
                (person) => primaryRole(person) === role,
              );
              return (
                <section key={role} className="queue-group">
                  <h3>
                    <span className={`role-dot ${roleClass(role)}`} />
                    {roleLabels[role]}
                    <span>{group.length}</span>
                  </h3>
                  {group.map((person) => (
                    <PersonCard
                      key={person.id}
                      person={person}
                      jump={queueJumps[person.id] ?? createJump(person.id)}
                      minutes={queueTimes[person.id]}
                    />
                  ))}
                  {group.length === 0 && (
                    <p className="group-empty">Kaikki lisätty pokiin</p>
                  )}
                </section>
              );
            })}
      </div>
    </aside>
  );
};
type JumpRowProps = {
  licensePrices: Record<number, number>;
  jump: Jump;
  load: Load;
  update: (patch: Partial<Jump>) => void;
  remove: () => void;
};

const JumpRow = ({ jump, load, update, remove, licensePrices }: JumpRowProps) => {
  const person = findSkydiver(jump.skydiverId);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: person.id });
  const instructors = load.jumps
    .filter((item) => jumpRole(item) === "Instructor")
    .map((item) => findSkydiver(item.skydiverId));
  const missing =
    jumpRole(jump) === "Student" && !hasInstructor(jump, load.jumps);
  const price = jumpPrice(jump, load.jumps, licensePrices);
  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "dragging" : ""}
    >
      <td className="handle-cell">
        <button
          className="drag-handle"
          aria-label={`Siirrä ${person.name}`}
          {...attributes}
          {...listeners}
        >
          <Grip />
        </button>
      </td>
      <td>
        <span className="row-identity">
          <span className="row-name">{person.name}</span>
          <span
            className={`queue-role-tag ${roleClass(jumpRole(jump))}`}
            title={roleLabels[jumpRole(jump)]}
            aria-label={roleLabels[jumpRole(jump)]}
          >
            {roleTags[jumpRole(jump)]}
          </span>
          <span className="row-weight">{person.weight} kg</span>
        </span>
      </td>
      <td>
        {jumpRole(jump) === "Student" ? (
          <>
            <select
              aria-label={`Harjoitus: ${person.name}`}
              className={!jump.exercise ? "invalid-select" : ""}
              value={jump.exercise ?? ""}
              onChange={(event) => {
                const exercise = studentExercises.find(
                  (item) => item.name === event.target.value,
                );
                update({
                  type: "Student",
                  exercise: event.target.value,
                  ...(exercise ? { altitude: exercise.altitude } : {}),
                  ...(exercise?.name === "Kuvunkäsittely"
                    ? { highOpening: true }
                    : {}),
                });
              }}
            >
              <option value="">Valitse harjoitus</option>
              {studentExercises.map((exercise) => (
                <option key={exercise.name} value={exercise.name}>
                  {exercise.name}
                </option>
              ))}
            </select>
            {!jump.exercise && (
              <span className="field-warning">Valitse harjoitus</span>
            )}
          </>
        ) : (
          <select
            aria-label={`Hyppylaji: ${person.name}`}
            value={jump.type}
            onChange={(event) => update({ type: event.target.value })}
          >
            {availableJumpTypes(person).map((type) => (
              <option
                key={type}
                value={type}
                disabled={
                  ["Tandem instructor", "Tandem student"].includes(type) &&
                  load.jumps.some(
                    (other) =>
                      other.skydiverId !== jump.skydiverId &&
                      other.type === type,
                  )
                }
              >
                {jumpTypeLabel(type)}
              </option>
            ))}
          </select>
        )}
      </td>
      <td>
        <select
          aria-label={`Hyppykorkeus: ${person.name}`}
          value={jump.altitude}
          onChange={(event) => update({ altitude: Number(event.target.value) })}
        >
          {(jumpRole(jump) === "Student" ? studentAltitudes : altitudes).map(
            (altitude) => (
              <option key={altitude} value={altitude}>
                {altitude.toLocaleString("en-FI")} m
              </option>
            ),
          )}
        </select>
      </td>
      <td>
        <span className={`price ${price === 0 ? "free-price" : ""}`}>
          {price === null ? "Ei määritetty" : euros(price)}
        </span>
        {price === 0 && (
          <span className="person-detail">Oma oppilas samalla pokalla</span>
        )}
      </td>
      <td>
        {jumpRole(jump) === "Student" ? (
          <>
            <select
              className={missing ? "invalid-select" : ""}
              aria-label={`Hyppymestari: ${person.name}`}
              value={hasInstructor(jump, load.jumps) ? jump.instructorId : ""}
              onChange={(event) => update({ instructorId: event.target.value })}
            >
              <option value="">Valitse hyppymestari</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
            {missing && (
              <span className="field-warning">Hyppymestari puuttuu</span>
            )}
          </>
        ) : (
          <span className="muted">—</span>
        )}
      </td>
      <td>
        <JumpDetails jump={jump} name={person.name} update={update} />
        {loadFlightState(load) === "Dropped" && <label className="returned-by-plane-control">
          <input type="checkbox" aria-label={`Koneella alas: ${person.name}`} checked={jump.returnedByPlane ?? false}
            onChange={(event) => update({ returnedByPlane: event.target.checked })} />
          Koneella alas
        </label>}
      </td>
      <td>
        <button
          className="return-button"
          onClick={remove}
          aria-label={`Palauta ${person.name} jonoon`}
          title="Palauta jonoon"
        >
          ↩
        </button>
      </td>
    </tr>
  );
};
type LoadCardProps = {
  licensePrices: Record<number, number>;
  load: Load;
  emptyWeight: number;
  update: (patch: Partial<Load>) => void;
  updateJump: (id: string, patch: Partial<Jump>) => void;
  removeJump: (id: string) => void;
  deleteLoad: () => void;
  queueLoad: () => void;
  available: Skydiver[];
  addJump: (id: string) => void;
};

const LoadCard = ({
  licensePrices,
  load,
  emptyWeight,
  update,
  updateJump,
  removeJump,
  deleteLoad,
  queueLoad,
  available,
  addJump,
}: LoadCardProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: load.id });
  const weights = loadWeights(load, emptyWeight);
  const missing = load.jumps.filter(
    (jump) => jumpRole(jump) === "Student" && !hasInstructor(jump, load.jumps),
  );
  const full = load.jumps.length === MAX_JUMPERS;
  const tandemAlerts = tandemWarnings(load.jumps);
  const overweight = weights.remaining < 0;
  const groundError = groundPersonError(load);
  return (
    <section
      ref={setNodeRef}
      className={`load-card ${isOver ? "load-over" : ""}`}
      aria-label={`Poka ${load.number}`}
    >
      <div className="load-heading">
        <div className="load-title">
          <span className="load-number">
            {String(load.number).padStart(2, "0")}
          </span>
          <div>
            <div className="load-title-line">
              <h2>Poka {String(load.number).padStart(2, "0")}</h2>
              <span
                className={`status ${overweight || missing.length || tandemAlerts.length ? "status-warning" : full ? "status-full" : ""}`}
              >
                {load.hasBeenSaved
                  ? "Muokkaus"
                  : overweight
                    ? "Ylipaino"
                    : missing.length || tandemAlerts.length
                      ? "Tarkistettava"
                      : full
                        ? "Poka täynnä"
                        : "Suunniteltu"}
              </span>
            </div>
            <p>
              Cessna 182 <span>·</span> {load.jumps.length} / 5 hyppääjää
            </p>
          </div>
        </div>
        <div className="load-heading-actions">
          <button
            className="secondary-button save-load-button"
            onClick={queueLoad}
            disabled={load.jumps.length === 0 || Boolean(groundError)}
            aria-label={`Tallenna poka ${load.number}`}
          >
            Tallenna poka
          </button>

          <button
            className="secondary-button remove-load-button"
            onClick={deleteLoad}
            aria-label={`Poista poka ${load.number} ja palauta hyppääjät jonoon`}
          >
            Poista
          </button>
        </div>
      </div>
      {loadFlightState(load) === "Dropped" && <label className="returned-by-plane-control whole-load-return">
        <input type="checkbox" checked={load.jumps.length > 0 && load.jumps.every((jump) => jump.returnedByPlane)}
          onChange={(event) => update({ jumps: load.jumps.map((jump) => ({ ...jump, returnedByPlane: event.target.checked })) })} />
        Koko poka koneella alas
      </label>}
      <div className="load-settings">
        <label>
          Ilma-alus
          <select
            value={load.plane}
            onChange={(event) => update({ plane: event.target.value })}
          >
            {planes.map((plane) => (
              <option key={plane}>{plane}</option>
            ))}
          </select>
        </label>
        <label>
          Lentäjä
          <select
            value={load.pilotId}
            onChange={(event) => update({ pilotId: event.target.value })}
          >
            {pilots.map((pilot) => (
              <option key={pilot.id} value={pilot.id}>
                {pilot.name} · {pilot.weight} kg
              </option>
            ))}
          </select>
        </label>
        <label>
          Maahenkilö<JumperPicker label="Maahenkilö" selectedId={load.groundPersonId ?? ""} emptyOption="Ei maahenkilöä"
            people={skydivers.filter((person) => person.roles.includes("Licensed") && !load.jumps.some((jump) => jump.skydiverId === person.id))}
            onSelect={(id) => update({ groundPersonId: id || undefined, groundPerson: undefined })} />
        </label>
        <label>
          100LL-polttoaine (litraa)
          <input
            type="number"
            min="0"
            max="1000"
            step="1"
            value={load.fuel}
            onChange={(event) =>
              update({
                fuel: Math.min(1000, Math.max(0, Number(event.target.value))),
              })
            }
          />
        </label>
      </div>
      <div className="load-planning-columns">
        <div className="load-table-column">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th aria-label="Järjestä" />
                  <th>Hyppääjä</th>
                  <th>Hyppylaji / harjoitus</th>
                  <th>Korkeus</th>
                  <th>Hinta</th>
                  <th>Hyppymestari</th>
                  <th>Lisää</th>
                  <th aria-label="Palauta jonoon" />
                </tr>
              </thead>
              <SortableContext
                items={load.jumps.map((jump) => jump.skydiverId)}
                strategy={verticalListSortingStrategy}
              >
                <tbody>
                  {load.jumps.map((jump) => (
                    <JumpRow
                      licensePrices={licensePrices}
                      key={jump.skydiverId}
                      jump={jump}
                      load={load}
                      update={(patch) => updateJump(jump.skydiverId, patch)}
                      remove={() => removeJump(jump.skydiverId)}
                    />
                  ))}
                  {!full && weights.remaining > 0 && <tr className="add-jumper-row">
                    <td className="handle-cell"><button className="drag-handle" disabled aria-label="Siirrä hyppääjä"><Grip /></button></td>
                    <td><JumperPicker people={available.filter((person) => person.weight <= weights.remaining && person.id !== load.groundPersonId)} label="Lisää hyppääjä pokaan" onSelect={addJump} /></td>
                    <td><select disabled aria-label="Hyppylaji"><option>Hyppylaji</option></select></td>
                    <td><select disabled aria-label="Hyppykorkeus"><option>Korkeus</option></select></td>
                    <td><span className="muted">—</span></td>
                    <td><select disabled aria-label="Hyppymestari"><option>Hyppymestari</option></select></td>
                    <td><button disabled className="secondary-button">Lisää</button></td>
                    <td><button disabled className="secondary-button" aria-label="Palauta jonoon">×</button></td>
                  </tr>}
                </tbody>
              </SortableContext>
            </table>
          </div>
          {!full && (
            <div
              className={`drop-zone ${load.jumps.length === 0 ? "empty-load" : ""}`}
            >
              <span aria-hidden="true">＋</span>
              <strong>
                {load.jumps.length === 0
                  ? "Aloita uuden pokan suunnittelu tästä"
                  : `${MAX_JUMPERS - load.jumps.length} ${MAX_JUMPERS - load.jumps.length === 1 ? "paikka" : "paikkaa"} vapaana`}
              </strong>
              <p>Vedä hyppääjiä jonosta</p>
            </div>
          )}
          {(missing.length > 0 || overweight || tandemAlerts.length > 0 || groundError) && (
            <div className="load-warnings" role="status">
              {groundError && <p>⚠ {groundError}</p>}
              {tandemAlerts.map((message) => (
                <p key={message}>⚠ {message}</p>
              ))}
              {missing.length > 0 && (
                <p>
                  ⚠ Määritä tämän pokan hyppymestari oppilaille:{" "}
                  {missing
                    .map((jump) => findSkydiver(jump.skydiverId).name)
                    .join(", ")}
                  .
                </p>
              )}
              {overweight && (
                <p>
                  ⚠ Arvioitu lentoonlähtömassa ylittää sallitun rajan{" "}
                  {kg(-weights.remaining)}.
                </p>
              )}
            </div>
          )}
      <details className="additional-info-field load-additional-info">
        <summary>
          Lisätiedot{" "}
          <svg
            className="info-chevron"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="m4 6 4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>
        <textarea
          aria-label={`Pokan lisätiedot ${load.number}`}
          rows={2}
          value={load.additionalInfo ?? ""}
          onChange={(event) => update({ additionalInfo: event.target.value })}
        />
      </details>
      <div className="load-footer">
        <div className="weight-summary">
          <span>
            Perusmassa <strong>{kg(emptyWeight)}</strong>
          </span>
          <span>
            Polttoaine <strong>{kg(weights.fuel)}</strong>
          </span>
          <span>
            Lentäjä <strong>{kg(weights.pilot)}</strong>
          </span>
          <span>
            Hyppääjät <strong>{kg(weights.jumpers)}</strong>
          </span>
        </div>
        <div className="footer-totals">
          <span className={overweight ? "overweight-text" : ""}>
            Jäljellä <strong>{kg(weights.remaining)}</strong>
          </span>
        </div>
      </div>
      <div className="weight-bar-section">
        <div className="weight-bar">
          <div
            className={overweight ? "overweight-bar" : ""}
            style={{ width: `${Math.min(100, (weights.total / MTOM) * 100)}%` }}
          />
        </div>
        <div className="weight-caption">
          <span>{kg(weights.total)} arvioitu lentoonlähtömassa</span>
          <span>{MTOM} kg MTOM</span>
        </div>
      </div>
        </div>
        <LoadSeating load={load} emptyWeight={emptyWeight} update={update} />
      </div>
    </section>
  );
};

const currentView = () => {
  const hash = window.location.hash.slice(1);
  return ["gift-cards", "queue", "history", "statistics", "calendar", "account", "pilot", "settings", "members", "waiver", "waiver-review"].includes(hash) ? hash : "planning";
};

const App = () => {
  const memberRegistry = useMembers();
  const waiverRegistry = useWaivers();
  const queueTimes = useQueueTimes();
  const { manifest, setManifest, storageError } = useLocalManifest();
  const { loads, emptyWeights } = manifest;
  const [view, setView] = useState(currentView);
  const [giftCardsEnabled, setGiftCardsEnabled] = useState(false);
  useEffect(() => {
    let active = true;
    fetch('/api/features', { cache: 'no-store' }).then(response => response.ok ? response.json() as Promise<{ giftCards?: boolean }> : { giftCards: false }).then(features => { if (active) setGiftCardsEnabled(features.giftCards === true); }).catch(() => {});
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const changeView = () => setView(currentView());
    window.addEventListener("hashchange", changeView);
    return () => window.removeEventListener("hashchange", changeView);
  }, []);
  const setLoads = (action: SetStateAction<Load[]>) => {
    setManifest((current) => {
      const nextLoads = typeof action === "function" ? action(current.loads) : action;
      return {
        ...current,
        loads: nextLoads,
        queueJumps: { ...current.queueJumps, ...Object.fromEntries(
          [...current.loads, ...nextLoads].flatMap((load) => load.jumps.map((jump) => [jump.skydiverId, jump])),
        ) },
      };
    });
  };
  const setEmptyWeights = (action: SetStateAction<Record<string, number>>) => {
    setManifest((current) => ({
      ...current,
      emptyWeights:
        typeof action === "function" ? action(current.emptyWeights) : action,
    }));
  };
  const planningLoads = loads.filter((load) => load.status === "planning");
  const queuedLoads = loads.filter((load) => load.status === "queued");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: keyboardCoordinates }),
  );
  const assigned = new Set(
    loads.flatMap((load) => load.jumps.map((jump) => jump.skydiverId)),
  );
  const queued = skydivers.filter((person) => manifest.queueIds.includes(person.id) && !assigned.has(person.id));
  const outsideQueue = skydivers.filter((person) => !manifest.queueIds.includes(person.id) && !assigned.has(person.id));
  const enroll = (jump: Jump) => setManifest((current) => ({
    ...current,
    queueIds: [...new Set([...current.queueIds, jump.skydiverId])],
    queueJumps: { ...current.queueJumps, [jump.skydiverId]: jump },
  }));
  const activePerson = activeId ? findSkydiver(activeId) : null;
  const updateLoad = (id: string, patch: Partial<Load>) => {
    setLoads((current) =>
      current.map((load) => (load.id === id ? { ...load, ...patch } : load)),
    );
  };
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over) return;
    const personId = String(active.id);
    const overId = String(over.id);
    if (overId === personId) return;
    const target = planningLoads.find(
      (load) =>
        load.id === overId ||
        load.jumps.some((jump) => jump.skydiverId === overId),
    );
    const destination =
      target?.id ??
      (overId === "queue" || queued.some((person) => person.id === overId)
        ? null
        : undefined);
    if (destination === undefined) return;
    if (
      target &&
      target.jumps.length >= MAX_JUMPERS &&
      !target.jumps.some((jump) => jump.skydiverId === personId)
    ) {
      setNotice(
        `Poka ${target.number} on täynnä. Pokaan mahtuu enintään 5 hyppääjää.`,
      );
      return;
    }
    let beforeId = target?.jumps.some((jump) => jump.skydiverId === overId)
      ? overId
      : undefined;
    // Moving down within the same load inserts after the row under the pointer.
    if (target && beforeId) {
      const sourceIndex = target.jumps.findIndex(
        (jump) => jump.skydiverId === personId,
      );
      const overIndex = target.jumps.findIndex(
        (jump) => jump.skydiverId === overId,
      );
      if (sourceIndex >= 0 && sourceIndex < overIndex)
        beforeId = target.jumps[overIndex + 1]?.skydiverId;
    }
    setLoads((current) =>
      moveSkydiver(current, personId, destination, beforeId, manifest.queueJumps),
    );
  };
  if (view === "queue")
    return (
      <QueueView
        loads={loads.filter(
          (load) => load.status === "queued" || load.hasBeenSaved,
        )}
        emptyWeights={emptyWeights}
        storageError={storageError}
      />
    );
  return (
    <DndContext
      accessibility={dragAccessibility}
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={({ active }) => {
        setActiveId(String(active.id));
        setNotice("");
      }}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">
            <img
              src="/images/osc-header-color-black-extra-space.png"
              alt="OSC"
            />
            <span className="brand-divider" />
            <span className="brand-name">Manifest</span>
          </div>
          <nav className="view-navigation" aria-label="Näkymät">
            {([
              { label: "Ylläpito", links: [["planning", "Pokasuunnittelu"], ["members", "Jäsenet"], ["history", "Pokahistoria"], ["statistics", "Tilastot"], ["settings", "Asetukset"], ...(giftCardsEnabled ? [["gift-cards", "Lahjakortit"]] : [])] },
              { label: "Käyttäjä", links: [["account", "Oma sivu"], ["calendar", "Kalenteri"], ["pilot", "Lentäjänäkymä"], ["waiver", "Täytä waiver"], ["waiver-review", "Waiverin tarkastus"]] },
            ]).map((group) => <details key={group.label} className="navigation-group"
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}
              onKeyDown={(event) => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}>
              <summary className={group.links.some(([route]) => route === view) ? "navigation-group-active" : ""}>{group.label}<svg className="navigation-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></summary>
              <div className="navigation-group-links">
                {group.links.map(([route, label]) => <a key={route} href={`#${route}`} aria-current={view === route ? "page" : undefined}
                  onClick={(event) => { event.currentTarget.closest("details")!.open = false; }}>{label}</a>)}
              </div>
            </details>)}
          </nav>
          <a href="#queue" className="primary-button queue-view-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <path d="m8 2 4 4 4-4M9 22h6" />
            </svg>
            Jononäkymä
          </a>
        </header>
        {view === "gift-cards" ? (giftCardsEnabled ? <GiftCards /> : <main className="members-view"><h1>N?kym? ei ole k?ytett?viss?</h1></main>) : view === "calendar" ? <CalendarView members={memberRegistry.members} /> : view === "account" ? <AccountView members={memberRegistry.members} transactions={manifest.transactions ?? []} deposit={(memberId, amountCents) => {
          if (!Number.isSafeInteger(amountCents) || amountCents <= 0) return;
          const transaction = { id: `deposit-${crypto.randomUUID()}`, memberId, at: new Date().toISOString(), amountCents, kind: "deposit" as const, description: "Talletus" };
          setManifest((current) => ({ ...current, transactions: [...(current.transactions ?? []), transaction] }));
        }} /> : view === "pilot" ? <PilotView loads={loads} emptyWeights={emptyWeights} updateFlightTime={(id, pilotId, minutes) => setManifest((current) => ({
          ...current, loads: current.loads.map((load) => load.id === id && load.pilotId === pilotId && load.date === todayDate()
            ? { ...load, flightTimeMinutes: minutes } : load),
        }))} /> : view === "statistics" ? <Statistics loads={[...manifest.history, ...loads]} /> : view === "history" ? <LoadHistory loads={[...manifest.history, ...loads]} members={memberRegistry.members} emptyWeights={emptyWeights} saveLoad={(edited) => setManifest((current) => {
          const updated = replaceHistoryLoad([...current.history, ...current.loads], edited);
          return { ...current, loads: updated.filter(load => load.date === todayDate()), history: updated.filter(load => load.date !== todayDate()) };
        })} updateFlightTime={(id, minutes) => setManifest((current) => ({
          ...current,
          loads: current.loads.map((load) => load.id === id ? { ...load, flightTimeMinutes: minutes } : load),
          history: current.history.map((load) => load.id === id ? { ...load, flightTimeMinutes: minutes } : load),
        }))} /> : view === "waiver" ? <FillWaiver members={memberRegistry.members} waivers={waiverRegistry.waivers} updateMember={memberRegistry.updateMember} saveWaiver={waiverRegistry.saveWaiver} /> : view === "waiver-review" ? <WaiverReview waivers={waiverRegistry.waivers} save={(waiver) => {
          const previous = waiverRegistry.waivers.find((item) => item.memberId === waiver.memberId && item.type === waiver.type);
          waiverRegistry.saveWaiver(waiver);
          const member = memberRegistry.members.find((person) => person.id === waiver.memberId);
          const weightChanged = previous?.weight !== waiver.weight;
          const gearDateChanged = previous?.details.inspectionsValidUntil !== waiver.details.inspectionsValidUntil;
          if (member && waiver.type !== "pilot" && (weightChanged || gearDateChanged)) memberRegistry.updateMember(member.id, {
            ...member, weight: weightChanged ? waiver.weight : member.weight,
            details: { ...emptyMemberDetails(), ...member.details,
              ...(gearDateChanged ? { inspectionsValidUntil: waiver.details.inspectionsValidUntil } : {}),
            },
          });
        }} /> : view === "members" ? <Members transactions={manifest.transactions ?? []} members={memberRegistry.members} updateMember={(id, profile) => {
          const member = memberRegistry.members.find((person) => person.id === id)!;
          const allowed = availableJumpTypes({ ...member, ...profile });
          if (loads.some((load) => (load.pilotId === id && !profile.roles.includes("Pilot")) || load.jumps.some((jump) => jump.skydiverId === id && !allowed.includes(jump.type)))) {
            return "Rooli on käytössä pokassa. Muuta pokan tietoja ennen roolin poistamista.";
          }
          memberRegistry.updateMember(id, profile);
          return null;
        }} /> : view === "settings" ? (
          <Settings
            licensePrices={manifest.licensePrices}
            updatePrice={(altitude, price) => setManifest((current) => ({
              ...current, licensePrices: { ...current.licensePrices, [altitude]: price },
            }))}
            emptyWeights={emptyWeights}
            updateWeight={(plane, weight) =>
              setEmptyWeights((current) => ({ ...current, [plane]: weight }))
            }
          />
        ) : (
          <div className="workspace">
            <Queue people={queued} queueTimes={queueTimes} available={outsideQueue} add={enroll} queueJumps={manifest.queueJumps} />
            <main className="planner">
              <div className="planner-content">
              <div className="planner-heading">
                <div>
                  <h1>Pokasuunnittelu</h1>
                </div>
                <button
                  className="primary-button"
                  aria-label="Lisää poka"
                  disabled={planningLoads.length > 0}
                  title={
                    planningLoads.length > 0
                      ? "Tallenna tai poista nykyinen poka ensin"
                      : undefined
                  }
                  onClick={() => {
                    setManifest((current) =>
                      current.loads.some((load) => load.status === "planning")
                        ? current
                        : {
                            ...current,
                            loads: [
                              ...current.loads,
                              createLoad(current.loads.length + 1, `load-${crypto.randomUUID()}`),
                            ],
                            nextLoad: current.nextLoad + 1,
                          },
                    );
                  }}
                >
                  ＋ Lisää poka
                </button>
              </div>
              <div className="notice" role="status" aria-live="polite">
                {notice}
              </div>
              <div className="loads">
                {planningLoads.map((load) => (
                  <LoadCard
                    licensePrices={manifest.licensePrices}
                    key={load.id}
                    load={load}
                    available={[...queued, ...outsideQueue]}
                    addJump={(id) => {
                      setManifest((current) => ({
                        ...current,
                        queueIds: [...new Set([...current.queueIds, id])],
                        loads: moveSkydiver(current.loads, id, load.id, undefined, current.queueJumps),
                      }));
                    }}
                    queueLoad={() => {
                      setLoads((current) => current.map((item) => item.id !== load.id ? item : {
                          ...item,
                          status: "queued",
                          hasBeenSaved: true,
                          flightState: loadFlightState(item),
                        }));
                      setNotice("");
                    }}
                    emptyWeight={emptyWeights[load.plane]}
                    update={(patch) => updateLoad(load.id, patch)}
                    updateJump={(id, patch) =>
                      setLoads((current) =>
                        current.map((item) =>
                          item.id === load.id
                            ? {
                                ...item,
                                jumps: seatingPositions(
                                  item.jumps.map((jump) =>
                                    jump.skydiverId === id
                                      ? { ...jump, ...patch }
                                      : jump,
                                  ),
                                ).filter((jump): jump is Jump => Boolean(jump)),
                              }
                            : item,
                        ),
                      )
                    }
                    removeJump={(id) => {
                      setLoads((current) => moveSkydiver(current, id, null));
                      setNotice("");
                    }}
                    deleteLoad={() => {
                      setLoads((current) =>
                        current.filter((item) => item.id !== load.id),
                      );
                      setNotice("");
                    }}
                  />
                ))}
              </div>
              <LoadQueue
                loads={queuedLoads}
                emptyWeights={emptyWeights}
                editing={planningLoads.length > 0}
                changeState={(id, direction) =>
                  setLoads((current) =>
                    changeFlightState(current, id, direction),
                  )
                }
                edit={(id) => {
                  if (planningLoads.length > 0) return;
                  updateLoad(id, { status: "planning", hasBeenSaved: true });
                  setNotice("");
                }}
                reorder={(active, over) =>
                  setLoads((current) =>
                    reorderQueuedLoads(current, active, over),
                  )
                }
              />
              {loads.length === 0 && (
                <div className="no-loads">
                  <h2>Ei suunniteltuja pokia</h2>
                  <p>Aloita manifestin suunnittelu lisäämällä poka.</p>
                </div>
              )}
              </div>
              <PlanningFooter loads={loads} />
            </main>
          </div>
        )}
      </div>
      <DragOverlay style={{ pointerEvents: "none" }}>
        {activePerson ? (
          <div className="person-card overlay-card">
            <Grip />
            <div>
              <span className="person-name">{activePerson.name}</span>
              <span className="person-detail">
                {roleLabels[primaryRole(activePerson)]} · {activePerson.weight}{" "}
                kg
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
export default App;
