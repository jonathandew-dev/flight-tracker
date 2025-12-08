// src/hooks/useFormFieldWatcher.ts
import { useWatch, UseFormReturn, FieldValues, Path } from "react-hook-form";

export const useFormFieldWatcher = <T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T> 
) => {
  const value = useWatch({
    control: form.control,
    name: fieldName,
  });

  return value;
};
