import React, { useState } from "react";
import { Flight } from "../utils/types";
import { ChevronDown, ChevronUp, Plus, Trash, Edit } from "lucide-react";

interface SavedTrip {
  id: string;
  title: string | null;
  flights: Flight[];
}

interface TripCardProps {
  trip: SavedTrip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <h2 className="text-xl font-semibold">{trip.title || "Untitled Trip"}</h2>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </div>

      {expanded && (
        <div className="mt-4">
          {trip.flights.length === 0 ? (
            <p className="text-gray-500">No flights added yet.</p>
          ) : (
            <ul className="space-y-2">
              {trip.flights.map((flight, index) => (
                <li key={index} className="flex justify-between items-center border p-2 rounded">
                  <div>
                    <p className="font-medium">{flight.flightNumber}</p>
                    <p className="text-gray-500">{flight.origin} → {flight.destination}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700"><Edit size={16} /></button>
                    <button className="text-red-500 hover:text-red-700"><Trash size={16} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button className="mt-4 flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            <Plus size={16} className="mr-2" /> Add Flight
          </button>
        </div>
      )}
    </div>
  );
};

export default TripCard;
