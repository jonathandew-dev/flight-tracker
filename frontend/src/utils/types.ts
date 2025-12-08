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

export interface User {
  id: string;
  email: string;
  name?: string | null; // optional in case the user hasn't set it yet
  avatarUrl?: string | null; // optional if you want to support user avatars later
}