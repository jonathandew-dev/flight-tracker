import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import {
  useSavedTrips,
  useCreateSavedTrip,
  useUpdateSavedTrip,
  useDeleteSavedTrip,
  useDeleteFlight,
} from "../api/savedTripService";

import TripCard from "../components/cards/TripCard";

import { Button } from "../components/Button";
import Skeleton from "@/components/Skeleton";
import { Plus } from "lucide-react";
import { SavedTrip } from "../utils/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const SavedTripPage: React.FC = () => {
  const { data: trips, isLoading, isError, error } = useSavedTrips();
  const createTrip = useCreateSavedTrip();
  const updateTrip = useUpdateSavedTrip();
  const deleteTrip = useDeleteSavedTrip();
  const deleteFlight = useDeleteFlight();
  const navigate = useNavigate();

  const [tripsOrder, setTripsOrder] = useState<SavedTrip[]>([]);

  // Sync tripsOrder with trips from backend
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (trips) setTripsOrder(trips);
  }, [trips]);

  // --- Handlers ---
  const handleAddTrip = () =>
    createTrip.mutate({ title: `Trip ${Date.now()}`, flights: [] });

  const handleAddFlight = (tripId: string) => {
    navigate(`/flights?tripId=${tripId}`);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(tripsOrder);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setTripsOrder(reordered);
    // Optional: persist new order to backend
  };

  const handleDeleteTrip = (tripId: string) => {
    // Optimistically remove from local state
    setTripsOrder((prev) => prev.filter((t) => t.id !== tripId));
    deleteTrip.mutate(tripId);
  };

  const handleDeleteFlight = (tripId: string, flightId: string) => {
    // Optimistically remove from local state
    setTripsOrder((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? { ...t, flights: t.flights.filter((f) => f.id !== flightId) }
          : t
      )
    );
    deleteFlight.mutate({ tripId, flightId });
  };

  const handleUpdateTripTitle = async (tripId: string, title: string) => {
    const updated = await updateTrip.mutateAsync({ id: tripId, title });

    
    setTripsOrder((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, title } : t))
    );

    return updated; 
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header + Add Trip */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Saved Trips</h1>
          <Button
            onClick={handleAddTrip}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus size={16} /> Add Trip
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <Skeleton
                  key={idx}
                  className="h-64 w-full rounded-xl shadow animate-pulse"
                />
              ))}
          </div>
        ) : isError ? (
          <div className="text-red-500 text-center">
            {(error as Error).message}
          </div>
        ) : tripsOrder.length === 0 ? (
          <div className="text-center text-gray-500 mt-12 space-y-2">
            <p>No saved trips yet.</p>
            <p>Click "Add Trip" to create your first trip.</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="trips" direction="horizontal">
              {(provided) => (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tripsOrder.map((trip, index) => (
                    <Draggable
                      key={trip.id}
                      draggableId={trip.id}
                      index={index}
                    >
                      {(providedDraggable) => (
                        <div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                        >
                          <TripCard
                            trip={trip}
                            onDeleteFlight={handleDeleteFlight}
                            onDeleteTrip={handleDeleteTrip}
                            onUpdateTripTitle={handleUpdateTripTitle}
                            onAddFlight={handleAddFlight}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedTripPage;
