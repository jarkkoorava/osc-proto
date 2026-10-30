import { useEffect, useId, useRef, useState } from 'react';
import { availableJumpTypes, roleClass } from './data/manifest';
import type { Skydiver } from './data/manifest';
import { roleLabels, roleTags } from './fi';

export function JumperPicker({ people, label, onSelect, selectedId, emptyOption, showJumpTypes = false }: {
  people: Skydiver[]; label: string; onSelect: (id: string) => void;
  selectedId?: string; emptyOption?: string; showJumpTypes?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0 });
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listPointer = useRef(false);
  const id = useId();
  const matches = people.filter(person => person.name.toLocaleLowerCase('fi').includes(query.toLocaleLowerCase('fi')));
  const options = [
    ...(emptyOption && emptyOption.toLocaleLowerCase('fi').includes(query.toLocaleLowerCase('fi')) ? [{ id: '', name: emptyOption, person: undefined }] : []),
    ...matches.map(person => ({ id: person.id, name: person.name, person })),
  ];
  const activeIndex = Math.min(active, options.length - 1);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const release = () => { listPointer.current = false; };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('pointerup', release); document.removeEventListener('pointercancel', release); };
  }, []);
  useEffect(() => {
    if (open && activeIndex >= 0) document.getElementById(`${id}-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex, id, query]);
  const locate = () => {
    const rect = input.current?.getBoundingClientRect();
    if (rect) setPosition({ left: rect.left, top: rect.bottom + 4, width: rect.width });
  };
  const select = (value: string) => { onSelect(value); setQuery(''); input.current?.focus(); setOpen(false); };
  return <div className="jumper-picker" ref={root} onBlur={event => {
    // Native scrollbars can blur the input with no relatedTarget. Pointer clicks
    // outside are handled separately; only close here for real focus transfers.
    if (!listPointer.current && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <input ref={input} role="combobox" aria-label={label} placeholder={label}
      aria-expanded={open} aria-controls={`${id}-options`} aria-autocomplete="list"
      aria-activedescendant={open && activeIndex >= 0 ? `${id}-${activeIndex}` : undefined}
      value={!open && selectedId !== undefined ? people.find(person => person.id === selectedId)?.name ?? emptyOption ?? '' : query}
      onFocus={() => { locate(); setActive(0); setOpen(true); }}
      onClick={() => { if (!open) { locate(); setOpen(true); } }}
      onChange={event => { setQuery(event.target.value); setActive(0); locate(); setOpen(true); }}
      onKeyDown={event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault(); locate(); setOpen(true);
          setActive(!open ? 0 : Math.max(0, Math.min(options.length - 1, activeIndex + (event.key === 'ArrowDown' ? 1 : -1))));
        } else if (event.key === 'Enter' && open) {
          event.preventDefault(); if (options[activeIndex]) select(options[activeIndex].id);
        } else if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); }
      }} />
    {open && <div className="jumper-options" tabIndex={-1} onPointerDownCapture={() => { listPointer.current = true; }} style={{ position: 'fixed', ...position }} role="listbox" id={`${id}-options`} aria-label={label}>
      {options.map((option, index) => <button type="button" tabIndex={-1} role="option" id={`${id}-${index}`} key={option.id}
        aria-label={`${option.name}${option.person && selectedId === undefined && !showJumpTypes ? ` · ${option.person.weight} kg` : ''}`}
        aria-selected={option.id === selectedId} className={index === activeIndex ? 'jumper-option-active' : ''}
        onMouseDown={event => event.preventDefault()} onClick={() => select(option.id)}>
        <span>{option.name}</span>
        {showJumpTypes && option.person && <span className="jumper-option-tags">{availableJumpTypes(option.person).map(type => {
          const role = type === 'License' ? 'Licensed' : type;
          return <span key={type} className={`queue-role-tag ${roleClass(role)}`} title={roleLabels[role]}>{roleTags[role]}</span>;
        })}</span>}
        {option.person && selectedId === undefined && !showJumpTypes && <span className="jumper-option-weight">{option.person.weight} kg</span>}
      </button>)}
      {!options.length && <span>Ei hakutuloksia</span>}
    </div>}
  </div>;
}
