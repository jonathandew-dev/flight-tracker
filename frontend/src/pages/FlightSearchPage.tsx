// src/pages/FlightSearchPage.tsx
import { useState } from "react";
import { searchFlights } from "@/api/api";
import FlightResultCard from "@/components/cards/FlightResultCard";
import { Flight } from "@/utils/types";

const FlightSearchPage = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [maxResults, setMaxResults] = useState(5);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Search Flights ---
  const handleSearch = async () => {
    if (!origin || !destination || !departureDate) {
      setError("Please fill in origin, destination, and departure date");
      return;
    }

    setLoading(true);
    setError("");
    setFlights([]);
    try {
      const results = await searchFlights({
        origin,
        destination,
        departureDate,
        returnDate,
        adults,
        max: maxResults,
      });
      setFlights(results);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- Add to Trip Placeholder ---
  const handleAddToTrip = (flight: Flight) => {
    console.log("Flight added to trip:", flight);
    // Next: open modal or select a saved trip
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Flights</h1>

      {/* --- Search Form --- */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          min={1}
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
          className="border p-2 rounded w-20"
          placeholder="Adults"
        />
        <input
          type="number"
          min={1}
          max={50}
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          className="border p-2 rounded w-20"
          placeholder="Max"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading flights...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* --- Flight Results --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flights.map((flight) => (
          <FlightResultCard
            key={flight.id}
            flight={flight}
            onAddToTrip={handleAddToTrip}
          />
        ))}
      </div>
    </div>
  );
};

export default FlightSearchPage;
