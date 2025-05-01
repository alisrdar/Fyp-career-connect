"use client"
import React from 'react'
import Button from './ui/Button';
import Image from 'next/image';

const HeroSection = ({
    title ,
    description,
    imageSrc ,
    imageAlt = "Hero Image",
    primaryBtnText ,
    primaryBtnClick,
    secondaryBtnText ,
    secondaryBtnClick ,
    reverse = false,
    className = "",
    listItems = [],
}) => {
    const layoutClass = reverse ? "flex-col-reverse md:flex-row-reverse" : "flex-col md:flex-row";

  return (
    <section className={`flex ${layoutClass} items-center justify-between gap-6 px-6 md:px-12 py-10  md:py-16 bg-background-light dark:bg-background-dark ${className}`}>

        {/* Text Content */}
      <div className="md:w-1/2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl pr-4 font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-gray-700 font-medium mt-2 dark:text-gray-300 mb-6">{description}</p>
        <div className="flex gap-4 flex-wrap">
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
            <ul className="mt-4 list-disc list-inside text-foreground-light/90 dark:text-gray-400  text-sm ">
                {listItems.map((item, index) => (
                <li  key={index} className="mb-2">
                    {item}
                </li>
                ))}
            </ul>
        )}
      </div>

      {/* Image */}
      {imageSrc && ( 
        <div className="md:w-1/2 w-full mt-6 md:mt-0 overflow-visible">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={300}
            height={500}
            className=" w-full rounded-lg shadow-md shadow-gray-300 dark:shadow-gray-700 "
           
          />
        </div>
      )}
    </section>
  )
}

export default HeroSection
