// src/components/cards/TripCard.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { SavedTrip, Flight } from "../../utils/types";
import { Button } from "../Button";
import {
  Trash2,
  Edit,
  Plus,
  X,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TripCardProps {
  trip: SavedTrip;
  onDeleteFlight: (tripId: string, flightId: string) => void;
  onDeleteTrip: (tripId: string) => void;
  
  onUpdateTripTitle: (tripId: string, title: string) => Promise<SavedTrip>;
  onAddFlight?: (tripId: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  onDeleteFlight,
  onDeleteTrip,
  onUpdateTripTitle,
  onAddFlight,
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(trip.title);
  const [collapsed, setCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync local title if parent changes it (prevents stale UI after refetch)
  useEffect(() => {
    setTitle(trip.title);
  }, [trip.title]);

  const handleSaveTitle = async () => {
    const newTitle = title.trim();
    if (!newTitle) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      setSaving(true);
      // await parent's mutateAsync wrapper
      await onUpdateTripTitle(trip.id, newTitle);
      setEditingTitle(false);
      toast.success("Trip title updated!");
    } catch (err) {
      console.error("Failed to update trip title:", err);
      const msg = err instanceof Error ? err.message : "Failed to update trip";
      toast.error(msg);
      // keep editing open so user can retry
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrip = () => {
    onDeleteTrip(trip.id);
    toast.success("Trip deleted!");
  };

  const handleDeleteFlight = (flightId: string) => {
    onDeleteFlight(trip.id, flightId);
    toast.success("Flight removed from trip!");
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
            <Button onClick={handleSaveTitle} className="p-2" disabled={saving}>
              <Save size={16} />
            </Button>
            <Button onClick={() => setEditingTitle(false)} className="p-2">
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
              <Button onClick={handleDeleteTrip} variant="danger" className="p-2">
                <Trash2 size={16} />
              </Button>
              <Button onClick={() => setCollapsed(!collapsed)} className="p-2">
                {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Flights list */}
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
                  onClick={() => f.id && handleDeleteFlight(f.id)}
                  variant="danger"
                  className="p-1"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Flight */}
      <Button
        onClick={() => onAddFlight && onAddFlight(trip.id)}
        className="flex items-center justify-center gap-2 mt-auto"
        variant="primary"
        disabled={collapsed}
      >
        <Plus size={16} /> Add Flight
      </Button>
    </div>
  );
};

export default TripCard;
