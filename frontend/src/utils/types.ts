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
    total: string;   // already converted to USD
    currency: string;
  };
}

export interface SavedTrip {
  id: string;
  title: string;
  flights: Flight[];
}
