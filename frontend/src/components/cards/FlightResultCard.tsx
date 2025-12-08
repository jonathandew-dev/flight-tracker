import React from "react";
import { Flight } from "@/utils/types";
import { Button } from "../Button";

interface FlightResultCardProps {
  flight: Flight;
  onAddToTrip: (flight: Flight) => void;
}

const FlightResultCard: React.FC<FlightResultCardProps> = ({ flight, onAddToTrip }) => {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: flight.price.currency,
  }).format(Number(flight.price.total ?? 0));

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-lg transition">
      {/* Flight header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          {flight.airline} {flight.flightNumber}
        </h3>
        <span className="font-medium">{formattedPrice}</span>
      </div>

      {/* Route info */}
      <div className="text-sm text-gray-600">
        {flight.origin} → {flight.destination}
      </div>

      {/* Timing info */}
      <div className="text-sm text-gray-600">
        Depart: {new Date(flight.departureTime).toLocaleString()}
      </div>
      <div className="text-sm text-gray-600">
        Arrive: {new Date(flight.arrivalTime).toLocaleString()}
      </div>

      {/* Add to trip */}
      <Button
        onClick={() =>
          onAddToTrip({
            ...flight,
            id: crypto.randomUUID(),
          })
        }
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
      >
        Add to Trip
      </Button>
    </div>
  );
};

export default FlightResultCard;

