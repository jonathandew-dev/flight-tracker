import React from "react";
import { Card } from "../components/Card";

const Home: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Flight Tracker</h1>
      <Card>
        <p>Track your flights, save your trips, and plan your travels easily!</p>
      </Card>
    </div>
  );
};

export default Home;
