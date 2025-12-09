import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Eye, EyeOff } from "lucide-react";
import { Button } from "../Button";
import { toast } from "react-hot-toast";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordFormProps {
  changePassword: {
    mutateAsync: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  };
}

const getPasswordStrength = (password: string) => {
  if (!password) return "";
  if (password.length < 6) return "Weak";
  if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return "Strong";
  return "Medium";
};
const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ changePassword }) => {
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<PasswordFormValues>();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const newPasswordValue = watch("newPassword") || "";
  const passwordStrength = getPasswordStrength(newPasswordValue);

  const onSubmit = async (data: PasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
      toast.success("Password changed successfully!");
    } catch {
      toast.error("Failed to change password");
    }
  };

  const strengthColor = passwordStrength === "Weak" ? "bg-red-500" :
                        passwordStrength === "Medium" ? "bg-yellow-500" :
                        passwordStrength === "Strong" ? "bg-green-500" : "bg-transparent";

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Current Password */}
        <div className="relative">
          <label className="block text-gray-500 dark:text-gray-300 text-sm mb-1">Current Password</label>
          <input
            type={showCurrent ? "text" : "password"}
            {...register("currentPassword")}
            placeholder="Enter current password"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
            aria-label="Toggle current password visibility"
          >
            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block text-gray-500 dark:text-gray-300 text-sm mb-1">New Password</label>
          <input
            type={showNew ? "text" : "password"}
            {...register("newPassword")}
            placeholder="Enter new password"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
            aria-label="Toggle new password visibility"
          >
            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          {newPasswordValue && (
            <div className="mt-1 flex items-center gap-2">
              <p className={`text-sm font-medium ${passwordStrength === "Weak" ? "text-red-500" : passwordStrength === "Medium" ? "text-yellow-500" : "text-green-500"}`}>
                Strength: {passwordStrength}
              </p>
              <div className="flex-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                <div className={`h-1 ${strengthColor} transition-all`} style={{ width: passwordStrength === "Weak" ? "33%" : passwordStrength === "Medium" ? "66%" : "100%" }} />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-gray-500 dark:text-gray-300 text-sm mb-1">Confirm New Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirm new password"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
            aria-label="Toggle confirm password visibility"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition mt-2"
        >
          <Save size={16} /> {isSubmitting ? "Changing..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;


