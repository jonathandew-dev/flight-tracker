// src/api/savedTripService.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SavedTrip, Flight } from "../utils/types.js";
import { useAuthStore, api } from "@/store/authStore";

// --------------------
// Helper to ensure Authorization header is always set
// --------------------
const ensureAuthHeader = () => {
  const token = useAuthStore.getState().accessToken;
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// --------------------
// Fetch Saved Trips
// --------------------
export const useSavedTrips = () =>
  useQuery<SavedTrip[], Error>({
    queryKey: ["savedTrips"],
    queryFn: async () => {
      ensureAuthHeader();
      const { data } = await api.get<SavedTrip[]>("/api/saved-trips");
      return data;
    },
  });

// --------------------
// Create Saved Trip
// --------------------
export const useCreateSavedTrip = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SavedTrip,
    Error,
    { title?: string; flights?: Flight[] },
    { previousTrips?: SavedTrip[] }
  >({
    mutationFn: async (newTrip) => {
      ensureAuthHeader();
      const { data } = await api.post<SavedTrip>("/api/saved-trips", {
        title: newTrip.title ?? "Untitled Trip",
        flights: newTrip.flights ?? [],
      });
      return data;
    },
    onMutate: async (newTrip) => {
      await queryClient.cancelQueries({ queryKey: ["savedTrips"] });
      const previousTrips = queryClient.getQueryData<SavedTrip[]>(["savedTrips"]);

      const tempTrip: SavedTrip = {
        id: "temp-" + Math.random().toString(36).substring(2, 9),
        title: newTrip.title ?? "Untitled Trip",
        flights: newTrip.flights ?? [],
      };

      queryClient.setQueryData<SavedTrip[]>(["savedTrips"], (old) =>
        old ? [...old, tempTrip] : [tempTrip]
      );

      return { previousTrips };
    },
    onError: (_, __, context) => {
      if (context?.previousTrips) {
        queryClient.setQueryData(["savedTrips"], context.previousTrips);
      }
    },
    onSuccess: (createdTrip) => {
      queryClient.setQueryData<SavedTrip[]>(["savedTrips"], (old) =>
        old
          ? old.map((t) => (t.id.startsWith("temp-") ? createdTrip : t))
          : [createdTrip]
      );
    },
  });
};

// --------------------
// Update Saved Trip
// --------------------
export const useUpdateSavedTrip = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SavedTrip,
    Error,
    { id: string; title: string },
    { previousTrips?: SavedTrip[] }
  >({
    mutationFn: async ({ id, title }) => {
      ensureAuthHeader();
      const { data } = await api.put<SavedTrip>(`/api/saved-trips/${id}`, { title });
      return data;
    },
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries({ queryKey: ["savedTrips"] });
      const previousTrips = queryClient.getQueryData<SavedTrip[]>(["savedTrips"]);

      queryClient.setQueryData<SavedTrip[]>(["savedTrips"], (old) =>
        old ? old.map((t) => (t.id === id ? { ...t, title } : t)) : []
      );

      return { previousTrips };
    },
    onError: (_, __, context) => {
      if (context?.previousTrips) {
        queryClient.setQueryData(["savedTrips"], context.previousTrips);
      }
    },
  });
};

// --------------------
// Delete Saved Trip
// --------------------
export const useDeleteSavedTrip = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, { previousTrips?: SavedTrip[] }>({
    mutationFn: async (id) => {
      ensureAuthHeader();
      await api.delete(`/api/saved-trips/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["savedTrips"] });
      const previousTrips = queryClient.getQueryData<SavedTrip[]>(["savedTrips"]);

      queryClient.setQueryData<SavedTrip[]>(["savedTrips"], (old) =>
        old ? old.filter((t) => t.id !== id) : []
      );

      return { previousTrips };
    },
    onError: (_, __, context) => {
      if (context?.previousTrips) {
        queryClient.setQueryData(["savedTrips"], context.previousTrips);
      }
    },
  });
};

// --------------------
// Add Flight to Trip
// --------------------
export const useAddFlightToTrip = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SavedTrip,
    Error,
    { tripId: string; flight: Flight },
    { previousTrips?: SavedTrip[] }
  >({
    mutationFn: async ({ tripId, flight }) => {
      ensureAuthHeader();
      const { data } = await api.post<SavedTrip>(`/api/saved-trips/${tripId}/flights`, flight);
      return data;
    },
    onMutate: async ({ tripId, flight }) => {
      await queryClient.cancelQueries({ queryKey: ["savedTrips"] });
      const previousTrips = queryClient.getQueryData<SavedTrip[]>(["savedTrips"]);

      const newTrips = previousTrips?.map((t) =>
        t.id === tripId ? { ...t, flights: [...t.flights, flight] } : t
      );

      queryClient.setQueryData(["savedTrips"], newTrips);
      return { previousTrips };
    },
    onError: (_, __, context) => {
      if (context?.previousTrips) queryClient.setQueryData(["savedTrips"], context.previousTrips);
    },
    onSuccess: (updatedTrip) => {
      queryClient.setQueryData<SavedTrip[]>(["savedTrips"], (old) =>
        old ? old.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)) : [updatedTrip]
      );
    },
  });
};

// --------------------
// Delete Flight from Trip
// --------------------
export const useDeleteFlight = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { tripId: string; flightId: string },
    { previousTrips?: SavedTrip[] }
  >({
    mutationFn: async ({ tripId, flightId }) => {
      ensureAuthHeader();
      await api.delete(`/api/saved-trips/${tripId}/flights/${flightId}`);
    },
    onMutate: async ({ tripId, flightId }) => {
      await queryClient.cancelQueries({ queryKey: ["savedTrips"] });
      const previousTrips = queryClient.getQueryData<SavedTrip[]>(["savedTrips"]);

      const newTrips = previousTrips?.map((t) =>
        t.id === tripId
          ? { ...t, flights: t.flights.filter((f) => f.id !== flightId) }
          : t
      );

      queryClient.setQueryData(["savedTrips"], newTrips);
      return { previousTrips };
    },
    onError: (_, __, context) => {
      if (context?.previousTrips) queryClient.setQueryData(["savedTrips"], context.previousTrips);
    },
  });
};
