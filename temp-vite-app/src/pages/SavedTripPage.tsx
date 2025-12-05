import React from "react";
import {
  useSavedTrips,
  useCreateSavedTrip,
  useUpdateSavedTrip,
  useDeleteSavedTrip,
} from "../api/savedTripService";
import { useAddFlight, useDeleteFlight } from "../api/addFlightService";
import TripCard from "../components/TripCard";
import { Button } from "../components/Button";
import { SavedTrip, Flight } from "../utils/types";
import { Plus } from "lucide-react";

const SavedTripPage: React.FC = () => {
  const { data: trips, isLoading, isError, error } = useSavedTrips();
  const createTrip = useCreateSavedTrip();
  const updateTrip = useUpdateSavedTrip();
  const deleteTrip = useDeleteSavedTrip();
  const addFlight = useAddFlight();
  const deleteFlight = useDeleteFlight();

  const safeTrips: SavedTrip[] = Array.isArray(trips) ? trips : [];

  const handleAddTrip = () =>
    createTrip.mutate({ title: `Trip ${Date.now()}`, flights: [] });

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Saved Trips</h1>

        <Button
          onClick={handleAddTrip}
          className="flex items-center gap-2 mb-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg shadow"
        >
          <Plus size={16} /> Add Trip
        </Button>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md p-5 animate-pulse h-64"
                />
              ))}
          </div>
        ) : isError ? (
          <div className="text-red-500 text-center">{(error as Error).message}</div>
        ) : safeTrips.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p>No saved trips yet.</p>
            <p>Click "Add Trip" to create your first trip.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onAddFlight={(tripId, flight: Flight) =>
                  addFlight.mutate({ tripId, flight })
                }
                onDeleteFlight={(tripId, flightId: string) =>
                  deleteFlight.mutate({ tripId, flightId })
                }
                onDeleteTrip={(tripId) => deleteTrip.mutate(tripId)}
                onUpdateTripTitle={(tripId, title) =>
                  updateTrip.mutate({ id: tripId, title })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTripPage;
