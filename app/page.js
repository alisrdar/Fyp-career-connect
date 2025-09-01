"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Card from "@/components/ui/Card";
import Footer from "@/components/footer";
import HeroSection from "@/components/HeroSection";
import { useRouter } from "next/navigation";
import FAQSection from "@/components/FAQSection";
import Button from "@/components/ui/Button";
import Banner from "@/components/banner";
import BackToTopButton from "@/components/ui/BacktoTheTop";

export default function Home() {
  const homepageFaqs = [
    {
      title: "What is Career Connect?",
      description:
        "Career Connect is an AI-powered platform for career exploration. It helps you discover the best career paths based on your interests, skills, and personality.",
    },
    {
      title: "Is the quiz free?",
      description:
        "Yes! The career quiz is completely free for students. You can take it as many times as you like to refine your results.",
    },
    {
      title: "How does Career Connect determine the best career options?",
      description:
        "Our system uses advanced algorithms and psychometric analysis to match your profile with real-world career data and recommendations tailored to your strengths.",
    },
    {
      title: "Do I need to create an account?",
      description:
        "Creating an account is optional for exploring career options, but it’s required if you want to save your progress, get personalized insights, or access additional features.",
    },
    {
      title: "Can I use Career Connect on my phone?",
      description:
        "Absolutely! Career Connect is fully responsive and works smoothly on mobile, tablet, and desktop devices.",
    },
  ];

  const router = useRouter();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Hero
          title="Guidence for Success"
          description="Unlock your potential and achieve your career goals with our Comprehensive counseling Services."
          buttonText="Get Started"
          backgroundImage="/images/HeroImage2.png"
        />

        <div className=" mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <HeroSection
            title="Unlock Your Full Potential with Career Counseling"
            description="At Career Connect platform, we are dedicated to helping individuals discover their true potential and achieve their professional goal. Our mission to provide comprehensive guidance and resources to support your career development journey."
            primaryBtnText="Learn More"
            primaryBtnClick={() => router.push("/service")}
            secondaryBtnText="Sign Up"
            secondaryBtnClick={() => router.push("/signup")}
            imageSrc="/images/HSImage.jpg"
            reverse={false}
          />

          <HeroSection
            title="Discover Your True Potential with Our Career Assessment and Career guidance Services"
            description="At Career Connect, we offer AI powered comprehensive services to help you navigate your career path with confidence."
            reverse={true}
            imageSrc="/images/2ndHero.webp"
            listItems={[
              "AI-Powered Career Assessment",
              "Personalized Career Guidance",
              "Resource library to help you reach your goal",
            ]}
          />
        </div>

        <section className="my-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mt-12 mb-6 text-foreground-light dark:text-foreground-dark">
              Discover Career Insights Today
            </h2>
            <p className="text-center text-sm sm:text-base mb-4 text-foreground-light/70 dark:text-muted">
              Stay updated with our latest career advice and industry insights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-10">
              <Card
                imageSrc="/images/CardGridAi.webp"
                title="AI-Powered Career Assessment"
                description="Discover your strengths and interests with our AI-powered career assessment tool. Get personalized insights to guide your career choices."
                tag="AI Assessment"
                linkText="Learn More"
                href="/quiz"
              />
              <Card
                imageSrc="/images/PersonalizedGuidance.svg"
                title="Personalized Career Guidance"
                description="Receive tailored career guidance from our expert counselors. We help you navigate your career path with confidence."
                tag="Career Guidance"
                linkText="Learn More"
                href="/dashboard"
              />
              <Card
                imageSrc="/images/resourceLib2.svg"
                title="Skill Development"
                description="Enhance your skills with our curated resources and training programs. Stay ahead in your career with continuous learning."
                tag="Skills"
                linkText="Learn More"
                href="/resources"
              />
            </div>
          </div>
        </section>

        <section className="m-0">
          <Banner
            title="Unlock Your Career Potential Today"
            description="Take our comprehensive career assessments today"
          />
        </section>

        <section className="my-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-start gap-10">
            <div className="flex flex-col gap-4 w-full lg:w-1/3 py-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground-light dark:text-foreground-dark">
                FAQs
              </h2>
              <p className="text-foreground-light dark:text-extra-muted text-base font-light">
                Take your career assessment now and explore personalized
                opportunities.
              </p>
              <Button
                variant="primary"
                btnText="Contact"
                onClick={() => router.push("/contact")}
                className="w-full sm:w-2/3"
              />
            </div>
            <div className="w-full lg:w-2/3">
              <FAQSection faqs={homepageFaqs} />
            </div>
          </div>
        </section>
        <BackToTopButton/>
      </div>
      <Footer />
    </>
  );
}
