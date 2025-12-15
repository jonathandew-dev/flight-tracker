// src/components/forms/FlightSearchForm.tsx
import React, { useState } from "react";
import { flightSearchSchema, FlightSearchFormData } from "@/utils/flightSearchSchema";
import FloatingInput from "@/components/FloatingInput";
import DateRangePicker from "@/components/ui/DateRangePicker";
import Spinner from "../ui/Spinner";
import { Search } from "lucide-react";

interface Props {
  form: FlightSearchFormData;
  setForm: (val: FlightSearchFormData | ((prev: FlightSearchFormData) => FlightSearchFormData)) => void;
  onSearch: (form: FlightSearchFormData) => void;
  loading: boolean;
}

const FlightSearchForm: React.FC<Props> = ({ form, setForm, onSearch, loading }) => {
  const [errors, setErrors] = useState<Partial<Record<keyof FlightSearchFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let val: string | number = value;

    if (name === "adults" || name === "maxResults") {
      val = Number(value);
      if (name === "adults") val = Math.max(1, val);
      if (name === "maxResults") val = Math.min(Math.max(1, val), 50);
    }

    setForm(prev => ({ ...prev, [name]: val }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleDateRangeChange = (start: string, end?: string) => {
    setForm(prev => ({ ...prev, departureDate: start, returnDate: end }));
    setErrors(prev => ({ ...prev, departureDate: undefined, returnDate: undefined }));
  };

  const handleSearch = () => {
    const result = flightSearchSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FlightSearchFormData, string>> = {};
      result.error.issues.forEach(err => {
        const key = err.path[0] as keyof FlightSearchFormData;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    onSearch(result.data);
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 flex flex-wrap sm:flex-nowrap items-center gap-3 w-full max-w-4xl">

        {/* Left: Origin & Destination */}
        <div className="flex gap-2 flex-none">
          <div className="w-28">
            <FloatingInput label="Origin" name="origin" value={form.origin} onChange={handleChange} error={errors.origin} />
          </div>
          <div className="w-28">
            <FloatingInput label="Destination" name="destination" value={form.destination} onChange={handleChange} error={errors.destination} />
          </div>
        </div>

        {/* Center: Date Picker */}
        <div className="flex-1 min-w-0">
          <DateRangePicker
            startDate={form.departureDate}
            endDate={form.returnDate}
            onChange={handleDateRangeChange}
            startError={errors.departureDate}
            endError={errors.returnDate}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm min-w-0"
          />
        </div>

        {/* Right: Adults & Max */}
        <div className="flex gap-2 flex-none">
          <div className="w-20">
            <FloatingInput label="Adults" name="adults" type="number" value={form.adults} onChange={handleChange} error={errors.adults} />
          </div>
          <div className="w-20">
            <FloatingInput label="Max" name="maxResults" type="number" value={form.maxResults} onChange={handleChange} error={errors.maxResults} />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex-none">
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <Spinner size={20} color="white" /> : <Search className="h-5 w-5" />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default FlightSearchForm;
