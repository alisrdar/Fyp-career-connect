"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";

const FAQ = ({ title, description }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-surface px-8 py-6 rounded-lg shadow-sm dark:shadow-[0_4px_8px_rgba(255,255,255,0.05)] text-foreground-light dark:text-foreground-dark transition-all duration-300  dark:border-border-dark">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex justify-between items-center focus:outline-none"
      >
        <h2 className="text-base sm:text-lg font-semibold text-left">
          {title}
        </h2>
        <span className="p-2 rounded-full ">
          <Plus
            className={`w-7 h-7 transition-transform duration-300 ${
              open ? "rotate-90" : "rotate-0"
            }`}
          />
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } overflow-hidden`}
      >
        <div className="mt-2 text-sm font-light text-muted dark:text-extra-muted/80 overflow-hidden">
          {description}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
