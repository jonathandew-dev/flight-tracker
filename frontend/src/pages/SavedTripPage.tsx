import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
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
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

const SavedTripPage: React.FC = () => {
  const { data: trips, isLoading, isError, error } = useSavedTrips();
  const createTrip = useCreateSavedTrip();
  const updateTrip = useUpdateSavedTrip();
  const deleteTrip = useDeleteSavedTrip();
  const deleteFlight = useDeleteFlight();
  const navigate = useNavigate();

  const [tripsOrder, setTripsOrder] = useState<SavedTrip[]>([]);
  const newTripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (trips) setTripsOrder(trips);
  }, [trips]);
const handleAddTrip = () => {
    const tempTrip: SavedTrip = { id: `temp-${Date.now()}`, title: "New Trip", flights: [] };
    setTripsOrder((prev) => [...prev, tempTrip]);

    setTimeout(() => {
      newTripRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const handleCreateTrip = async (title: string, tempId: string) => {
    const createdTrip = await createTrip.mutateAsync({ title, flights: [] });
    setTripsOrder((prev) => prev.map((t) => (t.id === tempId ? createdTrip : t)));
    toast.success("Trip created!");
    return createdTrip;
  };

  const handleAddFlight = (tripId: string) => {
    navigate(`/flights?tripId=${tripId}`);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(tripsOrder);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setTripsOrder(reordered);
  };

  const handleDeleteTrip = (tripId: string) => {
    const prevTrips = [...tripsOrder];

    setTripsOrder((prev) => prev.filter((t) => t.id !== tripId));

    const toastId = toast(
      (t) => (
        <div className="flex justify-between items-center text-gray-900 dark:text-gray-100">
          <span>Trip deleted</span>
          <button
            onClick={() => {
              setTripsOrder(prevTrips);
              toast.dismiss(t.id);
            }}
            className="text-blue-500 underline ml-4"
          >
            Undo
          </button>
        </div>
      ),
      { duration: 5000 }
    );

    deleteTrip.mutate(tripId, {
      onError: () => {
        setTripsOrder(prevTrips);
        toast.error("Failed to delete trip");
        toast.dismiss(toastId);
      },
      onSuccess: () => {
        toast.dismiss(toastId);
        toast.success("Trip deleted permanently");
      },
    });
  };

  const handleDeleteFlight = (tripId: string, flightId?: string) => {
    if (!flightId) return toast.error("Cannot delete flight: invalid ID");

    const prevTrips = [...tripsOrder];

    setTripsOrder((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? { ...t, flights: t.flights?.filter((f) => f.id !== flightId) ?? [] }
          : t
      )
    );

    const toastId = toast(
      (t) => (
        <div className="flex justify-between items-center text-gray-900 dark:text-gray-100">
          <span>Flight deleted</span>
          <button
            onClick={() => {
              setTripsOrder(prevTrips);
              toast.dismiss(t.id);
            }}
            className="text-blue-500 underline ml-4"
          >
            Undo
          </button>
        </div>
      ),
      { duration: 5000 }
    );

    deleteFlight.mutate(
      { tripId, flightId },
      {
        onError: () => {
          setTripsOrder(prevTrips);
          toast.error("Failed to delete flight");
          toast.dismiss(toastId);
        },
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success("Flight deleted permanently");
        },
      }
    );
  };

  const handleUpdateTripTitle = async (tripId: string, title: string) => {
    const updated = await updateTrip.mutateAsync({ id: tripId, title });
    setTripsOrder((prev) => prev.map((t) => (t.id === tripId ? { ...t, title } : t)));
    toast.success("Trip title saved!");
    return updated;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Saved Trips</h1>
        <Button onClick={handleAddTrip} variant="primary" className="flex items-center gap-2">
          <Plus size={16} /> Add Trip
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, idx) => (
              <Skeleton
                key={idx}
                className="h-72 w-full rounded-xl shadow animate-pulse bg-gray-200 dark:bg-gray-700"
              />
            ))}
        </div>
      ) : isError ? (
        <div className="text-red-500 dark:text-red-400 text-center">{(error as Error).message}</div>
      ) : tripsOrder.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-12 space-y-2">
          <p>No saved trips yet.</p>
          <p>Click "Add Trip" to create your first trip.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="trips" direction="horizontal">
            {(provided) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tripsOrder.map((trip, index) => (
                  <Draggable key={trip.id} draggableId={trip.id} index={index}>
                    {(providedDraggable) => (
                      <div
                        ref={(el) => {
                          providedDraggable.innerRef(el);
                          if (trip.id.startsWith("temp-")) newTripRef.current = el;
                        }}
                        {...providedDraggable.draggableProps}
                        {...providedDraggable.dragHandleProps}
                      >
                        <TripCard
                          trip={trip}
                          onDeleteFlight={handleDeleteFlight}
                          onDeleteTrip={handleDeleteTrip}
                          onUpdateTripTitle={handleUpdateTripTitle}
                          onAddFlight={handleAddFlight}
                          autoEdit={trip.id.startsWith("temp-")}
                          onCreateTrip={handleCreateTrip}
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
  );
};

export default SavedTripPage;