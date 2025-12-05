// src/components/FlightForm.tsx
import React, { useState } from "react";
import { Button } from "../Button";
import { Flight } from "../../utils/types";

interface FlightFormProps {
  onSubmit: (flight: Flight) => void;
  onCancel: () => void;
}

const FlightForm: React.FC<FlightFormProps> = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    flightNumber: "",
    origin: "",
    destination: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { flightNumber, origin, destination } = form;
    if (!flightNumber || !origin || !destination) {
      alert("Please fill out all flight fields");
      return;
    }
    onSubmit({ ...form, id: crypto.randomUUID?.() ?? Date.now().toString() });
    setForm({ flightNumber: "", origin: "", destination: "" });
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        name="flightNumber"
        placeholder="Flight #"
        value={form.flightNumber}
        onChange={handleChange}
        className="border p-1 rounded"
      />
      <input
        name="origin"
        placeholder="Origin"
        value={form.origin}
        onChange={handleChange}
        className="border p-1 rounded"
      />
      <input
        name="destination"
        placeholder="Destination"
        value={form.destination}
        onChange={handleChange}
        className="border p-1 rounded"
      />
      <Button onClick={handleSubmit}>Add Flight</Button>
      <Button onClick={onCancel} className="bg-gray-300">Cancel</Button>
    </div>
  );
};

export default FlightForm;
