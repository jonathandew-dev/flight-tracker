export interface Price {
  total: string; // total amount
  currency: string; 
}

export interface Segment {
  departure: {
    iataCode: string;
    at: string; // ISO date-time string
    terminal?: string;
  };
  arrival: {
    iataCode: string;
    at: string;
    terminal?: string;
  };
  carrierCode: string;   // airline code
  flightNumber: string;
  duration: string;      // ISO 8601 duration
  aircraft?: string;     // optional aircraft code
}

export interface Itinerary {
  segments: Segment[];
  duration: string; // total duration of itinerary
  stops?: number;   // total stops in itinerary
}

export interface FlightOffer {
  id: string;
  price: Price;
  itineraries: Itinerary[];
  airlineCodes?: string[];       // all airlines involved
  numberOfStops?: number;        // total stops across itineraries
  baggageAllowance?: string;     // optional, if available
  currency?: string;             // duplicate convenience field
  links?: {
    booking: string;             // link to booking page if available
  };
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: Price;
}