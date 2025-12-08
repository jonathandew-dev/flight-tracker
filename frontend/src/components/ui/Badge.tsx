// src/components/ui/Badge.tsx
import React from "react";
import { cn } from "@/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  color?: "blue" | "gray" | "red";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = "gray", className }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
  };
  return <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", colors[color], className)}>{children}</span>;
};
