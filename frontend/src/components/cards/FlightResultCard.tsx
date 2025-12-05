// src/components/cards/FlightResultCard.tsx
import React from "react";
import { Flight } from "@/utils/types";
import { Button } from "../Button";

interface FlightResultCardProps {
  flight: Flight;
  onAddToTrip: (flight: Flight) => void;
}

const FlightResultCard: React.FC<FlightResultCardProps> = ({ flight, onAddToTrip }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{flight.airline} {flight.flightNumber}</h3>
        <span className="text-sm text-gray-500">${flight.price}</span>
      </div>
      <div className="text-sm text-gray-700">
        {flight.origin} → {flight.destination}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Dep: {flight.departureTime}</span>
        <span>Arr: {flight.arrivalTime}</span>
      </div>
      <Button
        onClick={() => onAddToTrip(flight)}
        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Add to Trip
      </Button>
    </div>
  );
};

export default FlightResultCard;
