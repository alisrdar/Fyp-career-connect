// app/dashboard/layout.jsx (ya pages/dashboard/_app.jsx)
"use client";

import Sidebar from "@/components/dashboad/SideBar";
import MobileHeader from "@/components/dashboad/MobileHeader";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
// AuthProvider is already applied at app/layout.js

function InnerLayout({ children }) {
  const { collapsed, setCollapsed, sidebarOpen, setSidebarOpen, handleLogout } = useDashboard();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-background-dark">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <main className={`flex-1 transition-all ${collapsed ? "sm:pl-20" : "sm:pl-54"}`}>
        <MobileHeader />
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <InnerLayout>{children}</InnerLayout>
    </DashboardProvider>
  );
}
