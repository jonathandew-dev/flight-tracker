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

  // eslint-disable-next-line react-hooks/incompatible-library
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

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Current Password */}
        <div className="relative">
          <label className="block text-gray-500 text-sm mb-1">Current Password</label>
          <input type={showCurrent ? "text" : "password"} {...register("currentPassword")} placeholder="Enter current password" className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/>
          <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-[34px] text-gray-500">
            {showCurrent ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block text-gray-500 text-sm mb-1">New Password</label>
          <input type={showNew ? "text" : "password"} {...register("newPassword")} placeholder="Enter new password" className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/>
          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-[34px] text-gray-500">
            {showNew ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
          {newPasswordValue && <p className={`mt-1 text-sm ${passwordStrength === "Weak" ? "text-red-500" : passwordStrength === "Medium" ? "text-yellow-500" : "text-green-500"}`}>
            Strength: {passwordStrength}
          </p>}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-gray-500 text-sm mb-1">Confirm New Password</label>
          <input type={showConfirm ? "text" : "password"} {...register("confirmPassword")} placeholder="Confirm new password" className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/>
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-[34px] text-gray-500">
            {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        </div>

        <div className="mt-4 flex gap-3">
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 transition">
            <Save size={16}/> {isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
