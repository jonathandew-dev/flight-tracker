import { create } from "zustand";
import { SavedTrip, Flight } from "@/utils/types";

interface SavedTripState {
  trips: SavedTrip[];
  addFlight: (tripId: string, flight: Flight) => void;
  // ... other actions: createTrip, deleteTrip, updateTitle, etc.
}

export const useSavedTripStore = create<SavedTripState>((set) => ({
  trips: [],

  addFlight: (tripId, flight) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId ? { ...trip, flights: [...trip.flights, flight] } : trip
      ),
    })),
}));
