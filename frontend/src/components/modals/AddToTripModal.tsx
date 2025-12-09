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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-96 max-w-full">
        <h2
          id="modal-title"
          className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100"
        >
          Select Trip
        </h2>

        {/* Flight Info */}
        <div className="mb-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700">
          <p className="text-gray-700 dark:text-gray-200 font-medium">
            Adding flight: <strong>{flight.origin} → {flight.destination}</strong>
          </p>
          <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
            Departure: {new Date(flight.departureTime).toLocaleString()} | Return: {flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleString() : "N/A"}
          </p>
        </div>

        {/* Trip Selection */}
        {trips.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No trips available. Create a trip first.
          </p>
        ) : (
          <div className="flex flex-col gap-2 mb-4 max-h-60 overflow-y-auto">
            {trips.map((trip) => (
              <label
                key={trip.id}
                className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition ${
                  selectedTripId === trip.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="trip"
                  value={trip.id}
                  checked={selectedTripId === trip.id}
                  onChange={() => onSelectTrip(trip.id)}
                  className="focus:ring-2 focus:ring-blue-400"
                />
                <span className="truncate text-gray-900 dark:text-gray-100">{trip.title || "Untitled Trip"}</span>
              </label>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-2">
          <Button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white"
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
