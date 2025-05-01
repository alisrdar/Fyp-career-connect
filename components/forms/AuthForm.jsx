// components/forms/AuthForm.jsx
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button"; // adjust path if needed
import Link from "next/link";

const AuthForm = ({
  title = "Auth Form",
  btnText = "Submit",
  fields = [],
  onSubmit,
  redirectText,
  redirectHref,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-surface p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {title}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {fields.map(({ name, label, type = "text", required, placeholder }) => (
          <div key={name} className="flex flex-col">
            <label
              htmlFor={name}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {label}
            </label>
            <input
              id={name}
              type={type}
              {...register(name, { required })}
              placeholder={placeholder}
              className="p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors[name] && (
              <span className="text-red-500 text-xs mt-1">{label} is required</span>
            )}
          </div>
        ))}
        <Button btnText={btnText} variant="primary" className="w-full" />
      </form>

      {redirectText && redirectHref && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          {redirectText}{" "}
          <Link href={redirectHref} className="text-primary hover:underline">
            {btnText === "Reset Password" ? "Go back" : "Click here"}
          </Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
