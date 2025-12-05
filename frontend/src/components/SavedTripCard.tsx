import React from "react";
import { SavedTrip } from "../utils/types";
import { Button } from "./Button";

interface Props {
  trip: SavedTrip;
  onUpdate: (newTitle: string) => void;
  onDelete: () => void;
}

const SavedTripCard: React.FC<Props> = ({ trip, onUpdate, onDelete }) => {
  const handleEdit = () => {
    const newTitle = prompt("Enter new trip title", trip.title);
    if (newTitle && newTitle !== trip.title) onUpdate(newTitle);
  };

  return (
    <li className="p-4 border rounded shadow hover:bg-gray-50 flex justify-between items-center">
      <div>
        <strong>{trip.title}</strong>
        <ul className="mt-2 ml-4 space-y-1">
          {trip.flights.slice(0, 3).map((flight: any, idx: number) => (
            <li key={idx}>
              {flight.origin} → {flight.destination}
            </li>
          ))}
          {trip.flights.length > 3 && <li>...and more</li>}
        </ul>
      </div>
      <div className="flex space-x-2">
        <Button onClick={handleEdit}>Edit</Button>
        <Button onClick={onDelete} className="bg-red-500 hover:bg-red-600">Delete</Button>
      </div>
    </li>
  );
};

export default SavedTripCard;
