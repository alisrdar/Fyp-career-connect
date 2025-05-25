import React from "react";

const ContactText = ({title= "Contact Information", description = " Reach out to us for any inquires orassistance"}) => {
  return (
    <div className="px-4  sm:px-6 lg:px-6">
      <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug mb-4">
        {title}
      </h1>
      <p className="text-gray-700 dark:text-extra-muted mb-6 text-base sm:text-lg">
        {description}
      </p>
    </div>
  );
};

export default ContactText;
