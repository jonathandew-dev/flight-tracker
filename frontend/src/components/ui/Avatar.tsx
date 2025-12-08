// src/components/ui/Avatar.tsx
import React from "react";
import { cn } from "@/utils/cn";

interface AvatarProps {
  size?: number;
  children?: React.ReactNode;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ size = 40, children, className }) => {
  return (
    <div
      className={cn(
        "rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold",
        className
      )}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
};
