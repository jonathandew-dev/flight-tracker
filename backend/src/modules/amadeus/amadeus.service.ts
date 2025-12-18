import axios from "axios";
import ApiError from "../../utils/ApiError.js";
import { Flight } from "./amadeus.types.js";


import { mapAmadeusFlightOffers } from "./amadeus.mapper.js";

const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID!;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET!;
const AMADEUS_BASE_URL = "https://test.api.amadeus.com"; 

let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;



// --- getAccessToken stays the same ---
async function getAccessToken(): Promise<string> {
  if (accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return accessToken; // <-- this is returned
  }

  const response = await axios.post(
    `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_CLIENT_ID,
      client_secret: AMADEUS_CLIENT_SECRET,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const token = response.data.access_token;
  if (!token) {
    throw new ApiError(500, "Failed to get access token from Amadeus");
  }

  accessToken = token;
  tokenExpiresAt = Date.now() + response.data.expires_in * 1000 - 5000;

  return token; // <-- always return token here
}

// --- Replace old searchFlights with this ---
export const searchFlights = async (
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  adults = 1,
  max = 5
): Promise<Flight[]> => {
  const token = await getAccessToken();

  const params: any = {
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate,
    adults,
    max,
  };

  if (returnDate) params.returnDate = returnDate;

  

  try {
    const response = await axios.get(
      `${AMADEUS_BASE_URL}/v2/shopping/flight-offers`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );



    const rawOffers = response.data.data;
    if (!rawOffers || !Array.isArray(rawOffers)) {
      throw new ApiError(500, "No flight offers returned from Amadeus");
    }

    return mapAmadeusFlightOffers(rawOffers);
  } catch (err: any) {
    
    
    throw err;
  }
};
