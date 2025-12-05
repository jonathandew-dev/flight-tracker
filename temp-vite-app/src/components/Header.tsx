import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Flight Tracker
      </Link>
      <nav className="space-x-4">
        <Link to="/saved-trips" className="hover:underline">
          Saved Trips
        </Link>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link to="/register" className="hover:underline">
          Register
        </Link>
      </nav>
    </header>
  );
};

export default Header;
