export interface SavedTrip {
  id: string;
  title: string;
  flights: Flight[]; 
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}