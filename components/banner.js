import { useRouter } from "next/navigation";
import React from "react";
import Button from "./ui/Button";

const Banner = ({ title, description }) => {
  const router = useRouter();

  return (
    <section className="bg-secondary/40 dark:bg-surface  shadow-sm px-8 py-12  mx-auto my-12">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left side: Text */}
        <div className="text-center lg:text-left flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground-light dark:text-foreground-dark">
            {title}
          </h2>
          <p className="mt-4  text-base text-foreground-light dark:text-foreground-dark/70 md:text-lg text-muted-foreground max-w-2xl">
            {description}
          </p>
        </div>

        {/* Right side: Buttons */}
        <div className="flex gap-6 flex-col sm:flex-row justify-center lg:justify-end flex-wrap">
          <Button
            variant="primary"
            btnText="Login"
            size="lg"
            onClick={() => router.push("/login")}
          />
          <Button
            variant="secondary"
            className=""
            btnText="Sign up"
            size="lg"
            onClick={() => router.push("/signup")}
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
