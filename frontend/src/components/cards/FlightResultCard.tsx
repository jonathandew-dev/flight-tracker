import React from "react";
import { Flight, carriers } from "@/utils/types";
import { Button } from "../Button";
import { PlaneTakeoff, PlaneLanding, Clock } from "lucide-react";

interface FlightResultCardProps {
  flight: Flight;
  onAddToTrip: (flight: Flight) => void;
}

const FlightResultCard: React.FC<FlightResultCardProps> = ({ flight, onAddToTrip }) => {
  const { origin, destination, departureTime, arrivalTime, airline, flightNumber, price } = flight;

  const formattedPrice = price
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currency,
      }).format(Number(price.total ?? 0))
    : "N/A";

  const formatTime = (time: string) =>
    new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (time: string) =>
    new Date(time).toLocaleDateString([], { month: "short", day: "numeric" });

  const getDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const carrierName = carriers[airline] || airline;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg p-5 flex flex-col gap-4 transition-transform hover:scale-[1.02]">
      {/* Header with subtle gradient accent */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-200" style={{ background: 'linear-gradient(90deg, #f0f4ff 0%, #ffffff 100%)', padding: '0.5rem 0.75rem', borderRadius: '0.75rem 0.75rem 0 0' }}>
        <h3 className="font-semibold text-lg">{carrierName} {flightNumber}</h3>
        <span className="font-bold text-blue-600">{formattedPrice}</span>
      </div>

      {/* Route: Departure → Duration → Arrival */}
      <div className="flex justify-between items-center text-gray-700 mt-3">
        {/* Departure */}
        <div className="flex flex-col items-center group">
          <PlaneTakeoff className="w-6 h-6 text-blue-500 transition-transform group-hover:-translate-y-1" />
          <span className="font-semibold text-lg mt-1">{origin}</span>
          <span className="text-gray-500 text-sm">{formatTime(departureTime)}</span>
          <span className="text-gray-400 text-xs">{formatDate(departureTime)}</span>
        </div>

        {/* Duration */}
        <div className="flex flex-col items-center text-center relative group">
          <Clock className="w-4 h-4 text-gray-400 mb-1" />
          <span className="text-gray-600 text-sm">{getDuration(departureTime, arrivalTime)}</span>
          <span className="absolute bottom-full mb-2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            Flight duration
          </span>
        </div>

        {/* Arrival */}
        <div className="flex flex-col items-center group">
          <PlaneLanding className="w-6 h-6 text-red-500 transition-transform group-hover:-translate-y-1" />
          <span className="font-semibold text-lg mt-1">{destination}</span>
          <span className="text-gray-500 text-sm">{formatTime(arrivalTime)}</span>
          <span className="text-gray-400 text-xs">{formatDate(arrivalTime)}</span>
        </div>
      </div>

      {/* Add to Trip Button */}
      <Button
        onClick={() => onAddToTrip(flight)}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg w-full flex justify-center items-center gap-2 transition-shadow hover:shadow-md"
        aria-label={`Add flight ${carrierName} ${flightNumber} to trip`}
      >
        Add to Trip
      </Button>
    </div>
  );
};

export default FlightResultCard;
