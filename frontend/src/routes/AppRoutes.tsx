// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardPage from "../pages/DashboardPage";
import SavedTripPage from "../pages/SavedTripPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import ProfilePage from "../pages/ProfilePage";
import FlightSearchPage from "@/pages/FlightSearchPage";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/saved-trips" element={<SavedTripPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/flights" element={<FlightSearchPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
