import axios from "axios";
import { Flight } from "@/utils/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// ---------------------------
// Flight search function
export interface SearchFlightsParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  max?: number;
}

export const searchFlights = async (params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  max?: number;
}): Promise<Flight[]> => {
  const { data } = await api.get("/api/amadeus/search", { params });
  return data;
};