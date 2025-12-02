import request from "supertest";
import app from "../app";
import * as amadeusService from "../modules/amadeus/amadeus.service";
import { mockedPrisma } from "../helpers/mockPrisma"; // use mocked prisma

// Mock Amadeus service
jest.mock("../modules/amadeus/amadeus.service");

describe("GET /api/flights/search", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns 200 with flights when valid query", async () => {
    const fakeFlights = [{ id: "1", price: { total: "100", currency: "EUR" } }];
    (amadeusService.searchFlights as jest.Mock).mockResolvedValue(fakeFlights);

    const res = await request(app)
      .get("/api/flights/search")
      .query({ origin: "JFK", destination: "LAX", date: "2025-12-01" });

    expect(res.status).toBe(200);
    expect(res.body.flights).toEqual(fakeFlights); // <-- changed from res.body.data
  });

  test("returns 400 when query missing", async () => {
    const res = await request(app)
      .get("/api/flights/search")
      .query({ origin: "J", destination: "LAX" }); // missing date

    expect(res.status).toBe(400);
  });
});
