// src/pages/ProfilePage.tsx
import React, { useEffect, useMemo } from "react";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { Save, LogOut, X } from "lucide-react";
import { useUpdateUser } from "../api/authService";
import { useForm, useWatch } from "react-hook-form";
import DashboardLayout from "@/components/DashboardLayout";
import { toast} from 'react-hot-toast';

interface ProfileFormValues {
  name?: string | null;
}

const ProfilePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const updateUser = useUpdateUser();

  // Redirect if no user
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const { register, handleSubmit, reset, control, formState: { isSubmitting, isDirty } } = useForm<ProfileFormValues>({
    defaultValues: { name: user?.name || "" },
  });

  // Reset form if user changes externally
  useEffect(() => {
    if (user) reset({ name: user.name || "" });
  }, [user, reset]);

  // Live avatar letter using useWatch
  const watchedName = useWatch({ control, name: "name" });
  const avatarLetter = useMemo(() => {
    return (watchedName?.trim()?.[0] || "U").toUpperCase();
  }, [watchedName]);

 const onSubmit = async (data: ProfileFormValues) => {
  try {
    const trimmedName = data.name?.trim() || null;
    await updateUser.mutateAsync({ name: trimmedName });
    reset({ name: trimmedName }); // reset dirty state
    toast.success("Profile updated successfully!"); // <-- success toast
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile. Please try again."); // <-- error toast
  }
};

  const handleLogout = () => {
  logout();
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  toast.success("Logged out successfully");
  navigate("/login");
};

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 transition hover:shadow-lg">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
            {avatarLetter}
          </div>

          {/* User Info */}
          <div className="flex-1 w-full flex flex-col gap-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-gray-500 text-sm mb-1">Name</label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Enter your name (optional)"
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-500 text-sm mb-1">Email</label>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3 flex-wrap">
                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition"
                  disabled={!isDirty || isSubmitting}
                >
                  <Save size={16} /> {isSubmitting ? "Saving..." : "Save"}
                </Button>

                <Button
                  type="button"
                  onClick={() => reset()}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  <X size={16} /> Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 transition"
                >
                  <LogOut size={16} /> Logout
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
