import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ProfileForm from "../components/forms/ProfileForm";
import ChangePasswordForm from "../components/forms/ChangePasswordForm";
import { useAuthStore } from "../store/authStore";
import { useUpdateUser, useChangePassword } from "../api/authService";

const ProfilePage: React.FC = () => {
  const { user, logout, setUser } = useAuthStore();
  const navigate = useNavigate();

  const updateUser = useUpdateUser();
  const changePassword = useChangePassword();

  // Wrapper for React Query mutation
  const updateUserWrapper = {
    mutateAsync: async (data: { firstName?: string; lastName?: string }) => {
      console.log("Sending to updateUser:", data);
      const updated = await updateUser.mutateAsync(data);
      console.log("Returned from API:", updated);

      // Directly set updated user in Zustand
      setUser(updated);
      return updated;
    },
  };

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

      <ProfileForm user={user} updateUser={updateUserWrapper} setUser={setUser} />

      <ChangePasswordForm changePassword={changePassword} />

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
