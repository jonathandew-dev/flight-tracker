import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-500 to-indigo-600 text-white py-20  text-center">
        <h1 className="text-5xl font-bold mb-4">Track Your Flights, Plan Your Adventures</h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Flight Tracker makes it easy to monitor flights, save trips, and
          plan your travels seamlessly. Stay organized and stress-free on the go.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-blue-600 font-bold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-transparent border border-white font-bold px-6 py-3 rounded hover:bg-white hover:text-blue-600 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50 text-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Flight Tracker?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-3">Track Flights Easily</h3>
            <p>Get real-time flight updates and never miss a flight again.</p>
          </div>
          <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-3">Save Your Trips</h3>
            <p>Keep all your planned trips in one place for easy access anytime.</p>
          </div>
          <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-3">Plan Ahead</h3>
            <p>Organize your travel schedule and manage your itineraries efficiently.</p>
          </div>
        </div>
      </section>

      {/* Optional Testimonials Section */}
      <section className="py-20 px-6 bg-blue-100 text-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded shadow">
            <p>"Flight Tracker has made my travel planning so much easier! Highly recommend."</p>
            <span className="block mt-4 font-bold">– Allison D.</span>
          </div>
         
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Flight Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
