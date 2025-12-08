// src/components/DashboardLayout.tsx
// src/components/DashboardLayout.tsx
import React from "react";
import NavBar from "./NavBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  hideAuthenticatedLinks?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  hideAuthenticatedLinks,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar hideAuthenticatedLinks={hideAuthenticatedLinks} />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
