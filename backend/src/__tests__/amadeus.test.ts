import 'dotenv/config';
 // src/__tests__/amadeus.test.ts
import { searchFlights } from "../modules/amadeus/amadeus.service";
import { FlightOffer } from "../modules/amadeus/amadeus.types";

describe("Amadeus service", () => {
  it("fetches flights from JFK to LAX", async () => {
    // Call the actual Amadeus API
    const flights: FlightOffer[] = await searchFlights("JFK", "LAX", "2025-12-05");

    // Assert we got results
    expect(flights.length).toBeGreaterThan(0);

    // Assert the first flight has required properties
    const flight = flights[0];
    expect(flight).toHaveProperty("id");
    expect(flight).toHaveProperty("price");
    expect(flight.price.total).toBeDefined();
    expect(flight.price.currency).toBeDefined();
    expect(flight.itineraries.length).toBeGreaterThan(0);

    // Optional: check segments
    flight.itineraries.forEach(itinerary => {
      expect(itinerary.segments.length).toBeGreaterThan(0);
      itinerary.segments.forEach(segment => {
        expect(segment.departure.iataCode).toBeDefined();
        expect(segment.arrival.iataCode).toBeDefined();
        expect(segment.duration).toBeDefined();
      });
    });


   
   
  });
});
