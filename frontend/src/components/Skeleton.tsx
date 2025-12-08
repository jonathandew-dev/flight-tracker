import React from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
  rounded?: boolean;
  as?: React.ElementType;
}

const Skeleton: React.FC<SkeletonProps & React.ComponentPropsWithoutRef<React.ElementType>> = ({
  className,
  rounded = true,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={cn(
        "bg-gray-200 dark:bg-gray-700 animate-pulse",
        rounded ? "rounded-md" : "",
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
