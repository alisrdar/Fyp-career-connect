"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Card from "@/components/ui/Card";
import Footer from "@/components/footer";
import HeroSection from "@/components/HeroSection";
import { useRouter } from "next/navigation";


export default function Home() {
  const heroList = [
    {}
  ]
  const router = useRouter();
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-light dark:bg-background-dark ">
        <Hero
          title={"Guidence for Success"}
          description={"Unlock your potential and achieve your career goals with our Comprehensive counseling Services."}
          buttonText={"Get Started"}
          backgroundImage={"/images/HeroImage2.png"}
        />
        <HeroSection
          
          title="Unlock Your Full Potential with Career Counseling"
          description="At Career Connect platform, we are dedicated to helping individuals discover their true potential and achieve their professional goal. Our mission to provide comprehensive guidance and resources to support your career development journey."
          primaryBtnText="Learn More"
          primaryBtnClick={
            () => router.push("/learn-more")
          }
          secondaryBtnText="Sign Up"
          secondaryBtnClick={
            () => router.push("/signup")
          }
          imageSrc="/images/HSImage.jpg"
          reverse={false}
        />

        <HeroSection
          title={"Discover Your True Potential with Our Career Assessment and Career guidance Services"}
          description={"At Career Connect, we offer AI powered comprehensive services to help you navigate your career path with confidence."}
          className=""
          reverse={true}
          imageSrc={"/images/2ndHero.webp"}
          listItems={["AI-Powered Career Assessment", "Personalized Career Guidance","Resource library to help you reach your goal" ]}
        />
        <section className="cards px-2 my-12 ">
        <h2 className="text-4xl px-8 md:px-12 font-bold text-center mt-12 mb-6 text-foreground-light dark:text-foreground-dark">
          Discover Career Insights Today
        </h2>
        <p className="text-center text-sm px-8 md:px-12 mb-4 text-foreground-light/70 dark:text-muted">
          Stay updated with our latest career advice and industy insights.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-12 py-10">
          <Card
            className=""
            imageSrc="/images/CardGridAi.webp"
            title="AI-Powered Career Assessment"
            description="Discover your strengths and interests with our AI-powered career assessment tool. Get personalized insights to guide your career choices."
            tag={"AI Assessment"}
            linkText="Learn More"
            href="/services/ai-assessment"
          />
          <Card
            imageSrc="/images/PersonalizedGuidance.svg"
            title="Personalized Career Guidance"
            description="Receive tailored career guidance from our expert counselors. We help you navigate your career path with confidence."
            tag={"Career Guidance"}
            linkText="Learn More"
            href="/services/career-guidance"
          />
          <Card
            imageSrc="/images/resourceLib2.svg"
            title="Skill Development"
            description="Enhance your skills with our curated resources and training programs. Stay ahead in your career with continuous learning."
            tag={"Skills"}
            linkText="Learn More"
            href="/resources"
          />
        </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
