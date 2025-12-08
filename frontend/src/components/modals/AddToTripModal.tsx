import React from "react";
import { SavedTrip, Flight } from "@/utils/types";
import { Button } from "../Button";

interface AddToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: SavedTrip[];
  selectedTripId: string | null;
  onSelectTrip: (tripId: string) => void;
  handleConfirm: () => void; // renamed
  flight: Flight;
}

const AddToTripModal: React.FC<AddToTripModalProps> = ({
  isOpen,
  onClose,
  trips,
  selectedTripId,
  onSelectTrip,
  handleConfirm, // renamed here
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Select Trip</h2>

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
            onClick={handleConfirm} // renamed usage
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!selectedTripId}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddToTripModal;
