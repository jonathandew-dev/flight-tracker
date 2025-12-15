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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar hideAuthenticatedLinks={hideAuthenticatedLinks} />
      <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
