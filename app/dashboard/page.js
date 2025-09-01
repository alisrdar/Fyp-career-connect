import React from "react";
import DashBoardWelcome from "@/components/dashboad/DashBoardWelcome";


const Home = () => {

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-background-dark">
      

      <main
        className={`
          flex-1 flex flex-col transition-all duration-300
          
        `}
      >
        {/* Actual content */}
        <DashBoardWelcome />
      </main>
    </div>
  );
};

export default Home;
