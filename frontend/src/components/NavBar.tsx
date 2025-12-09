// src/components/NavBar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, User, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import ActionButtons from "./ActionButtons";

const navItems = [
  { icon: Home, path: "/dashboard" },
  { icon: Search, path: "/flights" },
  { icon: User, path: "/profile" },
];

const NavBar: React.FC<{ hideAuthenticatedLinks?: boolean }> = ({ hideAuthenticatedLinks }) => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderNavLinks = () =>
    navItems.map((item, idx) => {
      if (!user || hideAuthenticatedLinks) return null;
      const Icon = item.icon;
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={idx}
          to={item.path}
          className={`p-2 rounded flex items-center justify-center transition-colors duration-200
            ${isActive
              ? "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-gray-800"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700"
            }`}
        >
          <Icon size={20} />
        </Link>
      );
    });

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-4 py-2 flex justify-between items-center relative">
      {/* Logo */}
      <Link to="/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
        Flight Tracker
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-4">
        {renderNavLinks()}
        {user && !hideAuthenticatedLinks && <ActionButtons />}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} className="text-gray-700 dark:text-gray-300" /> : <Menu size={24} className="text-gray-700 dark:text-gray-300" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-12 right-4 bg-white dark:bg-gray-900 shadow-md rounded-md flex flex-col items-center p-4 gap-2 md:hidden z-50">
          {renderNavLinks()}
          {user && !hideAuthenticatedLinks && <ActionButtons />}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
