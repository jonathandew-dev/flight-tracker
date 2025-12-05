// src/components/TripCard.tsx
import React, { useState } from "react";

import { SavedTrip,Flight } from "../../utils/types";
import { Button } from "../Button";
import FlightForm from "../forms/FlightForm";
import { Trash2, Edit, Plus, X, Save, ChevronDown, ChevronUp } from "lucide-react";

interface TripCardProps {
  trip: SavedTrip;
  onAddFlight: (tripId: string, flight: Flight) => void;
  onDeleteFlight: (tripId: string, flightId: string) => void;
  onDeleteTrip: (tripId: string) => void;
  onUpdateTripTitle: (tripId: string, title: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  onAddFlight,
  onDeleteFlight,
  onDeleteTrip,
  onUpdateTripTitle,
}) => {
  
  console.log("Trip objects:" ,trip);
  console.log("Trip flights:" ,trip.flights);

  const [addingFlight, setAddingFlight] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(trip.title);
  const [collapsed, setCollapsed] = useState(false);

  const handleSaveTitle = () => {
    if (!title.trim()) return alert("Title cannot be empty");
    onUpdateTripTitle(trip.id, title);
    setEditingTitle(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col hover:shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {editingTitle ? (
          <div className="flex gap-2 w-full">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-2 flex-1"
              placeholder="Trip Title"
            />
            <Button onClick={handleSaveTitle} className="p-2">
              <Save size={16} />
            </Button>
            <Button onClick={() => setEditingTitle(false)} className="p-2 bg-gray-200">
              <X size={16} />
            </Button>
          </div>
        ) : (
          <>
            <h2 className="font-semibold text-lg flex-1">{trip.title}</h2>
            <div className="flex gap-2 items-center">
              <Button onClick={() => setEditingTitle(true)} className="p-2">
                <Edit size={16} />
              </Button>
              <Button
                onClick={() => onDeleteTrip(trip.id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
              >
                <Trash2 size={16} />
              </Button>
              <Button onClick={() => setCollapsed(!collapsed)} className="p-2 bg-gray-100 rounded">
                {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Flights */}
      {!collapsed && (
        <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto">
          {trip.flights.length === 0 ? (
            <p className="text-gray-500 text-sm">No flights added yet.</p>
          ) : (
            trip.flights.map((f: Flight) => (
              <div
                key={f.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded hover:bg-gray-100 transition"
              >
                <span className="text-sm font-medium">
                  {f.flightNumber} — {f.origin} → {f.destination}
                </span>
                <Button
                  onClick={() => f.id && onDeleteFlight(trip.id, f.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Flight */}
      {addingFlight ? (
        <FlightForm
          onSubmit={(flight) => {
            onAddFlight(trip.id, flight);
            setAddingFlight(false);
          }}
          onCancel={() => setAddingFlight(false)}
        />
      ) : (
        <Button
          onClick={() => setAddingFlight(true)}
          className="flex items-center justify-center gap-2 mt-auto bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          <Plus size={16} /> Add Flight
        </Button>
      )}
    </div>
  );
};

export default TripCard;
