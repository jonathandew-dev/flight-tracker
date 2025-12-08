// src/components/ui/Divider.tsx
import React from "react";

interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className }) => (
  <hr className={`border-t border-gray-300 my-2 ${className}`} />
);
