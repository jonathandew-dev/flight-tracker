// src/components/NavBar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";


const NavBar: React.FC = () => {
  const navigate = useNavigate();

  // Correct Zustand usage
   const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);


  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-bold text-blue-600">
          Flight Tracker
        </Link>
      </div>

      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-500">
          Home
        </Link>

        {user ? (
          <>
            <Link to="/saved-trips" className="hover:text-blue-500">
              Saved Trips
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-500">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-500">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
