// src/utils/types.ts
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: {
    total: string; // already converted to USD
    currency: string;
  };
}

export interface SavedTrip {
  id: string;
  title: string;
  flights: Flight[];
}

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}


export const carriers: Record<string, string> = {
  AA: "American Airlines",
  AC: "Air Canada",
  AF: "Air France",
  AS: "Alaska Airlines",
  AY: "Finnair",
  BA: "British Airways",
  B6: "JetBlue Airways",
  CX: "Cathay Pacific",
  DL: "Delta Airlines",
  EK: "Emirates",
  EY: "Etihad Airways",
  F9: "Frontier Airlines",
  HA: "Hawaiian Airlines",
  IB: "Iberia",
  JL: "Japan Airlines",
  KE: "Korean Air",
  KL: "KLM Royal Dutch Airlines",
  LH: "Lufthansa",
  LX: "Swiss International Air Lines",
  MS: "EgyptAir",
  NK: "Spirit Airlines",
  NZ: "Air New Zealand",
  OS: "Austrian Airlines",
  OZ: "Asiana Airlines",
  QR: "Qatar Airways",
  SA: "South African Airways",
  SK: "SAS Scandinavian Airlines",
  SQ: "Singapore Airlines",
  TG: "Thai Airways",
  TK: "Turkish Airlines",
  UA: "United Airlines",
  VX: "Virgin America",
  WN: "Southwest Airlines",
  WS: "WestJet",
  QF: "Qantas",
  SN: "Brussels Airlines",
  FJ: "Fiji Airways",
  SU: "Aeroflot Russian Airlines",
  CI: "China Airlines",
  BR: "EVA Air",
  GA: "Garuda Indonesia",
  MH: "Malaysia Airlines",
  AI: "Air India",
  ET: "Ethiopian Airlines",
  LA: "LATAM Airlines",
  AV: "Avianca",
  AR: "Aerolineas Argentinas",
  CM: "Copa Airlines",
  TP: "TAP Air Portugal",
  AZ: "Alitalia",
};
