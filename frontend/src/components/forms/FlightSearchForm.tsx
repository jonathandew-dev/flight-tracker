import React, { useState } from "react";
import {
  flightSearchSchema,
  FlightSearchFormData,
} from "@/utils/flightSearchSchema";
import { ZodIssue } from "zod";

interface Props {
  form: FlightSearchFormData;
  setForm: (
    val:
      | FlightSearchFormData
      | ((prev: FlightSearchFormData) => FlightSearchFormData)
  ) => void;
  onSearch: (form: FlightSearchFormData) => void;
  loading: boolean;
}

const FlightSearchForm: React.FC<Props> = ({
  form,
  setForm,
  onSearch,
  loading,
}) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof FlightSearchFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let val: string | number = value;

    // Handle number inputs
    if (name === "adults" || name === "maxResults") {
      val = Number(value);
      if (name === "adults") val = Math.max(1, val);
      if (name === "maxResults") val = Math.min(Math.max(1, val), 50);
    }

    // Update form state
    setForm((prev) => ({ ...prev, [name]: val }));

    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSearch = () => {
    const result = flightSearchSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FlightSearchFormData, string>> =
        {};
      result.error.issues.forEach((err: ZodIssue) => {
        if (err.path.length > 0) {
          const key = err.path[0] as keyof FlightSearchFormData;
          fieldErrors[key] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSearch(result.data);
  };

  const renderError = (field: keyof FlightSearchFormData) =>
    errors[field] ? (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end transition-shadow hover:shadow-md">
      {/* Origin */}
      <div className="flex flex-col">
        <label
          htmlFor="origin"
          className="text-gray-700 dark:text-gray-300 font-medium mb-1"
        >
          Origin
        </label>
        <input
          id="origin"
          name="origin"
          placeholder="JFK"
          value={form.origin}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {renderError("origin")}
      </div>

      {/* Destination */}
      <div className="flex flex-col">
        <label
          htmlFor="destination"
          className="text-gray-700 dark:text-gray-300 font-medium mb-1"
        >
          Destination
        </label>
        <input
          id="destination"
          name="destination"
          placeholder="LAX"
          value={form.destination}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {renderError("destination")}
      </div>

      {/* Departure Date */}
      <div className="flex flex-col">
        <label
          htmlFor="departureDate"
          className="text-gray-700 dark:text-gray-300 font-medium mb-1"
        >
          Departure
        </label>
        <input
          id="departureDate"
          name="departureDate"
          type="date"
          value={form.departureDate}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {renderError("departureDate")}
      </div>

      {/* Return Date */}
      <div className="flex flex-col">
        <label
          htmlFor="returnDate"
          className="text-gray-700 dark:text-gray-300 font-medium mb-1"
        >
          Return
        </label>
        <input
          id="returnDate"
          name="returnDate"
          type="date"
          value={form.returnDate ?? ""}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {renderError("returnDate")}
      </div>

      {/* Adults */}
      <div className="flex flex-col">
        <label
          htmlFor="adults"
          className="text-gray-700 dark:text-gray-300 font-medium mb-1"
        >
          Adults
        </label>
        <input
          id="adults"
          name="adults"
          type="number"
          min={1}
          value={form.adults}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-20 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {renderError("adults")}
      </div>

      {/* Max Results */}
      <div className="flex flex-col">
        <label
          htmlFor="maxResults"
          className="text-gray-700 dark:text-gray-300 font-medium mb-1"
        >
          Max Results
        </label>
        <input
          id="maxResults"
          name="maxResults"
          type="number"
          min={1}
          max={50}
          value={form.maxResults}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-20 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {renderError("maxResults")}
      </div>

      {/* Search Button */}
      <div className="md:col-span-3 flex justify-end">
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow-md"
        >
          {loading ? "Searching..." : "Search Flights"}
        </button>
      </div>
    </div>
  );
};

export default FlightSearchForm;
