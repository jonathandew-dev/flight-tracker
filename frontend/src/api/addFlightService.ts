// src/api/addFlightService.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./authService"; // shared axios instance
import { SavedTrip } from "../utils/types";

interface FlightInput {
  flightNumber: string;
  origin: string;
  destination: string;
}

interface AddFlightVariables {
  tripId: string;
  flight: FlightInput;
}

export const useAddFlight = () => {
  const queryClient = useQueryClient();

  return useMutation<SavedTrip, Error, AddFlightVariables>({
    mutationFn: async ({ tripId, flight }: AddFlightVariables) => {
      if (!tripId) throw new Error("Trip ID is required");

      const { data } = await api.post<SavedTrip>(
        `/api/saved-trips/${tripId}/flights`,
        flight,
        {
          headers: { "Content-Type": "application/json" }, // enforce JSON
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedTrips"] }); // refresh saved trips
    },
  });
};