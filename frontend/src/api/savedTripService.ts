import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { SavedTrip,Flight } from "../utils/types.js";
import {api} from "./authService.js"

// --- Fetch Saved Trips ---
export const useSavedTrips = () =>
  useQuery<SavedTrip[], Error>({
    queryKey: ["savedTrips"],
    queryFn: async (): Promise<SavedTrip[]> => {
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["savedTrips"] }),
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["savedTrips"] }),
  });
};

// --- Delete Saved Trip ---
export const useDeleteSavedTrip = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await api.delete(`/api/saved-trips/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["savedTrips"] }),
  });
};
