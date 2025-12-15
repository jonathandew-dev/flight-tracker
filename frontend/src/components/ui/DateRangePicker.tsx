// src/components/ui/DateRangePicker.tsx
import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

interface DateRangePickerProps {
  startDate: string;
  endDate?: string;
  onChange: (start: string, end?: string) => void;
  startError?: string;
  endError?: string;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  startError,
  endError,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value, endDate);
  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(startDate, e.target.value);

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d");
    } catch {
      return dateStr;
    }
  };

  const displayText = startDate
    ? endDate
      ? `${formatDate(startDate)} → ${formatDate(endDate)}`
      : `${formatDate(startDate)} → Return`
    : "Select dates";

  return (
    <div ref={pickerRef} className={`relative ${className} min-w-0`}>
      {/* Collapsed Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 border rounded-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm shadow-sm hover:shadow-md min-w-0 w-full overflow-hidden"
      >
        <Calendar size={16} className="text-gray-400 shrink-0" />
        <span className="truncate text-left flex-1 text-gray-700 dark:text-gray-200">
          {displayText}
        </span>
      </button>

      {/* Expanded Inputs */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg z-50 flex flex-col gap-3 w-[300px] sm:flex-row sm:w-auto">
          <div className="flex-1 min-w-0">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Departure
            </label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartChange}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            />
            {startError && <p className="text-xs text-red-500 mt-1">{startError}</p>}
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Return (Optional)
            </label>
            <input
              type="date"
              value={endDate || ""}
              onChange={handleEndChange}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            />
            {endError && <p className="text-xs text-red-500 mt-1">{endError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
