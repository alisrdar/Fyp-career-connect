// components/forms/ContactForm.jsx
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";

const ContactForm = ({
    title = "Contact Us",
    btnText = "Submit",
    gridFields = [],    // ← new
    fields = [],
    onSubmit,
    onSuccess,
}) => {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const handleFormSubmit = async (data) => {
        const success = await onSubmit(data, setError);
        if (success && onSuccess) {
            onSuccess();
            reset();
        }
    };

    return (
        <div className="w-full max-w-3xl ml-auto p-8 bg-white/80 backdrop-blur-md rounded-lg shadow-xl border border-white/20 text-foreground-light dark:text-foreground-dark dark:bg-surface">
            

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                <input type="hidden" {...register("formError")} />

                {/* ─── First Four in a 2‑col Grid ─── */}
                {gridFields.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gridFields.map(f => renderField(f))}
                    </div>
                )}

                {/* ─── The Rest of the Fields ─── */}
                {fields.map(f => renderField(f))}

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
    );

    // ─── helper to render any field type ───
    function renderField({ name, label, type = "text", placeholder, validation, options }) {
        return (
            <div key={name}>

                {type !== "checkbox" &&
                    <label htmlFor={name} className="text-sm font-medium mb-1 block">
                        {label}
                    </label>
                }

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
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : type === "radio" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {options.map(opt => (
                            <label key={opt} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value={opt}
                                    {...register(name, validation)}
                                />
                                <span className="text-muted dark:text-extra-muted">{opt}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <span>
                        <input
                            id={name}
                            type={type}
                            {...register(name, validation)}
                            placeholder={placeholder}
                            className=" p-3 mr-4 rounded-xl border border-gray-300 bg-white/70 text-black placeholder-gray-500 focus:outline-none focus:ring-2  focus:ring-primary"
                        />
                        {type === "checkbox" && (
                            <span>{  label}</span>)
                        }
                    </span>
                )}

                {errors[name] && (
                    <span className="text-red-500 text-xs mt-1 block">
                        {errors[name].message}
                    </span>
                )}
            </div>
        );
    }
};

export default ContactForm;
