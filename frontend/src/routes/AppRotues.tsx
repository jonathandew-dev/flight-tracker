import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SavedTrips from "../pages/SavedTrips";
import React from "react";

export const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<div className="p-6">Home Page</div>} />
      <Route path="/saved-trips" element={<SavedTrips />} />
    </Routes>
  </Router>
);
