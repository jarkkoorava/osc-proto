export const roleLabels: Record<string, string> = {
  Licensed: "Lisenssihyppääjä",
  Student: "Oppilas",
  Instructor: "Hyppymestari",
  "Tandem instructor": "Tandemhyppymestari",
  "Tandem student": "Tandemoppilas",
  "Tandem camera": "Tandemkuvaaja",
  "SIL-Coach": "Vapaapudotuskouluttaja",
  Pilot: "Lentäjä",
};
export const roleTags: Record<string, string> = {
  Licensed: "L",
  Student: "O",
  Instructor: "HM",
  "Tandem instructor": "THM",
  "Tandem student": "TO",
  "Tandem camera": "TK",
  "SIL-Coach": "VPK",
  Pilot: "P",
};
export const jumpTypeLabel = (type: string) =>
  type === "License" ? "Lisenssihyppy" : (roleLabels[type] ?? type);
export const stateLabels: Record<string, string> = {
  Planning: "Suunniteltu",
  "At the plane": "Koneella",
  "In the air": "Ilmassa",
  Dropped: "Hypätty",
};
export const dragAccessibility = {
  screenReaderInstructions: {
    draggable:
      "Aloita siirto painamalla välilyöntiä. Siirrä nuolinäppäimillä ja pudota painamalla välilyöntiä uudelleen. Peruuta Esc-näppäimellä.",
  },
  announcements: {
    onDragStart: () => "Siirto aloitettu.",
    onDragOver: () => "Siirron kohde vaihtui.",
    onDragEnd: () => "Siirto päättynyt.",
    onDragCancel: () => "Siirto peruutettu.",
  },
};
export const formatNumber = (value: number, digits = 0) =>
  value.toLocaleString("fi-FI", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
