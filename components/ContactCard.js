import React from 'react';

const ContactCard = ({ Icon, title, message, contact, flexDirection= "col" }) => {
  return (
    <div className={`w-full sm:max-w-sm md:max-w-sm lg:max-w-md mx-auto flex flex-${flexDirection} gap-3 p-5 rounded-xl bg-background-light  dark:bg-background-dark text-foreground-light dark:text-foreground-dark dark:hover:shadow-md dark:shadow-surface hover:shadow-md transition-shadow duration-300 dark:border border-border`}>
      
      {/* Icon Circle */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-primary dark:bg-darkblue dark:text-accent hover:scale-105 transition-transform cursor-pointer">
        <Icon className="w-5 h-5" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-primary dark:text-secondary tracking-tight">
        {title}
      </h3>

      {/* Message */}
      <p className="text-sm text-muted dark:text-extra-muted">
        {message}
      </p>

      {/* Contact Info */}
      <span className="text-base font-m text-darkblue dark:text-gray-400 break-words">
        {contact}
      </span>
    </div>
  );
};

export default ContactCard;
