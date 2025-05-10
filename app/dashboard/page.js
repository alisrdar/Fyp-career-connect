import React from "react";
import SideBar from "@/components/dashboad/SideBar";
import DashBoardWelcome from "@/components/dashboad/DashBoardWelcome";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <SideBar />
      <main className="flex-1 p-8 ">
        <DashBoardWelcome />
      </main>
    </div>
  );
};

export default Home;
