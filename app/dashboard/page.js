"use client";
import React from "react";
import SideBar from "@/components/dashboad/SideBar";
import DashBoardWelcome from "@/components/dashboad/DashBoardWelcome";
import { NextResponse } from "next/server";
import { useState } from "react";

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("api/auth/logout", { method: "GET", credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        window.location.href = "/";
      } else {
        console.error("Logout failed:", data.error);
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SideBar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onLogout={handleLogout}
      />

      <main
        className={`p-8 transition-all duration-300 ease-in-out ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <DashBoardWelcome />
      </main>
    </div>
  );
};

export default Home;
