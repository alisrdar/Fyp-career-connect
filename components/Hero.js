"use client";

import React from "react";
import Image from "next/image";
import Button from "./ui/Button";

const Hero = ({ title, description, buttonText, backgroundImage }) => {
  const handleSignClick = () => {
    router.push('sign-up');
  }
  return (
    <section
      className="relative flex flex-col items-center justify-center px-6 py-20 w-full min-h-[300px] rounded shadow-md overflow-hidden"
      style={{
        backgroundColor: "var(--color-background-light)",
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold leading-snug text-white dark:text-foreground-light">
          {title}
        </h1>
        <p className="mt-4 text-sm md:text-sm text-gray-200 dark:text-surface">
          {description}
        </p>
        <Button
          btnText={buttonText}
          variant="primary"
          onClick={handleSignClick}
          className="opacity-90 mt-4"
        />
      </div>
    </section>
  );
};

export default Hero;
// Ok read this sitemap and storyboard and help me to decide what pages should I make besides the landing page, 



// how should I make the dashboard?
// should the navbar of dashboard be different from the main navbar

// I have already made components like navbar, Hero, card-grid, footer, callToAction
// exactly which more components do I need