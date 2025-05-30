"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Button from "../ui/Button";


const ContactForm = ({
  title = "Contact Us",
  gridFields = [],
  fields = [],
  btnText = "Submit",
  onSubmit: userSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleFormSubmit = (data) => {
    if (userSubmit) userSubmit(data);
    setIsOpen(false);
  };

  return (
    <>
      {/* CARD trigger */}
      <div
        onClick={() => setIsOpen(true)}
        className="max-w-sm mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg
                   cursor-pointer hover:shadow-xl transition-shadow"
      >
        <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Click to submit your feedback
        </p>
      </div>

      {isOpen && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* modal panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="relative w-full max-w-3xl p-8 bg-white/80 backdrop-blur-md rounded-lg
                         shadow-xl border border-white/20 text-foreground-light dark:text-foreground-dark
                         dark:bg-surface overflow-auto max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close form"
              >
                <X size={24} />
              </button>

              {/* form */}
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-5"
              >
                <input type="hidden" {...register("formError")} />

                {/* first four in 2-col grid */}
                {gridFields.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gridFields.map((f) => renderField(f, register, errors))}
                  </div>
                )}

                {/* the rest */}
                {fields.map((f) => renderField(f, register, errors))}

                {errors.formError && (
                  <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center mb-4">
                    {errors.formError.message}
                  </p>
                )}

                <Button
                  btnText={isSubmitting ? "Sending..." : btnText}
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                  type="submit"
                  size="lg"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};


function renderField({ name, label, type = "text", placeholder, validation, options }, register, errors) {
    return (
        <div key={name}>
            {type !== "checkbox" && (
                <label htmlFor={name} className="text-sm font-medium mb-1 block">
                    {label}
                </label>
            )}

            {type === "textarea" ? (
                <textarea
                    id={name}
                    {...register(name, validation)}
                    placeholder={placeholder}
                    rows={5}
                    className="w-full p-3 rounded-xl border border-gray-300 bg-white/70 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
            ) : type === "select" ? (
                <select
                    id={name}
                    {...register(name, validation)}
                    className="w-full p-3 rounded-xl border border-gray-300 bg-white/70 text-black focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">{placeholder || "Select one"}</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            ) : type === "radio" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {options.map((opt) => (
                        <label key={opt} className="flex items-center gap-2">
                            <input type="radio" value={opt} {...register(name, validation)} />
                            <span className="text-muted dark:text-extra-muted">{opt}</span>
                        </label>
                    ))}
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <input
                        id={name}
                        type={type}
                        {...register(name, validation)}
                        placeholder={placeholder}
                        className="p-3 rounded-xl border border-gray-300 bg-white/70 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {type === "checkbox" && <span>{label}</span>}
                </div>
            )}

            {errors[name] && (
                <span className="text-red-500 text-xs mt-1 block">{errors[name]?.message}</span>
            )}
        </div>
    );
}
export default ContactForm;
