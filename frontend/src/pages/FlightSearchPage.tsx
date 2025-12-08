// src/pages/FlightSearchPage.tsx
import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

import FlightSearchForm from "@/components/forms/FlightSearchForm";
import FlightResultCard from "@/components/cards/FlightResultCard";
import AddToTripModal from "@/components/modals/AddToTripModal";

import { useSavedTrips, useAddFlightToTrip } from "@/api/savedTripService";
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { Flight } from "@/utils/types";
import { FlightSearchFormData } from "@/utils/flightSearchSchema";

interface FlightWithInternalId extends Flight {
  internalId: string;
}

const FlightSearchPage: React.FC = () => {
  const location = useLocation();
  const tripIdFromUrl = new URLSearchParams(location.search).get("tripId");

  const { data: trips = [] } = useSavedTrips();
  const { mutate: addFlightToTrip } = useAddFlightToTrip();
  const { flights, loading, error, search } = useFlightSearch();

  const [form, setForm] = useState<FlightSearchFormData>({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: undefined,
    adults: 1,
    maxResults: 6,
  });

  const [selectedFlight, setSelectedFlight] = useState<FlightWithInternalId | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(() => {
    if (tripIdFromUrl && trips.some(t => t.id === tripIdFromUrl)) return tripIdFromUrl;
    return null;
  });

  const flightsWithIds = useMemo<FlightWithInternalId[]>(() => {
    return flights.map(f => ({ ...f, internalId: f.id ?? uuidv4() }));
  }, [flights]);

  const addFlightToTripWithToast = (tripId: string, flight: Flight) => {
    addFlightToTrip(
      { tripId, flight },
      {
        onSuccess: () => toast.success("Flight added to trip!"),
        onError: err => {
          const message = isError(err) ? err.message : "Failed to add flight";
          toast.error(message);
        },
      }
    );
  };

  const handleAddFlight = (flight: FlightWithInternalId) => {
    if (selectedTripId) {
      addFlightToTripWithToast(selectedTripId, flight);
    } else {
      setSelectedFlight(flight);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        Search Flights {selectedTripId && "(Adding to Trip)"}
      </h1>

      <FlightSearchForm
        form={form}
        setForm={setForm}
        onSearch={(validatedForm: FlightSearchFormData) =>
          search({
            originLocationCode: validatedForm.origin,
            destinationLocationCode: validatedForm.destination,
            departureDate: validatedForm.departureDate,
            returnDate: validatedForm.returnDate,
            adults: validatedForm.adults,
            max: validatedForm.maxResults,
          })
        }
        loading={loading}
      />

      {loading || error || flightsWithIds.length === 0 ? (
        <SkeletonGrid count={form.maxResults} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flightsWithIds.map(flight => (
            <FlightResultCard
              key={flight.internalId}
              flight={flight}
              onAddToTrip={() => handleAddFlight(flight)}
            />
          ))}
        </div>
      )}

      {selectedFlight && (
        <AddToTripModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          trips={trips}
          flight={selectedFlight}
          selectedTripId={selectedTripId}
          onSelectTrip={tripId => setSelectedTripId(tripId)}
          handleConfirm={() => {
            if (selectedTripId && selectedFlight) {
              addFlightToTripWithToast(selectedTripId, selectedFlight);
              setIsModalOpen(false);
              setSelectedFlight(null);
            }
          }}
        />
      )}
    </div>
  );
};

function isError(err: unknown): err is Error {
  return err instanceof Error;
}

const SkeletonGrid: React.FC<{ count: number }> = ({ count }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="h-56 bg-gray-200 rounded-xl shadow-sm animate-pulse" />
    ))}
  </div>
);

export default FlightSearchPage;
