// ContactModalForm.jsx
import React, { useState } from "react";
import { Mail } from "lucide-react";
import ContactCard from "../ContactCard";
import ContactForm from "../forms/ContactForm";

export default function ContactModalForm({ contactFields, handleContactSubmit }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Trigger with your ContactCard */}
            <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                <ContactCard
                    Icon={Mail}
                    title="Got Feedback?"
                    message="Click here to submit your thoughts!"
                    contact=""           // unused in this context
                    flexDirection="row"  // icon + text side by side
                    className="max-w-md mx-auto"
                />
            </div>

            {/* Your existing modal logic */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="relative w-full max-w-3xl p-8 bg-white/80 backdrop-blur-md
                         rounded-lg shadow-xl border border-white/20
                         dark:bg-surface dark:text-foreground-dark overflow-auto max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                aria-label="Close form"
                            >
                                <Mail size={24} className="rotate-45" /> {/* makes an “X” */}
                            </button>

                            <ContactForm
                                gridFields={contactFields.slice(0, 4)}
                                fields={contactFields.slice(4)}
                                btnText="Submit"
                                onSubmit={(data) => {
                                    handleContactSubmit(data);
                                    setIsOpen(false);
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
