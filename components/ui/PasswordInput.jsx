// components/forms/PasswordInput.jsx
"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from 'lucide-react'; // or use any icon library

const PasswordInput = ({ id, label, register, name, validation, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-sm font-medium text-white/80 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          {...register(name, validation)}
          placeholder="Enter your password"
          className="p-2.5 rounded-xl border border-gray-300 bg-white/70 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary w-full"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-500 dark:text-gray-300"
          onClick={() => setShowPassword((prev) => !prev)}
        >
         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error.message}</span>}
    </div>
  );
};

export default PasswordInput;
