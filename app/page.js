import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Card from "@/components/ui/Card";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-background-light dark:bg-background-dark ">
        <Navbar/>
        <Hero
          title={"Guidence for Success"}
          description={"Unlock your potential and achieve your career goals with our Comprehensive counseling Services."}
          buttonText={"Get Started"}
          backgroundImage={"/heroCoverImage.jpg"}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {/* Cards */}
        <Card
          className=" bg-red-500"
          imageSrc="/blog.jpg"
          tag="Career Tips"
          readingTime="4 min read"
          title="Build a Stunning Portfolio"
          description="Learn how to create a standout portfolio that gets noticed."
          linkText="Explore Guide"
          href="/guide"
        />
        <Card
          title="Just a simple card "
          description="This is a very basic card without image, tag or button."
          className="  bg-accent"
        />
        
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}
