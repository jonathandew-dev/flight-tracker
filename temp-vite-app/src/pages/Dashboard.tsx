import React from "react";
import { Link } from "react-router-dom";
import { useSavedTrips } from "../api/savedTripService";

const Dashboard: React.FC = () => {
  const { data: trips, isLoading, error } = useSavedTrips();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="mb-6 text-gray-700">Welcome back! Here’s a quick overview of your trips and actions:</p>

      {isLoading && <p>Loading trips...</p>}
      {error && <p className="text-red-500">Error loading trips: {error.message}</p>}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link
          to="/saved-trips"
          className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Saved Trips</h2>
          <p className="text-gray-500 text-sm">You have {trips?.length || 0} saved trips.</p>
        </Link>

        {/* Placeholder features */}
        <Link
          to="/dashboard"
          className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Upcoming Flights</h2>
          <p className="text-gray-500 text-sm">Check upcoming flights and itineraries.</p>
        </Link>

        <Link
          to="/dashboard"
          className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
          <p className="text-gray-500 text-sm">Update your account information and preferences.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
