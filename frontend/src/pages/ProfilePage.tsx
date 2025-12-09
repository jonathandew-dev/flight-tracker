import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ProfileForm from "../components/forms/ProfileForm";
import ChangePasswordForm from "../components/forms/ChangePasswordForm";
import { useAuthStore } from "../store/authStore";
import { useUpdateUser, useChangePassword } from "../api/authService";
import { Button } from "../components/Button";

const ProfilePage: React.FC = () => {
  const { user, logout, setUser } = useAuthStore();
  const navigate = useNavigate();

  const updateUser = useUpdateUser();
  const changePassword = useChangePassword();

  const updateUserWrapper = {
    mutateAsync: async (data: { firstName?: string; lastName?: string }) => {
      const updated = await updateUser.mutateAsync(data);
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
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center">Profile</h1>

      {/* Profile form */}
      <ProfileForm user={user} updateUser={updateUserWrapper} setUser={setUser} />

      {/* Change password */}
      <ChangePasswordForm changePassword={changePassword} />

      {/* Logout */}
      <div className="flex justify-center">
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
