import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SavedTrip, Flight } from "../utils/types.js";
import { api } from "./authService.js";

// --- Fetch Saved Trips ---
export const useSavedTrips = () =>
  useQuery<SavedTrip[], Error>({
    queryKey: ["savedTrips"],
    queryFn: async () => {
      const { data } = await api.get<SavedTrip[]>("/api/saved-trips");
      return data;
    },
  });


// --- Create Saved Trip ---
export const useCreateSavedTrip = () => {
  const queryClient = useQueryClient();

  return useMutation<SavedTrip, Error, { title: string; flights: Flight[] }>({
    mutationFn: async (newTrip) => {
      const { data } = await api.post<SavedTrip>("/api/saved-trips", newTrip);
      return data;
    },
    onSuccess: (newTrip) => {
      queryClient.setQueryData<SavedTrip[]>(["savedTrips"], (old) => old ? [...old, newTrip] : [newTrip]);
    },
  });
};

// --- Update Saved Trip ---
export const useUpdateSavedTrip = () => {
  const queryClient = useQueryClient();

  return useMutation<SavedTrip, Error, { id: string; title: string }>({
    mutationFn: async ({ id, title }) => {
      const { data } = await api.put<SavedTrip>(`/api/saved-trips/${id}`, { title });
      return data;
    },
    onSuccess: (updatedTrip) => {
      queryClient.setQueryData<SavedTrip[]>(["savedTrips"], (old) =>
        old ? old.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)) : [updatedTrip]
      );
    },
  });
};

// --- Delete Saved Trip ---
export const useDeleteSavedTrip = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await api.delete(`/api/saved-trips/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<SavedTrip[]>(["savedTrips"], (old) =>
        old ? old.filter((t) => t.id !== id) : []
      );
    },
  });
};

// --- Add Flight to Trip ---
export const useAddFlightToTrip = () => {
  const queryClient = useQueryClient();

  return useMutation<SavedTrip, Error, { tripId: string; flight: Flight }>({
    mutationFn: async ({ tripId, flight }) => {
      const { data } = await api.post<SavedTrip>(
        `/api/saved-trips/${tripId}/flights`,
        flight
      );
      return data;
    },
    onSuccess: (updatedTrip) => {
      queryClient.setQueryData<SavedTrip[]>(["savedTrips"], (old) =>
        old ? old.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)) : [updatedTrip]
      );
    },
  });
};

// --- Delete Flight ---
export const useDeleteFlight = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { tripId: string; flightId: string }>({
    mutationFn: async ({ tripId, flightId }) => {
      await api.delete(`/api/saved-trips/${tripId}/flights/${flightId}`);
    },
    onSuccess: (_, { tripId, flightId }) => {
      queryClient.setQueryData<SavedTrip[]>(["savedTrips"], (old) =>
        old
          ? old.map((trip) =>
              trip.id === tripId
                ? { ...trip, flights: trip.flights.filter((f) => f.id !== flightId) }
                : trip
            )
          : []
      );
    },
  });
};