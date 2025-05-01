"use client";

import React from "react";
import Image from "next/image";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";

const Hero = ({ title, description, buttonText, backgroundImage, heroStyle }) => {
  const router = useRouter();

  const handleSignClick = () => {
    router.push("/sign-up");
  };

  const baseStyles =
    "relative flex flex-col dark:bg-background-dark  bg-background-light items-center justify-center px-6 py-10 sm:py-12 w-full rounded shadow-md overflow-hidden";

  return (
    <section
      className={`${baseStyles} ${heroStyle || ""}`}
     
    >
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold leading-snug text-white">
          {title}
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-200">
          {description}
        </p>
        <Button
          btnText={buttonText}
          variant="primary"
          onClick={handleSignClick}
          className="mt-6"
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