import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { user } = useContext(AuthContext);

  // If no user, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If user exists, render child routes
  return <Outlet />;
};

export default ProtectedRoute;