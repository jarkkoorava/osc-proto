// Fixed demo data. Regenerate explicitly with scripts/generate-demo-data.mjs.
import type { Load } from "./manifest.ts";

export const historySeed: Load[] = [
  {
    "id": "load-demo-history-1",
    "number": 1,
    "date": "2026-03-01",
    "jumpedAt": "2026-03-01T08:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-044",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-005",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-selma-tuuliranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-tuomas-aavala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-029",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-2",
    "number": 2,
    "date": "2026-03-01",
    "jumpedAt": "2026-03-01T09:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-041",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 13,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-005",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-oskari-lehtokoski",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "PL1"
      }
    ]
  },
  {
    "id": "load-demo-history-3",
    "number": 3,
    "date": "2026-03-01",
    "jumpedAt": "2026-03-01T10:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-044",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-003",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-iida-saviranta",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-veeti-niemela",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-014",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-4",
    "number": 4,
    "date": "2026-03-01",
    "jumpedAt": "2026-03-01T11:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-044",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-005",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "PL1"
      },
      {
        "skydiverId": "member-niilo-lahdemaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "HV1"
      }
    ]
  },
  {
    "id": "load-demo-history-5",
    "number": 5,
    "date": "2026-03-01",
    "jumpedAt": "2026-03-01T12:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 29,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-kerttu-haapaniemi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-001",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-005",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-003",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-6",
    "number": 1,
    "date": "2026-04-11",
    "jumpedAt": "2026-04-11T08:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-043",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 30,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-010",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-kerttu-haapaniemi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-7",
    "number": 2,
    "date": "2026-04-11",
    "jumpedAt": "2026-04-11T09:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-030",
        "type": "Tandem camera",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-026",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-034",
        "type": "Tandem instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-emilia-meriluoto",
        "type": "Tandem student",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-8",
    "number": 3,
    "date": "2026-04-11",
    "jumpedAt": "2026-04-11T10:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-040",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-veeti-niemela",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-arttu-peltola",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-9",
    "number": 4,
    "date": "2026-04-11",
    "jumpedAt": "2026-04-11T11:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 27,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-tuomas-aavala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-sade-kuusilahti",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-005",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-10",
    "number": 5,
    "date": "2026-04-11",
    "jumpedAt": "2026-04-11T12:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 13,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-006",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-sanni-koivukoski",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-006",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-teemu-kiviniemi",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-006",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-006",
        "exercise": "PL2"
      }
    ]
  },
  {
    "id": "load-demo-history-11",
    "number": 1,
    "date": "2026-04-28",
    "jumpedAt": "2026-04-28T08:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-034",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-002",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-022",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-12",
    "number": 2,
    "date": "2026-04-28",
    "jumpedAt": "2026-04-28T09:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-039",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-034",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-nea-hietapelto",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-alina-metsaranta",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "HV2"
      }
    ]
  },
  {
    "id": "load-demo-history-13",
    "number": 3,
    "date": "2026-04-28",
    "jumpedAt": "2026-04-28T10:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 12,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-031",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-031",
        "exercise": "HV1"
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-031",
        "exercise": "PL1"
      },
      {
        "skydiverId": "member-sanni-koivukoski",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-031",
        "exercise": "PL1"
      },
      {
        "skydiverId": "member-nea-hietapelto",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-031",
        "exercise": "PL2"
      }
    ]
  },
  {
    "id": "load-demo-history-14",
    "number": 4,
    "date": "2026-04-28",
    "jumpedAt": "2026-04-28T11:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 26,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-kerttu-haapaniemi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-pihla-koivuvaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-034",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-15",
    "number": 5,
    "date": "2026-04-28",
    "jumpedAt": "2026-04-28T12:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 27,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-hilla-purokivi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-viljami-mantylahti",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-011",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-16",
    "number": 1,
    "date": "2026-05-11",
    "jumpedAt": "2026-05-11T08:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-selma-tuuliranta",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-022",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-029",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-17",
    "number": 2,
    "date": "2026-05-11",
    "jumpedAt": "2026-05-11T09:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 29,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-022",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-roope-metsala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-029",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-18",
    "number": 3,
    "date": "2026-05-11",
    "jumpedAt": "2026-05-11T10:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 30,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-lauri-tuuliniemi",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-029",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-iida-saviranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-19",
    "number": 4,
    "date": "2026-05-11",
    "jumpedAt": "2026-05-11T11:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-011",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-011",
        "exercise": "HV1"
      },
      {
        "skydiverId": "member-niilo-lahdemaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-011",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-011",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-alina-metsaranta",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-011",
        "exercise": "PL2"
      }
    ]
  },
  {
    "id": "load-demo-history-20",
    "number": 5,
    "date": "2026-05-11",
    "jumpedAt": "2026-05-11T12:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 26,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-anni-koivurinne",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-21",
    "number": 1,
    "date": "2026-05-22",
    "jumpedAt": "2026-05-22T08:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 12,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-selma-tuuliranta",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-samu-haapala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-22",
    "number": 2,
    "date": "2026-05-22",
    "jumpedAt": "2026-05-22T09:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 13,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-011",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-joona-hietaranta",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-011",
        "exercise": "PL2"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-011",
        "exercise": "PL1"
      },
      {
        "skydiverId": "member-sanni-koivukoski",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-011",
        "exercise": "HV2"
      }
    ]
  },
  {
    "id": "load-demo-history-23",
    "number": 3,
    "date": "2026-05-22",
    "jumpedAt": "2026-05-22T10:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-040",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-008",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-daniel-pihlajala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-029",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-025",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-011",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-24",
    "number": 4,
    "date": "2026-05-22",
    "jumpedAt": "2026-05-22T11:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 21,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-034",
        "type": "Instructor",
        "altitude": 1800,
        "instructorId": ""
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-teemu-kiviniemi",
        "type": "Student",
        "altitude": 1200,
        "instructorId": "member-demo-034",
        "exercise": "5 sek"
      },
      {
        "skydiverId": "member-sanni-koivukoski",
        "type": "Student",
        "altitude": 1800,
        "instructorId": "member-demo-034",
        "exercise": "15 sek"
      }
    ]
  },
  {
    "id": "load-demo-history-25",
    "number": 5,
    "date": "2026-05-22",
    "jumpedAt": "2026-05-22T12:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 12,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-001",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-matias-korpela",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "PL1"
      },
      {
        "skydiverId": "member-eino-hietala",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-niilo-lahdemaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "PL3"
      }
    ]
  },
  {
    "id": "load-demo-history-26",
    "number": 1,
    "date": "2026-05-31",
    "jumpedAt": "2026-05-31T08:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 13,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-005",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-27",
    "number": 2,
    "date": "2026-05-31",
    "jumpedAt": "2026-05-31T09:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 27,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-034",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-034",
        "exercise": "Ryhmähyppy"
      },
      {
        "skydiverId": "member-nea-hietapelto",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-006",
        "exercise": "Vapaavalintainen"
      }
    ]
  },
  {
    "id": "load-demo-history-28",
    "number": 3,
    "date": "2026-05-31",
    "jumpedAt": "2026-05-31T10:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-022",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-022",
        "exercise": "PL2"
      },
      {
        "skydiverId": "member-demo-012",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-022",
        "exercise": "HV2"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-022",
        "exercise": "HV1"
      }
    ]
  },
  {
    "id": "load-demo-history-29",
    "number": 4,
    "date": "2026-05-31",
    "jumpedAt": "2026-05-31T11:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 29,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-037",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-oona-saarikivi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-30",
    "number": 5,
    "date": "2026-05-31",
    "jumpedAt": "2026-05-31T12:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 30,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-arttu-peltola",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-samu-haapala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-viljami-mantylahti",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-anni-koivurinne",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-31",
    "number": 1,
    "date": "2026-06-09",
    "jumpedAt": "2026-06-09T08:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-kerttu-haapaniemi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-32",
    "number": 2,
    "date": "2026-06-09",
    "jumpedAt": "2026-06-09T09:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 26,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-rami-rysala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-026",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-33",
    "number": 3,
    "date": "2026-06-09",
    "jumpedAt": "2026-06-09T10:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 12,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-selma-tuuliranta",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-anni-koivurinne",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-hilla-purokivi",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-34",
    "number": 4,
    "date": "2026-06-09",
    "jumpedAt": "2026-06-09T11:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 28,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-aada-kivipelto",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-35",
    "number": 5,
    "date": "2026-06-09",
    "jumpedAt": "2026-06-09T12:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 29,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-selma-tuuliranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-hilla-purokivi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-36",
    "number": 1,
    "date": "2026-06-17",
    "jumpedAt": "2026-06-17T08:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-043",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-anni-koivurinne",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-008",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-oona-saarikivi",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-rami-rysala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-37",
    "number": 2,
    "date": "2026-06-17",
    "jumpedAt": "2026-06-17T09:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-005",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-011",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-matias-korpela",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-005",
        "exercise": "Ryhmähyppy"
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-011",
        "exercise": "Vapaavalintainen"
      }
    ]
  },
  {
    "id": "load-demo-history-38",
    "number": 3,
    "date": "2026-06-17",
    "jumpedAt": "2026-06-17T10:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-040",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 13,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-034",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-kerttu-haapaniemi",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-39",
    "number": 4,
    "date": "2026-06-17",
    "jumpedAt": "2026-06-17T11:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-044",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 27,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-029",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-veeti-niemela",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-001",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-40",
    "number": 5,
    "date": "2026-06-17",
    "jumpedAt": "2026-06-17T12:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-043",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-samu-haapala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-41",
    "number": 1,
    "date": "2026-06-25",
    "jumpedAt": "2026-06-25T08:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 12,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-antton-lehtola",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-037",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-009",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-022",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-42",
    "number": 2,
    "date": "2026-06-25",
    "jumpedAt": "2026-06-25T09:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 19,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-005",
        "type": "Instructor",
        "altitude": 1800,
        "instructorId": ""
      },
      {
        "skydiverId": "member-eino-hietala",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-enni-kuusela",
        "type": "Student",
        "altitude": 1200,
        "instructorId": "member-demo-005",
        "exercise": "5 sek"
      },
      {
        "skydiverId": "member-sanni-koivukoski",
        "type": "Student",
        "altitude": 1800,
        "instructorId": "member-demo-005",
        "exercise": "15 sek"
      }
    ]
  },
  {
    "id": "load-demo-history-43",
    "number": 3,
    "date": "2026-06-25",
    "jumpedAt": "2026-06-25T10:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-kerttu-haapaniemi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aada-kivipelto",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-44",
    "number": 4,
    "date": "2026-06-25",
    "jumpedAt": "2026-06-25T11:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-aada-kivipelto",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-034",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-tuomas-aavala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-45",
    "number": 5,
    "date": "2026-06-25",
    "jumpedAt": "2026-06-25T12:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 27,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-arttu-peltola",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-pihla-koivuvaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-46",
    "number": 1,
    "date": "2026-07-02",
    "jumpedAt": "2026-07-02T08:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 19,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-006",
        "type": "Instructor",
        "altitude": 1800,
        "instructorId": ""
      },
      {
        "skydiverId": "member-elsa-metsakivi",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-006",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-sanni-koivukoski",
        "type": "Student",
        "altitude": 1200,
        "instructorId": "member-demo-006",
        "exercise": "5 sek"
      },
      {
        "skydiverId": "member-eino-hietala",
        "type": "Student",
        "altitude": 1800,
        "instructorId": "member-demo-006",
        "exercise": "15 sek"
      }
    ]
  },
  {
    "id": "load-demo-history-47",
    "number": 2,
    "date": "2026-07-02",
    "jumpedAt": "2026-07-02T09:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-veeti-niemela",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-kerttu-haapaniemi",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aava-tammirinne",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-48",
    "number": 3,
    "date": "2026-07-02",
    "jumpedAt": "2026-07-02T10:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 30,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-005",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-011",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-sanni-koivukoski",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-005",
        "exercise": "Ryhmähyppy"
      },
      {
        "skydiverId": "member-demo-013",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-011",
        "exercise": "Vapaavalintainen"
      }
    ]
  },
  {
    "id": "load-demo-history-49",
    "number": 4,
    "date": "2026-07-02",
    "jumpedAt": "2026-07-02T11:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 12,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-029",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-veeti-niemela",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-samu-haapala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-50",
    "number": 5,
    "date": "2026-07-02",
    "jumpedAt": "2026-07-02T12:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 26,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-030",
        "type": "Tandem camera",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-010",
        "type": "Tandem instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-emilia-meriluoto",
        "type": "Tandem student",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-51",
    "number": 1,
    "date": "2026-07-08",
    "jumpedAt": "2026-07-08T08:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-iida-saviranta",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-002",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-52",
    "number": 2,
    "date": "2026-07-08",
    "jumpedAt": "2026-07-08T09:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 28,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-antton-lehtola",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aava-tammirinne",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-53",
    "number": 3,
    "date": "2026-07-08",
    "jumpedAt": "2026-07-08T10:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 12,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-samu-haapala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-linnea-hietakoski",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-tuomas-aavala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-54",
    "number": 4,
    "date": "2026-07-08",
    "jumpedAt": "2026-07-08T11:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 30,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-030",
        "type": "Tandem camera",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-014",
        "type": "Tandem instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-otso-kuusiranta",
        "type": "Tandem student",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-55",
    "number": 5,
    "date": "2026-07-08",
    "jumpedAt": "2026-07-08T12:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-025",
        "type": "Tandem camera",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-anni-koivurinne",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-014",
        "type": "Tandem instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-otso-kuusiranta",
        "type": "Tandem student",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-56",
    "number": 1,
    "date": "2026-07-14",
    "jumpedAt": "2026-07-14T08:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-043",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-006",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-006",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-joona-hietaranta",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-006",
        "exercise": "PL2"
      },
      {
        "skydiverId": "member-matias-korpela",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-006",
        "exercise": "HV1"
      }
    ]
  },
  {
    "id": "load-demo-history-57",
    "number": 2,
    "date": "2026-07-14",
    "jumpedAt": "2026-07-14T09:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-041",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 27,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-aada-kivipelto",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-daniel-pihlajala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-034",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-008",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-58",
    "number": 3,
    "date": "2026-07-14",
    "jumpedAt": "2026-07-14T10:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-041",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 28,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-005",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-kerttu-haapaniemi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-59",
    "number": 4,
    "date": "2026-07-14",
    "jumpedAt": "2026-07-14T11:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-039",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-001",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-matias-korpela",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "PL2"
      },
      {
        "skydiverId": "member-nea-hietapelto",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "PL1"
      },
      {
        "skydiverId": "member-joona-hietaranta",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "HV1"
      }
    ]
  },
  {
    "id": "load-demo-history-60",
    "number": 5,
    "date": "2026-07-14",
    "jumpedAt": "2026-07-14T12:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 30,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-034",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-001",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-joona-hietaranta",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-034",
        "exercise": "Ryhmähyppy"
      },
      {
        "skydiverId": "member-teemu-kiviniemi",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-001",
        "exercise": "Vapaavalintainen"
      }
    ]
  },
  {
    "id": "load-demo-history-61",
    "number": 1,
    "date": "2026-07-21",
    "jumpedAt": "2026-07-21T08:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-041",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-008",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-rami-rysala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-034",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-036",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-62",
    "number": 2,
    "date": "2026-07-21",
    "jumpedAt": "2026-07-21T09:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 13,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-011",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-sanni-koivukoski",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-011",
        "exercise": "HV2"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-011",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-demo-013",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-011",
        "exercise": "HV1"
      }
    ]
  },
  {
    "id": "load-demo-history-63",
    "number": 3,
    "date": "2026-07-21",
    "jumpedAt": "2026-07-21T10:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 27,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-selma-tuuliranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-011",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-rami-rysala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-tuomas-aavala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-64",
    "number": 4,
    "date": "2026-07-21",
    "jumpedAt": "2026-07-21T11:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-samu-haapala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-hilla-purokivi",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-034",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-65",
    "number": 5,
    "date": "2026-07-21",
    "jumpedAt": "2026-07-21T12:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-015",
    "fuel": 50,
    "flightTimeMinutes": 29,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-008",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-003",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-anni-koivurinne",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aada-kivipelto",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-66",
    "number": 1,
    "date": "2026-07-28",
    "jumpedAt": "2026-07-28T08:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-039",
    "groundPersonId": "member-pihla-koivuvaara",
    "fuel": 50,
    "flightTimeMinutes": 30,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-034",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-022",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-034",
        "exercise": "Ryhmähyppy"
      },
      {
        "skydiverId": "member-saara-kivirinne",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-022",
        "exercise": "Vapaavalintainen"
      }
    ]
  },
  {
    "id": "load-demo-history-67",
    "number": 2,
    "date": "2026-07-28",
    "jumpedAt": "2026-07-28T09:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-002",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-selma-tuuliranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-005",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-viljami-mantylahti",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-68",
    "number": 3,
    "date": "2026-07-28",
    "jumpedAt": "2026-07-28T10:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-002",
    "fuel": 50,
    "flightTimeMinutes": 26,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-022",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-005",
        "type": "Instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-eino-hietala",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-022",
        "exercise": "Ryhmähyppy"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 3500,
        "instructorId": "member-demo-005",
        "exercise": "Vapaavalintainen"
      }
    ]
  },
  {
    "id": "load-demo-history-69",
    "number": 4,
    "date": "2026-07-28",
    "jumpedAt": "2026-07-28T11:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-aada-kivipelto",
    "fuel": 35,
    "flightTimeMinutes": 12,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-034",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-saara-kivirinne",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "PL2"
      },
      {
        "skydiverId": "member-joonas-kallionummi",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-nea-hietapelto",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "HV1"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "HV1"
      }
    ]
  },
  {
    "id": "load-demo-history-70",
    "number": 5,
    "date": "2026-07-28",
    "jumpedAt": "2026-07-28T12:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-vaino-korpiniemi",
    "fuel": 35,
    "flightTimeMinutes": 13,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-034",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-028",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "PL1"
      },
      {
        "skydiverId": "member-nea-hietapelto",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "PL2"
      }
    ]
  },
  {
    "id": "load-demo-history-71",
    "number": 1,
    "date": "2026-08-04",
    "jumpedAt": "2026-08-04T08:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-iida-saviranta",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-005",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-matias-korpela",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "HV2"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "PL2"
      },
      {
        "skydiverId": "member-demo-013",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "PL2"
      },
      {
        "skydiverId": "member-nea-hietapelto",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "PL2"
      }
    ]
  },
  {
    "id": "load-demo-history-72",
    "number": 2,
    "date": "2026-08-04",
    "jumpedAt": "2026-08-04T09:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-029",
    "fuel": 50,
    "flightTimeMinutes": 21,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-022",
        "type": "Instructor",
        "altitude": 1800,
        "instructorId": ""
      },
      {
        "skydiverId": "member-sanni-koivukoski",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-022",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-joona-hietaranta",
        "type": "Student",
        "altitude": 1200,
        "instructorId": "member-demo-022",
        "exercise": "5 sek"
      },
      {
        "skydiverId": "member-nea-hietapelto",
        "type": "Student",
        "altitude": 1800,
        "instructorId": "member-demo-022",
        "exercise": "15 sek"
      }
    ]
  },
  {
    "id": "load-demo-history-73",
    "number": 3,
    "date": "2026-08-04",
    "jumpedAt": "2026-08-04T10:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-ronja-havumaki",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-arttu-peltola",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-hilla-purokivi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-rami-rysala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-005",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-74",
    "number": 4,
    "date": "2026-08-04",
    "jumpedAt": "2026-08-04T11:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-aada-kivipelto",
    "fuel": 50,
    "flightTimeMinutes": 19,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-001",
        "type": "Instructor",
        "altitude": 1800,
        "instructorId": ""
      },
      {
        "skydiverId": "member-matias-korpela",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-joona-hietaranta",
        "type": "Student",
        "altitude": 1200,
        "instructorId": "member-demo-001",
        "exercise": "5 sek"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1800,
        "instructorId": "member-demo-001",
        "exercise": "15 sek"
      }
    ]
  },
  {
    "id": "load-demo-history-75",
    "number": 5,
    "date": "2026-08-04",
    "jumpedAt": "2026-08-04T12:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-040",
    "groundPersonId": "member-luka-metsaniemi",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-034",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-nea-hietapelto",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "HV1"
      },
      {
        "skydiverId": "member-sanni-koivukoski",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-034",
        "exercise": "PL1"
      }
    ]
  },
  {
    "id": "load-demo-history-76",
    "number": 1,
    "date": "2026-08-12",
    "jumpedAt": "2026-08-12T08:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-rasmus-lehtoranta",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-siiri-kalliovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aada-kivipelto",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-77",
    "number": 2,
    "date": "2026-08-12",
    "jumpedAt": "2026-08-12T09:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-vaino-korpiniemi",
    "fuel": 50,
    "flightTimeMinutes": 18,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-001",
        "type": "Instructor",
        "altitude": 1800,
        "instructorId": ""
      },
      {
        "skydiverId": "member-niilo-lahdemaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 1200,
        "instructorId": "member-demo-001",
        "exercise": "5 sek"
      },
      {
        "skydiverId": "member-matias-korpela",
        "type": "Student",
        "altitude": 1800,
        "instructorId": "member-demo-001",
        "exercise": "15 sek"
      }
    ]
  },
  {
    "id": "load-demo-history-78",
    "number": 3,
    "date": "2026-08-12",
    "jumpedAt": "2026-08-12T10:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-aarni-kallioranta",
    "fuel": 35,
    "flightTimeMinutes": 13,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-001",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-030",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aada-kivipelto",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-79",
    "number": 4,
    "date": "2026-08-12",
    "jumpedAt": "2026-08-12T11:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-025",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-roope-metsala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-001",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-80",
    "number": 5,
    "date": "2026-08-12",
    "jumpedAt": "2026-08-12T12:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-viljami-mantylahti",
    "fuel": 50,
    "flightTimeMinutes": 26,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-lauri-tuuliniemi",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-oona-saarikivi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aada-kivipelto",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-81",
    "number": 1,
    "date": "2026-08-21",
    "jumpedAt": "2026-08-21T08:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-044",
    "groundPersonId": "member-iida-saviranta",
    "fuel": 50,
    "flightTimeMinutes": 27,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-anni-koivurinne",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-roope-metsala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-002",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-82",
    "number": 2,
    "date": "2026-08-21",
    "jumpedAt": "2026-08-21T09:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-aava-tammirinne",
    "fuel": 35,
    "flightTimeMinutes": 13,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-005",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "HV3"
      },
      {
        "skydiverId": "member-demo-012",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "HV2"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-005",
        "exercise": "PL2"
      }
    ]
  },
  {
    "id": "load-demo-history-83",
    "number": 3,
    "date": "2026-08-21",
    "jumpedAt": "2026-08-21T10:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-001",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-022",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-tuomas-aavala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-026",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-005",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-031",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-84",
    "number": 4,
    "date": "2026-08-21",
    "jumpedAt": "2026-08-21T11:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-ronja-havumaki",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-026",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-005",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-001",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-85",
    "number": 5,
    "date": "2026-08-21",
    "jumpedAt": "2026-08-21T12:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-002",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-aada-kivipelto",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-samu-haapala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-tuomas-aavala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-86",
    "number": 1,
    "date": "2026-09-01",
    "jumpedAt": "2026-09-01T08:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-sade-kuusilahti",
    "fuel": 50,
    "flightTimeMinutes": 26,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-030",
        "type": "Tandem camera",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-034",
        "type": "Tandem instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-emilia-meriluoto",
        "type": "Tandem student",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-87",
    "number": 2,
    "date": "2026-09-01",
    "jumpedAt": "2026-09-01T09:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-005",
    "fuel": 50,
    "flightTimeMinutes": 27,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-026",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-034",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-anni-koivurinne",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-veeti-niemela",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-mila-lehtovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-88",
    "number": 3,
    "date": "2026-09-01",
    "jumpedAt": "2026-09-01T10:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-oona-saarikivi",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-001",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-sanni-koivukoski",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "HV1"
      },
      {
        "skydiverId": "member-santeri-koivula",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "PL2"
      },
      {
        "skydiverId": "member-nea-hietapelto",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "HV3"
      }
    ]
  },
  {
    "id": "load-demo-history-89",
    "number": 4,
    "date": "2026-09-01",
    "jumpedAt": "2026-09-01T11:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-031",
    "fuel": 35,
    "flightTimeMinutes": 12,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-kerttu-haapaniemi",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aarni-kallioranta",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-rami-rysala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-006",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-90",
    "number": 5,
    "date": "2026-09-01",
    "jumpedAt": "2026-09-01T12:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-034",
    "fuel": 50,
    "flightTimeMinutes": 30,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-005",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-026",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aada-kivipelto",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-029",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-91",
    "number": 1,
    "date": "2026-09-16",
    "jumpedAt": "2026-09-16T08:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-rasmus-lehtoranta",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-030",
        "type": "Tandem camera",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-selma-tuuliranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-034",
        "type": "Tandem instructor",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-otso-kuusiranta",
        "type": "Tandem student",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-92",
    "number": 2,
    "date": "2026-09-16",
    "jumpedAt": "2026-09-16T09:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-017",
    "fuel": 35,
    "flightTimeMinutes": 15,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-001",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-eemil-lehtomaki",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-enni-kuusela",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "HV1"
      },
      {
        "skydiverId": "member-eino-hietala",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-001",
        "exercise": "HV1"
      }
    ]
  },
  {
    "id": "load-demo-history-93",
    "number": 3,
    "date": "2026-09-16",
    "jumpedAt": "2026-09-16T10:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-demo-002",
    "fuel": 50,
    "flightTimeMinutes": 27,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-veeti-niemela",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-011",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-kerttu-haapaniemi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-selma-tuuliranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-94",
    "number": 4,
    "date": "2026-09-16",
    "jumpedAt": "2026-09-16T11:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-rasmus-lehtoranta",
    "fuel": 50,
    "flightTimeMinutes": 28,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-iida-saviranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-viljami-mantylahti",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-tuomas-aavala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-005",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-95",
    "number": 5,
    "date": "2026-09-16",
    "jumpedAt": "2026-09-16T12:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-042",
    "groundPersonId": "member-samu-haapala",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-tuomas-aavala",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-valtteri-purovaara",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-veeti-niemela",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-008",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-96",
    "number": 1,
    "date": "2026-10-20",
    "jumpedAt": "2026-10-20T08:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-017",
    "fuel": 50,
    "flightTimeMinutes": 30,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-022",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-anni-koivurinne",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-selma-tuuliranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-hilla-purokivi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-97",
    "number": 2,
    "date": "2026-10-20",
    "jumpedAt": "2026-10-20T09:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-demo-002",
    "fuel": 50,
    "flightTimeMinutes": 25,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-026",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-022",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-033",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-aleksi-rantakallio",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-kerttu-haapaniemi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-98",
    "number": 3,
    "date": "2026-10-20",
    "jumpedAt": "2026-10-20T10:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-043",
    "groundPersonId": "member-demo-007",
    "fuel": 50,
    "flightTimeMinutes": 26,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-anni-koivurinne",
        "type": "License",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-022",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-arttu-peltola",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-iida-saviranta",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  },
  {
    "id": "load-demo-history-99",
    "number": 4,
    "date": "2026-10-20",
    "jumpedAt": "2026-10-20T11:30:00Z",
    "plane": "OH-EKO",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-viivi-jokiranta",
    "fuel": 35,
    "flightTimeMinutes": 14,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-demo-022",
        "type": "Instructor",
        "altitude": 1000,
        "instructorId": ""
      },
      {
        "skydiverId": "member-teemu-kiviniemi",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-022",
        "exercise": "PL2"
      },
      {
        "skydiverId": "member-joona-hietaranta",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-022",
        "exercise": "PL1"
      },
      {
        "skydiverId": "member-nea-hietapelto",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-022",
        "exercise": "PL3"
      },
      {
        "skydiverId": "member-saara-kivirinne",
        "type": "Student",
        "altitude": 1000,
        "instructorId": "member-demo-022",
        "exercise": "HV2"
      }
    ]
  },
  {
    "id": "load-demo-history-100",
    "number": 5,
    "date": "2026-10-20",
    "jumpedAt": "2026-10-20T12:30:00Z",
    "plane": "OH-CVE",
    "pilotId": "member-demo-045",
    "groundPersonId": "member-roope-metsala",
    "fuel": 50,
    "flightTimeMinutes": 28,
    "status": "queued",
    "hasBeenSaved": true,
    "flightState": "Dropped",
    "jumps": [
      {
        "skydiverId": "member-hilla-purokivi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-tuomas-aavala",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-demo-026",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      },
      {
        "skydiverId": "member-ella-rautaniemi",
        "type": "License",
        "altitude": 3500,
        "instructorId": ""
      }
    ]
  }
];
