import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Home, Search, User, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { icon: Home, path: "/dashboard" },
  { icon: Search, path: "/flights" },
  { icon: User, path: "/profile" },
];

const NavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (["/", "/login", "/register"].includes(location.pathname)) return null;

  const handleLogout = () => {
    logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderNavItems = () =>
    navItems.map((item, idx) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={idx}
          to={item.path}
          title={item.path.replace("/", "").toUpperCase() || "Dashboard"}
          className={`p-2 rounded transition-colors duration-200 ${
            isActive
              ? "text-blue-600 bg-blue-100"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
          }`}
        >
          <Icon size={20} />
        </Link>
      );
    });

  return (
    <nav className="bg-white shadow-md px-4 py-2 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Flight Tracker
      </Link>

      {user && (
        <>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            {renderNavItems()}
            <button
              onClick={handleLogout}
              className="p-2 rounded text-red-500 hover:text-red-600 hover:bg-gray-100 transition"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="absolute top-16 right-4 bg-white shadow-md rounded-md flex flex-col items-center p-4 gap-2 md:hidden">
              {renderNavItems()}
              <button
                onClick={handleLogout}
                className="p-2 rounded text-red-500 hover:text-red-600 hover:bg-gray-100 transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </nav>
  );
};

export default NavBar;
