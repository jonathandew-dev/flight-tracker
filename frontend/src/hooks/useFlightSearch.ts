// src/hooks/useFlightSearch.ts
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { searchFlights } from "@/api/api";
import { Flight } from "@/utils/types";

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  max?: number;
}

export const useFlightSearch = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: (params: FlightSearchParams) => searchFlights(params),
    onMutate: () => {
      setLoading(true);
      setError("");
      setFlights([]);
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Something went wrong");
    },
    onSuccess: (data: Flight[]) => setFlights(data),
    onSettled: () => setLoading(false),
  });

  const search = (params: FlightSearchParams) => {
    if (!params.originLocationCode || !params.destinationLocationCode || !params.departureDate) {
      setError("Please fill in origin, destination, and departure date");
      return;
    }
    mutation.mutate(params);
  };

  return { flights, loading, error, search };
};
