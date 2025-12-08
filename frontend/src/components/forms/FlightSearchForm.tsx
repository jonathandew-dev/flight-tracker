// src/components/forms/FlightSearchForm.tsx
import React from "react";

export interface FlightFormData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  maxResults: number;
}

interface Props {
  form: FlightFormData;
  setForm: (val: FlightFormData) => void;
  onSearch: () => void;
  loading: boolean;
}

const FlightSearchForm: React.FC<Props> = ({ form, setForm, onSearch, loading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "adults" || name === "maxResults" ? Number(value) : value });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input name="origin" placeholder="Origin" value={form.origin} onChange={handleChange} className="border p-2 rounded" />
      <input name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} className="border p-2 rounded" />
      <input name="departureDate" type="date" value={form.departureDate} onChange={handleChange} className="border p-2 rounded" />
      <input name="returnDate" type="date" value={form.returnDate} onChange={handleChange} className="border p-2 rounded" />
      <input name="adults" type="number" min={1} value={form.adults} onChange={handleChange} className="border p-2 rounded w-20" />
      <input name="maxResults" type="number" min={1} max={50} value={form.maxResults} onChange={handleChange} className="border p-2 rounded w-20" />
      <button onClick={onSearch} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default FlightSearchForm;
