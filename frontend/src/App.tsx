import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SavedTripPage from "./pages/SavedTripPage";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import { useAuthInit } from "./hooks/useAuthInit";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  const {loading} = useAuthInit();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <main className="p-4">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/saved-trips" element={<SavedTripPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
