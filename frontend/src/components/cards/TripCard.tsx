import React, { useState, useEffect, useRef } from "react";
import { SavedTrip, Flight, carriers } from "@/utils/types";
import { Button } from "../Button";
import {
  Trash2,
  Edit,
  Plus,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  PlaneTakeoff,
  PlaneLanding,
  Clock,
} from "lucide-react";

interface TripCardProps {
  trip: SavedTrip;
  onDeleteFlight: (tripId: string, flightId: string) => void;
  onDeleteTrip: (tripId: string) => void;
  onUpdateTripTitle: (tripId: string, title: string) => Promise<SavedTrip>;
  onAddFlight?: (tripId: string) => void;
  autoEdit?: boolean;
  onCreateTrip?: (title: string, tempId: string) => Promise<SavedTrip>;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  onDeleteFlight,
  onDeleteTrip,
  onUpdateTripTitle,
  onAddFlight,
  autoEdit = false,
  onCreateTrip,
}) => {
  const [editingTitle, setEditingTitle] = useState(autoEdit);
  const [title, setTitle] = useState(trip.title);
  const [collapsed, setCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTitle]);

  useEffect(() => setTitle(trip.title), [trip.title]);

  const handleSaveTitle = async () => {
    const newTitle = title.trim();
    if (!newTitle) return;

    setSaving(true);
    try {
      if (trip.id.startsWith("temp-") && onCreateTrip) {
        await onCreateTrip(newTitle, trip.id);
      } else {
        await onUpdateTripTitle(trip.id, newTitle);
      }
      setEditingTitle(false);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveTitle();
    if (e.key === "Escape") setEditingTitle(false);
  };

  const formatTime = (time: string) =>
    new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const FlightItem: React.FC<{ flight: Flight }> = ({ flight }) => {
    const airlineName = carriers[flight.airline] || flight.airline;
    return (
      <div className="bg-gray-50 p-3 rounded-lg shadow-sm flex flex-col gap-2 hover:shadow transition">
        <div className="flex justify-between items-center text-sm font-medium text-gray-700">
          <span>
            {airlineName} {flight.flightNumber}
          </span>
          <Button
            onClick={() => flight.id && onDeleteFlight(trip.id, flight.id)}
            variant="danger"
            className="p-1 hover:bg-red-100 transition"
            aria-label={`Delete flight ${flight.flightNumber}`}
            disabled={!flight.id}
          >
            <Trash2 size={14} />
          </Button>
        </div>

        <div className="flex justify-between items-center text-gray-600 text-sm">
          <div className="flex flex-col items-center">
            <PlaneTakeoff className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">{flight.origin}</span>
            <span className="text-gray-400 text-xs">{formatTime(flight.departureTime)}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Clock className="w-4 h-4 text-gray-400 mb-1" />
            <span className="text-gray-500 text-xs">
              {getDuration(flight.departureTime, flight.arrivalTime)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <PlaneLanding className="w-5 h-5 text-red-500" />
            <span className="font-semibold">{flight.destination}</span>
            <span className="text-gray-400 text-xs">{formatTime(flight.arrivalTime)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] flex flex-col p-5 gap-4">
      <div className="flex justify-between items-center mb-4">
        {editingTitle ? (
          <div className="flex gap-2 w-full">
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Trip Title"
            />
            <Button
              onClick={handleSaveTitle}
              className="p-2 hover:bg-blue-100 transition"
              disabled={saving}
              aria-label="Save title"
            >
              <Save size={16} />
            </Button>
            <Button
              onClick={() => setEditingTitle(false)}
              className="p-2 hover:bg-gray-100 transition"
              aria-label="Cancel edit"
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <>
            <h2 className="font-semibold text-lg flex-1">{trip.title}</h2>
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => setEditingTitle(true)}
                className="p-2 hover:bg-gray-100 transition"
                aria-label="Edit Trip Title"
              >
                <Edit size={16} />
              </Button>
              <Button
                onClick={() => onDeleteTrip(trip.id)}
                variant="danger"
                className="p-2 hover:bg-red-100 transition"
                aria-label="Delete Trip"
              >
                <Trash2 size={16} />
              </Button>
              <Button
                onClick={() => setCollapsed(!collapsed)}
                className={`p-2 transition-transform ${collapsed ? "rotate-180" : ""}`}
                aria-label={collapsed ? "Expand Flights" : "Collapse Flights"}
              >
                {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </Button>
            </div>
          </>
        )}
      </div>

      {!collapsed && (
        <div className="flex flex-col gap-3 mb-4 max-h-72 overflow-y-auto">
          {trip.flights.length === 0 ? (
            <p className="text-gray-500 text-sm">No flights added yet.</p>
          ) : (
            trip.flights.map((f) => <FlightItem key={f.id} flight={f} />)
          )}
        </div>
      )}

      {onAddFlight && (
        <Button
          onClick={() => onAddFlight(trip.id)}
          className="flex items-center justify-center gap-2 mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          disabled={collapsed}
          aria-disabled={collapsed}
        >
          <Plus size={16} /> Add Flight
        </Button>
      )}
    </div>
  );
};

export default TripCard;
