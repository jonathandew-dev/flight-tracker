import React, { useState } from "react";
import { SavedTrip, Flight } from "@/utils/types";
import { Button } from "../Button";
import { useAddFlight } from "@/api/addFlightService";

interface AddToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: SavedTrip[];
  flight: Flight;
}

const AddToTripModal: React.FC<AddToTripModalProps> = ({
  isOpen,
  onClose,
  trips,
  flight,
}) => {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const addFlightMutation = useAddFlight(); // returns UseMutationResult

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!selectedTripId) return;

    const trip = trips.find((t) => t.id === selectedTripId);
    if (
      trip?.flights.some(
        (f) =>
          f.flightNumber === flight.flightNumber &&
          f.departureTime === flight.departureTime
      )
    ) {
      alert("This flight is already added to this trip.");
      return;
    }

    try {
      await addFlightMutation.mutateAsync({
        tripId: selectedTripId,
        flight: flight,
      });
      onClose();
    } catch (err) {
      console.error("Failed to add flight:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Add Flight to Trip</h2>

        {trips.length === 0 ? (
          <p className="text-gray-500">
            No trips available. Create a trip first.
          </p>
        ) : (
          <div className="flex flex-col gap-2 mb-4">
            {trips.map((trip) => (
              <label
                key={trip.id}
                className="flex items-center gap-2 p-2 border rounded hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="radio"
                  name="trip"
                  value={trip.id}
                  checked={selectedTripId === trip.id}
                  onChange={() => setSelectedTripId(trip.id)}
                />
                {trip.title}
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!selectedTripId || addFlightMutation.status === "pending"}
          >
            {addFlightMutation.status === "pending" ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddToTripModal;
