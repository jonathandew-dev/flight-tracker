import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome back! Here are your quick links:</p>
      <ul className="mt-4 list-disc list-inside">
        <li>
          <Link to="/saved-trips" className="text-blue-500 hover:underline">
            Saved Trips
          </Link>
        </li>
        {/* Add more links for future protected pages */}
      </ul>
    </div>
  );
};

export default Dashboard;
