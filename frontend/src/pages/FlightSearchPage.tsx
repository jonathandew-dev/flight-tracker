import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

import DashboardLayout from "@/components/DashboardLayout";
import FlightResultCard from "@/components/cards/FlightResultCard";
import AddToTripModal from "@/components/modals/AddToTripModal";
import { useSavedTrips, useAddFlightToTrip } from "@/api/savedTripService";
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { Flight } from "@/utils/types";
import Skeleton from "@/components/Skeleton";
import FlightSearchForm, { FlightFormData } from "@/components/forms/FlightSearchForm";

interface FlightWithInternalId extends Flight {
  internalId: string;
}

const FlightSearchPage: React.FC = () => {
  const location = useLocation();
  const tripIdFromUrl = new URLSearchParams(location.search).get("tripId");

  const { data: trips = [] } = useSavedTrips();
  const { mutate: addFlightToTrip } = useAddFlightToTrip();

  const { flights, loading, error, search } = useFlightSearch();

  const [flightsWithIds, setFlightsWithIds] = useState<FlightWithInternalId[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightWithInternalId | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<FlightFormData>({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
    maxResults: 5,
  });

  const [selectedTripId, setSelectedTripId] = useState<string | null>(() => {
    if (tripIdFromUrl && trips.some((t) => t.id === tripIdFromUrl)) {
      return tripIdFromUrl;
    }
    return null;
  });

  // Map flights to include a persistent internalId
  useEffect(() => {
    const mappedFlights = flights.map((f) => ({
      ...f,
      internalId: f.id || uuidv4(),
    }));
    setFlightsWithIds(mappedFlights);
  }, [flights]);

  const addFlightToTripWithToast = (tripId: string, flight: Flight) => {
    addFlightToTrip(
      { tripId, flight },
      {
        onSuccess: () => toast.success("Flight added to trip!"),
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Failed to add flight";
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

  const renderFlights = () => {
    if (loading) return <SkeletonGrid count={form.maxResults} />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (flightsWithIds.length === 0)
      return <p className="text-gray-500">No flights found. Try changing your search.</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flightsWithIds.map((flight) => (
          <FlightResultCard
            key={flight.internalId} // Use persistent internalId
            flight={flight}
            onAddToTrip={() => handleAddFlight(flight)}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">
          Search Flights {selectedTripId && "(Adding to Trip)"}
        </h1>

        <FlightSearchForm
          form={form}
          setForm={setForm}
          onSearch={() =>
            search({
              originLocationCode: form.origin,
              destinationLocationCode: form.destination,
              departureDate: form.departureDate,
              returnDate: form.returnDate,
              adults: form.adults,
              max: form.maxResults,
            })
          }
          loading={loading}
        />

        {renderFlights()}

        {selectedFlight && !selectedTripId && (
          <AddToTripModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            trips={trips}
            flight={selectedFlight}
            selectedTripId={selectedTripId}
            onSelectTrip={(tripId) => setSelectedTripId(tripId)}
            handleConfirm={() => {
              if (selectedTripId && selectedFlight) {
                addFlightToTripWithToast(selectedTripId, selectedFlight);
                setIsModalOpen(false);
                setSelectedTripId(null);
                setSelectedFlight(null);
              }
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

const SkeletonGrid: React.FC<{ count: number }> = ({ count }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array(count)
      .fill(0)
      .map((_, idx) => (
        <Skeleton
          key={idx}
          className="h-48 w-full rounded-xl shadow animate-pulse"
        />
      ))}
  </div>
);

export default FlightSearchPage;