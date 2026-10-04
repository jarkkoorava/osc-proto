import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  findSkydiver,
  jumpRole,
  pilots,
  seatingPositions,
  roleClass,
} from "./data/manifest";
import type { Load, Jump } from "./data/manifest";
import { LoadBalance } from "./LoadBalance";
import { dragAccessibility } from "./fi";

type SeatProps = { position: number; jump?: Jump };

const Seat = ({ position, jump }: SeatProps) => {
  const person = jump ? findSkydiver(jump.skydiverId) : null;
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({ id: `seat-${position}`, disabled: !jump });
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `seat-${position}`,
    disabled: !jump,
  });
  return (
    <button
      type="button"
      ref={(node) => {
        setDragRef(node);
        setDropRef(node);
      }}
      className={`manifest-seat ${person ? roleClass(jumpRole(jump!)) : "empty-seat"} ${isOver ? "seat-over" : ""} ${isDragging ? "dragging" : ""}`}
      aria-label={`Paikka ${position}: ${person?.name ?? "Tyhjä"}`}
      disabled={!jump}
      {...attributes}
      {...listeners}
    >
      <span className="seat-position">{position}</span>
      <strong>{person?.name ?? "Tyhjä"}</strong>
    </button>
  );
};

type LoadSeatingProps = {
  load: Load;
  emptyWeight: number;
  update: (patch: Partial<Load>) => void;
};

export const LoadSeating = ({
  load,
  emptyWeight,
  update,
}: LoadSeatingProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );
  return (
    <aside
      className="load-seating"
      aria-label={`Pokan istumajärjestys ${load.number}`}
    >
      <h3>Istumajärjestys</h3>
      <p className="seating-direction">Koneen etuosa ↑</p>
      <DndContext
        accessibility={dragAccessibility}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;
          const from = Number(String(active.id).replace("seat-", "")) - 1;
          const to = Number(String(over.id).replace("seat-", "")) - 1;
          const seats = seatingPositions(load.jumps);
          if (!seats[from] || !seats[to]) return;
          if (
            [seats[from], seats[to]].some((jump) =>
              ["Tandem instructor", "Tandem student"].includes(jump!.type),
            )
          )
            return;
          const jumps = [...load.jumps];
          const source = jumps.indexOf(seats[from]!);
          const target = jumps.indexOf(seats[to]!);
          [jumps[source], jumps[target]] = [jumps[target], jumps[source]];
          update({ jumps });
        }}
      >
        <div className="manifest-seat-grid">
          <div className="manifest-pilot">
            <span className="seat-position">Lentäjä</span>
            <strong>
              {pilots.find((pilot) => pilot.id === load.pilotId)?.name}
            </strong>
          </div>
          {[1, 3, 2, 4, 5].map((position) => (
            <Seat
              key={position}
              position={position}
              jump={seatingPositions(load.jumps)[position - 1]}
            />
          ))}
        </div>
      </DndContext>
      <LoadBalance load={load} emptyWeight={emptyWeight} />
    </aside>
  );
};
