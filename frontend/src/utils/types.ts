export interface SavedTrip {
  id: string;
  title: string;
  flights: any[]; 
}

export interface Flight {
  flightNumber: string;
  origin: string;
  destination: string;
  date?: string;
  id?: string; 
}