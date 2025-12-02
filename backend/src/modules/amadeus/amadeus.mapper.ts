import { FlightOffer, Itinerary, Segment, Price } from "./amadeus.types";

export function mapAmadeusFlightOffer(raw: any): FlightOffer {
  // Map itineraries
  const itineraries: Itinerary[] = raw.itineraries?.map((iti: any) => ({
    segments: iti.segments.map((seg: any): Segment => ({
      departure: {
        iataCode: seg.departure.iataCode,
        at: seg.departure.at,
        terminal: seg.departure.terminal,
      },
      arrival: {
        iataCode: seg.arrival.iataCode,
        at: seg.arrival.at,
        terminal: seg.arrival.terminal,
      },
      carrierCode: seg.carrierCode,
      flightNumber: seg.number || "",      // <-- map flight number
      duration: seg.duration,
      aircraft: seg.aircraft?.code,
    })),
    duration: iti.duration,
    stops: iti.segments.length - 1,
  }));

  // Collect all airline codes across itineraries
  const airlineCodes = Array.from(
    new Set(itineraries.flatMap(iti => iti.segments.map(seg => seg.carrierCode)))
  );

  // Total stops across all itineraries
  const numberOfStops = itineraries.reduce((sum, iti) => sum + (iti.segments.length - 1), 0);

  // Price
  const price: Price = {
    total: raw.price?.total || "0",
    currency: raw.price?.currency || "USD",
  };

  // Optional baggage allowance
  let baggageAllowance: string | undefined = undefined;
  if (raw.travelerPricings?.[0]?.fareDetailsBySegment) {
    const baggageInfo = raw.travelerPricings[0].fareDetailsBySegment.map((s: any) => s.bags?.[0]?.description).filter(Boolean);
    if (baggageInfo.length) baggageAllowance = baggageInfo.join(", ");
  }

  // Booking link if available
  const links = raw.offers?.[0]?.links ? { booking: raw.offers[0].links[0]?.href } : undefined;

  return {
    id: raw.id,
    price,
    itineraries,
    airlineCodes,
    numberOfStops,
    baggageAllowance,
    currency: price.currency,
    links,
  };
}

// Optional: map an array
export function mapAmadeusFlightOffers(rawData: any[]): FlightOffer[] {
  return rawData.map(mapAmadeusFlightOffer);
}