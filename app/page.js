import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-background-light ">
        <Navbar/>
        <Hero
          title={"Guidence for Success"}
          description={"Unlock your potential and achieve your career goals with our Comprehensive counseling Services."}
          buttonText={"Get Started"}
          backgroundImage={"/heroCoverImage.jpg"}
        />
        <Card
          className="w-1/3 m-4 bg-white"
          imageSrc="/blog.jpg"
          tag="Career Tips"
          readingTime="4 min read"
          title="Build a Stunning Portfolio"
          description="Learn how to create a standout portfolio that gets noticed."
          linkText="Explore Guide"
          href="/guide"
        />

      </div>
    </>
  );
}
