// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SavedTripPage from "../pages/SavedTripPage";
import ProfilePage from "../pages/ProfilePage";
import FlightSearchPage from "@/pages/FlightSearchPage";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/saved-trips"
            element={
              <DashboardLayout>
                <SavedTripPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/flights"
            element={
              <DashboardLayout>
                <FlightSearchPage />
              </DashboardLayout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
