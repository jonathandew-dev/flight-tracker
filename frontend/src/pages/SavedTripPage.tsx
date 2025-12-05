// src/pages/SavedTripPage.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/authService";
import TripCard from "../components/TripCard";

// --- Types ---
export interface Flight {
  id?: string;
  flightNumber: string;
  origin: string;
  destination: string;
}

export interface SavedTrip {
  id: string;
  title: string;
  flights: Flight[];
}

// --- Fetch Function ---
const fetchSavedTrips = async (): Promise<SavedTrip[]> => {
  const res = await api.get<SavedTrip[]>("/api/saved-trips");
  return res.data;
};


// --- Component ---
const SavedTripPage: React.FC = () => {
  const { data: savedTrips = [], isLoading, isError } = useQuery<SavedTrip[]>({
    queryKey: ["savedTrips"],
    queryFn: fetchSavedTrips,
  });

  if (isLoading) return <div>Loading trips...</div>;
  if (isError) return <div>Error loading trips.</div>;

  return (
    <div className="saved-trips-page">
      {savedTrips.length === 0 ? (
        <p>No saved trips yet.</p>
      ) : (
        savedTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))
      )}
    </div>
  );
};

export default SavedTripPage;
