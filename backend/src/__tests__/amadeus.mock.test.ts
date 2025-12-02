// src/__tests__/amadeus.mock.test.ts
import axios from "axios";
import { searchFlights } from "../modules/amadeus/amadeus.service";
import { mapAmadeusFlightOffers } from "../modules/amadeus/amadeus.mapper";
import { FlightOffer } from "../modules/amadeus/amadeus.types";
import ApiError from "../utils/ApiError";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Amadeus service (mocked)", () => {
  const rawOffer = {
    id: "1",
    price: { total: "100", currency: "USD" },
    itineraries: [
      {
        segments: [
          {
            departure: { iataCode: "JFK", at: "2025-12-01T10:00" },
            arrival: { iataCode: "LAX", at: "2025-12-01T13:00" },
            carrierCode: "AA",
            flightNumber: "100",
            duration: "PT6H",
          },
        ],
        duration: "PT6H",
      },
    ],
    airlineCodes: ["AA"],
    numberOfStops: 1,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns mapped flights", async () => {
    // Mock the OAuth token request
    mockedAxios.post.mockResolvedValue({
      data: { access_token: "mocked-token", expires_in: 3600 },
    } as any);

    // Mock the flight search response
    mockedAxios.get.mockResolvedValue({
      data: {
        data: [rawOffer], // <-- wrap in data.data to match service
      },
    } as any);

    const flights: FlightOffer[] = await searchFlights("JFK", "LAX", "2025-12-01");
    expect(flights).toHaveLength(1);
    expect(flights[0].id).toBe("1");
    expect(flights[0].price.total).toBe("100");
    expect(flights[0].itineraries[0].segments[0].departure.iataCode).toBe("JFK");
  });

  it("maps all fields correctly", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { access_token: "mocked-token", expires_in: 3600 },
    } as any);

    mockedAxios.get.mockResolvedValue({
      data: { data: [rawOffer] },
    } as any);

    const flights = await searchFlights("JFK", "LAX", "2025-12-01");
    const mapped = mapAmadeusFlightOffers([rawOffer]);

    // All key fields should match
    expect(flights[0].id).toBe(mapped[0].id);
    expect(flights[0].price.total).toBe(mapped[0].price.total);
    expect(flights[0].itineraries[0].segments[0].carrierCode).toBe(
      mapped[0].itineraries[0].segments[0].carrierCode
    );
  });
});
