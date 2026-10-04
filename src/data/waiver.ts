export type MemberDetails = {
  silMember: boolean | null;
  insuranceNumber: string;
  phone: string;
  address: string;
  postalCode: string;
  birthDate: string;
  license: "" | "Student" | "A" | "B" | "C" | "D" | "None";
  totalJumps: string;
  jumpsLastYear: string;
  mainCanopyModel: string;
  mainCanopySize: string;
  reserveCanopyModel: string;
  reserveCanopySize: string;
  containerModel: string;
  aadModel: string;
  inspectionsValidUntil: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  clubGearOnly: boolean;
  totalFlightHours: string;
  totalFlights: string;
  skydiveFlights: string;
  skydiveFlightHours: string;
  sepValidUntil: string;
  englishExamValidUntil: string;
  medicalValidUntil: string;
};

export const emptyMemberDetails = (): MemberDetails => ({
  silMember: null, insuranceNumber: "", phone: "", address: "", postalCode: "", birthDate: "",
  license: "", totalJumps: "", jumpsLastYear: "", mainCanopyModel: "", mainCanopySize: "",
  reserveCanopyModel: "", reserveCanopySize: "", containerModel: "", aadModel: "",
  inspectionsValidUntil: "", emergencyName: "", emergencyRelation: "", emergencyPhone: "",
  clubGearOnly: false, totalFlightHours: "", totalFlights: "", skydiveFlights: "", skydiveFlightHours: "",
  sepValidUntil: "", englishExamValidUntil: "", medicalValidUntil: "",
});

export const waiverTerms = [
  "Kerhon hyppytoiminnan ohje",
  "Kerhon säännöt",
  "Suomen ilmailulaki",
  "Traficomin määräys OPS M6-1",
  "Laskuvarjohyppääjän toiminnalliset ohjeet ja kelpoisuusvaatimukset",
  "Kerhon hallituksen, koulutuspäällikön, turvallisuuspäällikön ja/tai pokanvanhimman antamat ohjeet ja käskyt",
];

export const wingLoading = (weightKg: number, areaSqFt: number) =>
  weightKg > 0 && areaSqFt > 0 ? weightKg * 2.2046226218 / areaSqFt : null;

export type Waiver = {
  type: WaiverType;
  memberId: string;
  submittedAt: string;
  name: string;
  email: string;
  city: string;
  weight: number;
  details: MemberDetails;
  acceptedTerms: boolean[];
  marketingConsent: boolean;
  review?: {
    checks: boolean[];
    note: string;
    savedAt: string;
  };
};

export const jumperReviewChecks = [
  "Hyppääjän henkilöllisyys.",
  "Lisenssin voimassaolo tai muu hyppykokemuksen osoittava asiakirja.",
  "SIL-jäsenyys tai asiakirja josta ilmenee 3. osapuolen vakuutus 1M euron asti.",
  "Varusteiden tarkastukset ja VV:n pakkaus voimassa.",
  "Varusteet ovat hyppääjän kokemukselle sopivat.",
];
export const pilotReviewChecks = [
  "Lentäjän henkilöllisyys",
  "Lupakirjan, kelpoisuuksien ja medikaalin voimassaolo",
];

export const waiverTypeLabels = {
  licensed: "Lisenssihyppääjä",
  basic: "Alkeiskurssi",
  pilot: "Lentäjä",
} as const;
export type WaiverType = keyof typeof waiverTypeLabels;
