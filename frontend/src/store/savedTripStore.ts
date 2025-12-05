import { create } from "zustand";
import { SavedTrip, Flight } from "@/utils/types";
import { v4 as uuidv4 } from "uuid"; // npm install uuid

interface SavedTripState {
  trips: SavedTrip[];
  addFlight: (tripId: string, flight: Flight) => void;
}

export const useSavedTripStore = create<SavedTripState>((set) => ({
  trips: JSON.parse(localStorage.getItem("savedTrips") || "[]"),

  addFlight: (tripId, flight) => {
    set((state) => {
      const updated = state.trips.map((trip) => {
        if (trip.id !== tripId) return trip;

        // Check if flight already exists by some unique flight property
        const exists = trip.flights.some(
          (f) => f.flightNumber === flight.flightNumber && f.departureTime === flight.departureTime
        );

        if (exists) return trip;

        // Assign a unique id if flight doesn't have one
        const flightWithId = { ...flight, id: flight.id || uuidv4() };

        return {
          ...trip,
          flights: [...trip.flights, flightWithId],
        };
      });

      localStorage.setItem("savedTrips", JSON.stringify(updated));
      return { trips: updated };
    });
  },
}));
