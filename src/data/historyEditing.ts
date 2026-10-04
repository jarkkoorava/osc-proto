import { availableJumpTypes, groundPersonError, hasInstructor, MAX_JUMPERS, planes, renumberLoads, studentAltitudes, altitudes, tandemWarnings } from './manifest.ts';
import { membersById, todayDate } from './members.ts';
import type { Load } from './manifest.ts';

export const helsinkiDateTime = (iso: string) => {
  const parts = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Helsinki', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(iso));
  const get = (key: string) => parts.find(part => part.type === key)?.value ?? '';
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${get('hour')}:${get('minute')}` };
};

export const historyTimestamp = (date: string, time: string) => {
  const wall = Date.parse(`${date}T${time}:00Z`);
  if (!Number.isFinite(wall)) return '';
  let instant = wall;
  for (let i = 0; i < 3; i++) {
    const local = helsinkiDateTime(new Date(instant).toISOString());
    instant += wall - Date.parse(`${local.date}T${local.time}:00Z`);
  }
  const iso = new Date(instant).toISOString();
  const check = helsinkiDateTime(iso);
  return check.date === date && check.time === time ? iso : '';
};

export const historyLoadErrors = (load: Load, today = todayDate()): string[] => {
  const errors: string[] = [];
  if (!load.date || !/^\d{4}-\d{2}-\d{2}$/.test(load.date) || !Number.isFinite(Date.parse(load.date)) || new Date(load.date).toISOString().slice(0, 10) !== load.date || load.date > today) errors.push('Valitse kelvollinen lentopäivä, joka ei ole tulevaisuudessa.');
  if (!load.jumpedAt || !Number.isFinite(Date.parse(load.jumpedAt)) || helsinkiDateTime(load.jumpedAt).date !== load.date) errors.push('Tarkista hypyn kellonaika ja päivämäärä.');
  if (!Number.isInteger(load.number) || load.number < 1) errors.push('Pokan numeron pitää olla positiivinen kokonaisluku.');
  if (!planes.includes(load.plane)) errors.push('Valitse lentokone.');
  if (!membersById.get(load.pilotId)?.roles.includes('Pilot')) errors.push('Valitse lentäjä.');
  if (!Number.isFinite(load.fuel) || load.fuel < 0 || load.fuel > 1000) errors.push('Tarkista polttoainemäärä (0–1000 l).');
  if (load.flightTimeMinutes !== undefined && (!Number.isInteger(load.flightTimeMinutes) || load.flightTimeMinutes < 0)) errors.push('Lentoajan pitää olla vähintään nolla kokonaista minuuttia.');
  if (!load.jumps.length || load.jumps.length > MAX_JUMPERS) errors.push(`Pokassa pitää olla 1–${MAX_JUMPERS} hyppääjää.`);
  if (new Set(load.jumps.map(jump => jump.skydiverId)).size !== load.jumps.length) errors.push('Sama hyppääjä voi olla pokassa vain kerran.');
  if (load.jumps.some(jump => jump.skydiverId === load.pilotId)) errors.push('Lentäjä ei voi olla saman pokan hyppääjä.');
  for (const jump of load.jumps) {
    const person = membersById.get(jump.skydiverId);
    if (!person || !availableJumpTypes(person).includes(jump.type)) errors.push('Tarkista hyppääjän rooli ja kelpoisuudet.');
    if (!((jump.type === 'Student' || jump.type === 'Instructor') ? studentAltitudes : altitudes).includes(jump.altitude)) errors.push('Tarkista hyppykorkeus.');
    if (jump.type === 'Instructor' && !altitudes.includes(jump.altitude) && !load.jumps.some(item => item.type === 'Student' && item.instructorId === jump.skydiverId)) errors.push('Hyppymestarin erikoiskorkeus edellytt?? h?nelle osoitettua oppilasta samalla pokalla.');
    if (jump.type === 'Student' && !hasInstructor(jump, load.jumps)) errors.push(`${person?.name ?? 'Oppilas'}: valitse pokassa oleva hyppymestari.`);
  }
  const ground = groundPersonError(load);
  if (ground) errors.push(ground);
  errors.push(...tandemWarnings(load.jumps));
  return [...new Set(errors)];
};

// Stable IDs preserve ledger references. The requested number is a position within the day.
export const replaceHistoryLoad = (loads: Load[], edited: Load): Load[] => {
  const original = loads.find(load => load.id === edited.id);
  if (!original) return loads;
  const affected = new Set([original.date, edited.date]);
  const result = loads.filter(load => !affected.has(load.date));
  for (const date of affected) {
    const day = loads.filter(load => load.date === date && load.id !== edited.id).sort((a, b) => a.number - b.number);
    if (date === edited.date) day.splice(Math.min(Math.max(0, edited.number - 1), day.filter(load => load.status === 'queued' || load.hasBeenSaved).length), 0, { ...edited, groundPerson: undefined, flightState: 'Dropped', status: 'queued', hasBeenSaved: true });
    result.push(...renumberLoads(day));
  }
  return result;
};
