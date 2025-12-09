import React, { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 transition placeholder:text-gray-400",
        error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400 dark:border-gray-600 dark:focus:ring-blue-500",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
