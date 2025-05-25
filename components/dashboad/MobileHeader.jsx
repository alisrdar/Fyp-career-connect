"use client";
import { MenuIcon, BellIcon, LogOutIcon } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

const MobileHeader =() => {
  const { setSidebarOpen, handleLogout, loading } = useDashboard();

  return (
    <header className="flex items-center justify-between p-4 bg-gray-50 dark:text-foreground-dark dark:bg-background-dark shadow sm:hidden">
      <button onClick={() => setSidebarOpen(true)}>
        <MenuIcon className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-bold">Dashboard</h1>
      <div className="flex items-center space-x-3">
        <BellIcon className="w-6 h-6" />
        <button onClick={handleLogout} disabled={loading}>
          <LogOutIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
export default MobileHeader