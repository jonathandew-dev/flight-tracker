// src/components/ActionButtons.tsx
import React, { useContext } from "react";
import { Sun, Moon, LogOut } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";

const ActionButtons: React.FC = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded transition-colors duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-center"
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-500 dark:text-gray-200" />}
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="p-2 rounded transition-colors duration-200 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 flex items-center justify-center"
        title="Logout"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
};

export default ActionButtons;
