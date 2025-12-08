import React, { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Input = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";