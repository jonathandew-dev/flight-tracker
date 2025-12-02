import axios from "axios";
import ApiError from "../../utils/ApiError";
import { FlightOffer } from "./amadeus.types";
import { mapAmadeusFlightOffers } from "./amadeus.mapper";

const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID!;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET!;
const AMADEUS_BASE_URL = "https://test.api.amadeus.com"; 

let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

// Get OAuth token
async function getAccessToken(): Promise<string> {
  if (accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return accessToken; // use cached token
  }

  const response = await axios.post(
    `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_CLIENT_ID,
      client_secret: AMADEUS_CLIENT_SECRET,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  const token = response.data.access_token;
  if (!token) {
    throw new ApiError(500, "Failed to get access token from Amadeus");
  }

  accessToken = token;
  tokenExpiresAt = Date.now() + response.data.expires_in * 1000 - 5000; // refresh 5s early

  return token; // <-- return token instead of accessToken
}

// Search flights
export const searchFlights = async (origin: string, destination: string, date: string): Promise<FlightOffer[]> => {
  const token = await getAccessToken();

  const response = await axios.get(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { originLocationCode: origin, destinationLocationCode: destination, departureDate: date, adults: 1, max: 5 },
  });

  const rawOffers = response.data.data; // <-- Amadeus returns offers in data array
  if (!rawOffers || !Array.isArray(rawOffers)) {
    throw new ApiError(500, "No flight offers returned from Amadeus");
  }

  return mapAmadeusFlightOffers(rawOffers);
};