// src/pages/SavedTrips.tsx
import React from "react";
import {
  useSavedTrips,
  useCreateSavedTrip,
  useDeleteSavedTrip,
} from "../api/savedTripService";
import { useAddFlight } from "../api/addFlightService";
import { Button } from "../components/Button";
import { SavedTrip, Flight } from "../utils/types";

// --- Flight form type ---
interface FlightForm {
  flightNumber: string;
  origin: string;
  destination: string;
}

const SavedTrips: React.FC = () => {
  const { data: trips, isLoading, isError, error } = useSavedTrips();
  const createTrip = useCreateSavedTrip();
  const deleteTrip = useDeleteSavedTrip();
  const addFlight = useAddFlight();

  const [addingFlightFor, setAddingFlightFor] = React.useState<string | null>(null);
  const [flightForm, setFlightForm] = React.useState<FlightForm>({
    flightNumber: "",
    origin: "",
    destination: "",
  });

  const safeTrips: SavedTrip[] = Array.isArray(trips) ? trips : [];

  // --- Trip Handlers ---
  const handleAddTrip = () => {
    createTrip.mutate({ title: `Trip ${Date.now()}`, flights: [] });
  };

  const handleDeleteTrip = (tripId: string) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      deleteTrip.mutate(tripId);
    }
  };

  // --- Flight Handlers ---
  const handleOpenAddFlight = (tripId: string) => {
    setAddingFlightFor(tripId);
    setFlightForm({ flightNumber: "", origin: "", destination: "" });
  };

  const handleFlightInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFlightForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitFlight = (tripId: string) => {
    if (!flightForm.flightNumber || !flightForm.origin || !flightForm.destination) {
      alert("Please fill out all flight fields");
      return;
    }

    const newFlight: Flight = { ...flightForm, id: crypto.randomUUID() };
    addFlight.mutate({ tripId, flight: newFlight });
    setAddingFlightFor(null);
  };

  // --- Render ---
  if (isLoading) return <div>Loading saved trips...</div>;
  if (isError) return <div>Error loading trips: {(error as Error).message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Trips</h1>
      <Button onClick={handleAddTrip} className="mb-4">Add Trip</Button>

      {safeTrips.length === 0 ? (
        <p>No saved trips yet. Click “Add Trip” to create one.</p>
      ) : (
        <ul className="space-y-6">
          {safeTrips.map((trip) => (
            <li key={trip.id} className="p-4 border rounded shadow hover:bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{trip.title}</span>
                <Button
                  onClick={() => handleDeleteTrip(trip.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </div>

              {/* Flights list */}
              <ul className="ml-4 mb-2">
                {trip.flights.map((f: Flight, idx: number) => (
                  <li key={f.id || idx}>
                    {f.flightNumber} — {f.origin} → {f.destination}
                  </li>
                ))}
              </ul>

              {/* Add Flight Form */}
              {addingFlightFor === trip.id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    name="flightNumber"
                    placeholder="Flight #"
                    value={flightForm.flightNumber}
                    onChange={handleFlightInputChange}
                    className="border p-1 rounded"
                  />
                  <input
                    name="origin"
                    placeholder="Origin"
                    value={flightForm.origin}
                    onChange={handleFlightInputChange}
                    className="border p-1 rounded"
                  />
                  <input
                    name="destination"
                    placeholder="Destination"
                    value={flightForm.destination}
                    onChange={handleFlightInputChange}
                    className="border p-1 rounded"
                  />
                  <Button onClick={() => handleSubmitFlight(trip.id)}>Add Flight</Button>
                  <Button onClick={() => setAddingFlightFor(null)} className="bg-gray-300">
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button onClick={() => handleOpenAddFlight(trip.id)}>Add Flight</Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedTrips;
