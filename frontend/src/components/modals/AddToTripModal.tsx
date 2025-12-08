import React from "react";
import { SavedTrip, Flight } from "@/utils/types";
import { Button } from "../Button";

interface AddToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: SavedTrip[];
  selectedTripId: string | null;
  onSelectTrip: (tripId: string) => void;
  handleConfirm: () => void;
  flight: Flight;
}

const AddToTripModal: React.FC<AddToTripModalProps> = ({
  isOpen,
  onClose,
  trips,
  selectedTripId,
  onSelectTrip,
  handleConfirm,
  flight,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          Select Trip
        </h2>

        {/* Flight Info */}
        <div className="mb-4 p-2 border rounded bg-gray-50">
          <p className="text-gray-700">
            Adding flight: <strong>{flight.origin} → {flight.destination}</strong>
          </p>
          <p className="text-gray-500 text-sm">
            Departure: {flight.departureTime} | Return: {flight.arrivalTime ?? "N/A"}
          </p>
        </div>

        {/* Trip Selection */}
        {trips.length === 0 ? (
          <p className="text-gray-500">No trips available. Create a trip first.</p>
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
                  onChange={() => onSelectTrip(trip.id)}
                  className="focus:ring-2 focus:ring-blue-400"
                />
                <span className="truncate">{trip.title}</span>
              </label>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!selectedTripId}
            aria-disabled={!selectedTripId}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddToTripModal;
