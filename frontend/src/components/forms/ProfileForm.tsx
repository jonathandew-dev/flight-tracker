import React, { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Save, X } from "lucide-react";
import { Button } from "../Button";
import { Input } from "../Input";
import { toast } from "react-hot-toast";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

interface ProfileFormProps {
  user: User;
  updateUser: {
    mutateAsync: (data: {
      firstName?: string;
      lastName?: string;
    }) => Promise<User>;
  };
  setUser: (user: User) => void;
}

// Helper to generate initials
const getInitials = (firstName?: string | null, lastName?: string | null) => {
  const f = firstName?.trim() || "";
  const l = lastName?.trim() || "";
  if (f && l) return (f[0] + l[0]).toUpperCase();
  if (f) return f[0].toUpperCase();
  if (l) return l[0].toUpperCase();
  return "U";
};

const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  updateUser,
  setUser,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    },
  });

  const watchedFirst = useWatch({ control, name: "firstName" });
  const watchedLast = useWatch({ control, name: "lastName" });

  const avatar = useMemo(
    () =>
      getInitials(watchedFirst ?? user.firstName, watchedLast ?? user.lastName),
    [watchedFirst, watchedLast, user.firstName, user.lastName]
  );

  const onSubmit = async (data: ProfileFormValues) => {
    const trimmed = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
    };

    try {
      const updated = await updateUser.mutateAsync(trimmed);
      setUser(updated);

      reset({
        firstName: updated.firstName || "",
        lastName: updated.lastName || "",
      });

      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 transition hover:shadow-lg">
      {/* Avatar */}
      <div
        className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-200"
        aria-label={`User initials: ${avatar}`}
      >
        {avatar}
      </div>

      <div className="flex-1 w-full flex flex-col gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-500 dark:text-gray-300 text-sm mb-1">
              First Name
            </label>
            <Input
              {...register("firstName")}
              placeholder="John"
              disabled={isSubmitting}
              className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-500 dark:text-gray-300 text-sm mb-1">
              Last Name
            </label>
            <Input
              {...register("lastName")}
              placeholder="Doe"
              disabled={isSubmitting}
              className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-500 dark:text-gray-300 text-sm mb-1">
              Email
            </label>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
              {user.email}
            </p>
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            <Button
              type="submit"
              variant="primary"
              disabled={!isDirty || isSubmitting}
            >
              <Save size={16} /> {isSubmitting ? "Saving..." : "Save"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                reset({
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                })
              }
            >
              <X size={16} /> Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
