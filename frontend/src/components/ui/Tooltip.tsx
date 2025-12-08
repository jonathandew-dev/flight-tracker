// src/components/ui/Tooltip.tsx
import React, { ReactNode, useState } from "react";
// import { cn } from "../../utils/cn"

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
          {content}
        </div>
      )}
    </div>
  );
};
