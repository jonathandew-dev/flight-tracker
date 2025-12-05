import { create } from "zustand";

interface SavedTripStore {
  trips: any[];
  setTrips: (trips: any[]) => void;
}

export const useSavedTripStore = create<SavedTripStore>((set) => ({
  trips: [],
  setTrips: (trips) => set({ trips }),
}));