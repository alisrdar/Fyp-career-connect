
import React from "react";

const Hero = () => {
  return (
    <section className="flex flex-col rounded shadow-[0px_0px_2px_rgba(23,26,31,0.12)] relative min-h-[280px] w-full max-w-full items-center justify-center px-16 py-[40px] max-md:mr-1 max-md:px-4">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/0c4f8583115444409ad1d67de9c1f2e4/6fe43d225a745d6ff7a6b02aba957aeac5a13b5b?placeholderIfAbsent=true"
        alt="Hero Background"
        className="absolute h-full w-full object-cover inset-0"
      />
      <div className="relative flex w-[600px] max-w-full flex-col">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/0c4f8583115444409ad1d67de9c1f2e4/669106ecc9b0ca9f4d6afc25bfe66ff11029ad17?placeholderIfAbsent=true"
          alt="Decoration"
          className="aspect-[2] object-contain w-1"
        />
        <div className="flex w-[500px] max-w-full flex-col items-stretch mt-[40px] max-md:mt-8">
          <h1 className="rotate-[2.4492937051703357e-16rad] text-[rgba(57,57,57,1)] text-[42px] font-bold leading-[1.4] text-center max-md:max-w-full max-md:text-[36px]">
            Guidance for Success
          </h1>
          <p className="rotate-[2.4492937051703357e-16rad] text-[rgba(18,16,16,1)] text-[15px] font-normal leading-loose text-center mt-[12px] max-md:max-w-full max-md:mr-1">
            Unlock your potential with our comprehensive career counseling services.
          </p>
          <button className="bg-blend-normal rounded bg-[rgba(20,108,148,1)] border self-center w-[150px] max-w-full text-sm text-[rgba(255,254,254,1)] font-medium leading-7 mt-2 px-8 py-2 border-[rgba(144,149,161,1)] border-solid max-md:px-4">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;