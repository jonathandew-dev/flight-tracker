// src/hooks/useProfileForm.ts
import { useMemo } from "react";
import { useForm, useWatch, UseFormRegister } from "react-hook-form";
import { User } from "../utils/types";

export interface ProfileFormData {
  name: string;
  email: string;
}

interface UseProfileFormReturn {
  register: UseFormRegister<ProfileFormData>;
  avatarLetter: string;
  formValues: ProfileFormData;
}

export const useProfileForm = (initialData?: Partial<User>): UseProfileFormReturn => {
  const { register, control, getValues } = useForm<ProfileFormData>({
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
    },
  });

  // Use `useWatch` for safe subscription to the "name" field
  const nameValue = useWatch({
    control,
    name: "name",
    defaultValue: initialData?.name || "",
  });

  // Compute avatar letter
  const avatarLetter = useMemo(() => {
    return (nameValue?.trim()?.[0] || "U").toUpperCase();
  }, [nameValue]);

  // Expose full form values if needed
  const formValues = getValues();

  return {
    register,
    avatarLetter,
    formValues,
  };
};
