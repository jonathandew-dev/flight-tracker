// src/pages/ProfilePage.tsx
import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { Edit, Save, LogOut, X } from "lucide-react";
import { useUpdateUser } from "../api/authService";

const ProfilePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const { mutateAsync: updateUser } = useUpdateUser();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSave = async () => {
    const updatedName = name.trim() || null;
    await updateUser({ name: updatedName });
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 transition hover:shadow-lg">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
          {name && name.trim() ? name.trim()[0].toUpperCase() : "U"}
        </div>

        {/* User Info */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-gray-500 text-sm mb-1">Name</label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name (optional)"
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            ) : (
              <p className="text-lg font-medium">{name || "Unnamed User"}</p>
            )}
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-gray-500 text-sm mb-1">Email</label>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3 flex-wrap">
            {editing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  <Save size={16} /> Save
                </Button>
                <Button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  <X size={16} /> Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  <Edit size={16} /> Edit
                </Button>
                <Button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 transition"
                >
                  <LogOut size={16} /> Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
