import { FlightOffer } from "./amadeus.types";

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: {
    total: string;
    currency: string;
  };
}

export function mapAmadeusFlightOffer(offer: FlightOffer): Flight {
  const itinerary = offer.itineraries[0];
  const segment = itinerary.segments[0];

  return {
    id: offer.id,
    airline: segment.carrierCode,
    flightNumber: segment.flightNumber,
    origin: segment.departure.iataCode,
    destination: segment.arrival.iataCode,
    departureTime: segment.departure.at,
    
    arrivalTime: segment.arrival.at,
    price: convertPriceToUSD(offer.price),
  };
}

export function mapAmadeusFlightOffers(offers: FlightOffer[]): Flight[] {
  return offers.map(mapAmadeusFlightOffer);
}

function convertPriceToUSD(price: { total: string; currency: string }): { total: string; currency: string } {
  if (price.currency === "USD") return price;

  const rates: Record<string, number> = {
    EUR: 1.07,
    GBP: 1.25,
    CAD: 0.73,
  };

  const amountUSD = parseFloat(price.total) * (rates[price.currency] || 1);
  return { total: amountUSD.toFixed(2), currency: "USD" };
}