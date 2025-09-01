"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThemeToggler from "@/components/ui/ThemeToggler";
import { ArrowLeft } from "lucide-react";
import { useDarkMode } from "@/context/ThemeContext";
const QuizTopBar = ({ currentStep, totalSteps, exitText = "Quiz" }) => {
  const { theme } = useDarkMode();
  const router = useRouter();
  const logoSrc =
    theme === "dark" ? "/pgec_logo_white_Svg.png" : "/pegcLogo_black.png";

  return (
    <header className="
      flex flex-col sm:flex-row 
      items-center sm:justify-between 
      px-3 py-2 sm:px-4 sm:py-3 
      bg-white dark:bg-background-dark 
      border-b border-gray-200 dark:border-gray-700
      gap-2
    ">
      {/* Logo + Title */}
      <Link href="/dashboard">
        <div className="flex items-center gap-2">
          <Image src={logoSrc} alt="Logo" width={36} height={36} />
          {/* hide text on xs, show on sm+ */}
          <span className="hidden sm:inline text-base font-bold text-gray-800 dark:text-white">
            Career Connect
          </span>
        </div>
      </Link>

      {/* Progress + Exit + Theme toggle */}
      <div className="
        w-full sm:w-auto 
        flex flex-wrap sm:flex-nowrap 
        items-center justify-between sm:justify-end 
        gap-2
      ">
        {/* progress only on md+ */}
        {currentStep && totalSteps && (
          <span className="hidden md:inline text-sm font-medium text-muted-foreground dark:text-gray-300">
            Q {currentStep} / {totalSteps}
          </span>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-primary dark:text-accent text-sm hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Exit
        </button>

        <ThemeToggler />
      </div>
    </header>
  );
};

export default QuizTopBar;
