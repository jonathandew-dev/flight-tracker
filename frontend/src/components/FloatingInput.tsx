// src/components/FloatingInput.tsx
import React from "react";
import { cn } from "@/utils/cn";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        <div className="relative">
          <input
            ref={ref}
            placeholder=" "
            className={cn(
              `
              w-full border-b border-gray-300 py-2 bg-inherit text-gray-900 dark:text-gray-100
              focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none
              peer
              `,
              error && "border-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
          <label
            className={cn(
              `
              absolute left-0 -top-4 text-xs text-gray-500 cursor-text
              transition-all
              peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm
              peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-700
              `,
              error && "text-red-500 peer-focus:text-red-500"
            )}
          >
            {label}
          </label>
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";
export default FloatingInput;
