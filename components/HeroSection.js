"use client";
import React from "react";
import Button from "./ui/Button";
import Image from "next/image";
import { ArrowBigRight } from "lucide-react";

const HeroSection = ({
  title,
  description,
  imageSrc,
  imageAlt = "Hero Image",
  primaryBtnText,
  primaryBtnClick,
  secondaryBtnText,
  secondaryBtnClick,
  reverse = false,
  className = "",
  listItems = [],
}) => {
  const layoutClass = reverse
    ? "flex-col md:flex-row"
    : "flex-col-reverse md:flex-row-reverse";

  return (
    <section className={`w-full max-w-screen-3xl mx-auto px-4 gap-12 sm:px-6 md:px-8 py-12 ${className}`}>
      <div className={`flex ${layoutClass} items-center justify-between gap-8 md:gap-12`}>
        {/* Image Section */}
        {imageSrc && (
          <div className="w-full md:w-1/2">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg shadow-md"
              priority
            />
          </div>
        )}

        {/* Text Section */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug mb-4">
            {title}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-base sm:text-lg">
            {description}
          </p>

          <div className="flex gap-4 flex-wrap mb-6">
            {primaryBtnText && (
              <Button
                btnText={primaryBtnText}
                onClick={primaryBtnClick}
                variant="primary"
              />
            )}
            {secondaryBtnText && (
              <Button
                btnText={secondaryBtnText}
                onClick={secondaryBtnClick}
                variant="ghost"
              />
            )}
          </div>

          {listItems.length > 0 && (
            <ul className="space-y-2 text-gray-800 dark:text-gray-300 text-sm sm:text-base">
              {listItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1">
                    <ArrowBigRight size={16} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
