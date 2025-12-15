import React from "react";
import { Flight, carriers } from "@/utils/types";
import { Button } from "../Button";
import { PlaneTakeoff, PlaneLanding, Clock } from "lucide-react";

interface FlightResultCardProps {
  flight: Flight;
  onAddToTrip: (flight: Flight) => void;
}

const FlightResultCard: React.FC<FlightResultCardProps> = ({
  flight,
  onAddToTrip,
}) => {
  const {
    origin,
    destination,
    departureTime,
    arrivalTime,
    airline,
    flightNumber,
    price,
  } = flight;

  const formattedPrice = price
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currency,
      }).format(Number(price.total ?? 0))
    : "N/A";

  const formatTime = (time: string) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

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
    <div className="
      bg-white dark:bg-gray-800 
      rounded-xl shadow-sm hover:shadow-lg 
      p-5 flex flex-col gap-4 
      transition-all duration-200 
      hover:scale-[1.015]
      text-gray-900 dark:text-gray-100
      border border-gray-200 dark:border-gray-700
    ">
      {/* Header */}
      <div
        className="
          flex justify-between items-center 
          pb-3 border-b 
          border-gray-200 dark:border-gray-700 
          rounded-t-xl px-3 py-2 
          bg-gray-50 dark:bg-gray-800
        "
      >
        <h3 className="font-semibold text-lg">
          {carrierName} {flightNumber}
        </h3>
        <span className="font-bold text-blue-600 dark:text-blue-400">
          {formattedPrice}
        </span>
      </div>

      {/* Route: Departure → Duration → Arrival */}
      <div className="flex justify-between items-center mt-3">
        {/* Departure */}
        <div className="flex flex-col items-center group">
          <PlaneTakeoff className="w-6 h-6 text-blue-500 dark:text-blue-400 transition-transform group-hover:-translate-y-1" />
          <span className="font-semibold text-lg mt-1">{origin}</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {formatTime(departureTime)}
          </span>
          <span className="text-gray-400 dark:text-gray-500 text-xs">
            {formatDate(departureTime)}
          </span>
        </div>

        {/* Duration */}
        <div className="flex flex-col items-center text-center relative group">
          <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 mb-1" />
          <span className="text-gray-600 dark:text-gray-300 text-sm">
            {getDuration(departureTime, arrivalTime)}
          </span>

          {/* Tooltip */}
          <span className="
            absolute bottom-full mb-2 px-2 py-1 
            text-xs rounded 
            bg-gray-900 dark:bg-gray-700 
            text-white 
            opacity-0 group-hover:opacity-100 
            transition-opacity
            pointer-events-none
          ">
            Flight duration
          </span>
        </div>

        {/* Arrival */}
        <div className="flex flex-col items-center group">
          <PlaneLanding className="w-6 h-6 text-red-500 dark:text-red-400 transition-transform group-hover:-translate-y-1" />
          <span className="font-semibold text-lg mt-1">{destination}</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {formatTime(arrivalTime)}
          </span>
          <span className="text-gray-400 dark:text-gray-500 text-xs">
            {formatDate(arrivalTime)}
          </span>
        </div>
      </div>

      {/* Add to Trip Button */}
      <Button
        onClick={() => onAddToTrip(flight)}
        className="
          mt-4 w-full 
          flex justify-center items-center gap-2 
          bg-blue-500 dark:bg-blue-600 
          hover:bg-blue-600 dark:hover:bg-blue-700 
          text-white py-2 rounded-lg 
          transition-shadow hover:shadow-md
        "
        aria-label={`Add flight ${carrierName} ${flightNumber} to trip`}
      >
        Add to Trip
      </Button>
    </div>
  );
};

export default FlightResultCard;
