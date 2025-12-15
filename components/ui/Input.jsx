"use client";
import React from "react";

const Input = ({ label, type = "text", placeholder, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-md font-medium text-foreground mb-1">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className={`px-4 py-2 rounded-md border border-border bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
