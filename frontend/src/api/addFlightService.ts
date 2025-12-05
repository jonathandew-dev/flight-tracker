// src/api/addFlightService.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./authService"; // shared axios instance
import { SavedTrip,Flight } from "../utils/types";


interface AddFlightVariables {
  tripId: string;
  flight: Flight;
}

export const useAddFlight = () => {
  const queryClient = useQueryClient();

  return useMutation<SavedTrip, Error, AddFlightVariables>({
    mutationFn: async ({ tripId, flight }: AddFlightVariables) => {
      if (!tripId) throw new Error("Trip ID is required");

      const { data } = await api.post<SavedTrip>(
        `/api/saved-trips/${tripId}/flights`,
        flight, // send full Flight object
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedTrips"] });
    },
  });
};

// --- Delete Flight ---
export const useDeleteFlight = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { tripId: string; flightId: string }
  >({
    mutationFn: async ({ tripId, flightId }) => {
      await api.delete(`/api/saved-trips/${tripId}/flights/${flightId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedTrips"] });
    },
  });
};
