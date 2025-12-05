// src/components/cards/FlightCard.tsx
import React from "react";
import { Flight } from "@/utils/types";

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
      <p>{flight.airline} — {flight.flightNumber}</p>
      <p>{flight.origin} → {flight.destination}</p>
      <p>{flight.departureTime} - {flight.arrivalTime}</p>
      <p>${flight.price}</p>
    </div>
  );
};

export default FlightCard;
