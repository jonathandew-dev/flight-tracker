import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import SavedTripPage from "../pages/SavedTripPage";
import NavBar from "../components/NavBar";
import {ProtectedRoute} from "../components/ProtectedRoute";
import ProfilePage from "../pages/ProfilePage";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/saved-trips" element={<SavedTripPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
};

export default AppRoutes;
