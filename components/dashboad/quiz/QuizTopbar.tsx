"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggler from "@/components/ui/ThemeToggler";
import { ArrowLeft } from "lucide-react";
import { useDarkMode } from "@/context/ThemeContext";

type QuizTopBarProps = {
  currentStep?: number;
  totalSteps?: number;
  exitText?: string;
};

const QuizTopBar = ({ currentStep, totalSteps, exitText = "Quiz" }: QuizTopBarProps) => {
  const themeContext = useDarkMode();
  const router = useRouter();
  
  // Handle both string and object return types from useDarkMode
  const theme = typeof themeContext === 'string'
    ? themeContext
    : (themeContext as { theme?: string })?.theme ?? 'light';
  const logoSrc = theme === "dark" ? "/pgec_logo_white_Svg.png" : "/pegcLogo_black.png";

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo + Title */}
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logoSrc} alt="Logo" className="w-8 h-8 sm:w-9 sm:h-9" />
          <span className="hidden xs:inline text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Career Connect
          </span>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Progress indicator */}
          {currentStep && totalSteps && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                {currentStep} / {totalSteps}
              </span>
            </div>
          )}

          {/* Mobile progress */}
          {currentStep && totalSteps && (
            <div className="sm:hidden flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {currentStep}/{totalSteps}
              </span>
            </div>
          )}

          {/* Exit button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Exit</span>
          </button>

          {/* Theme toggle */}
          <div className="scale-90 sm:scale-100">
            <ThemeToggler />
          </div>
        </div>
      </div>
    </header>
  );
};

export default QuizTopBar;
