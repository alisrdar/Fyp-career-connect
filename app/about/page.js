// app/about/page.jsx
"use client"
import React from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Mission from "@/components/Mission"
import HowItWorks from "@/components/HowItWorks"
import WhyItWorks from "@/components/WhyItWorks"
import Card from "@/components/ui/Card"
import Banner from "@/components/banner"
import Footer from "@/components/footer"
import BackToTopButton from "@/components/ui/BacktoTheTop"

export default function About() {
  const router = useRouter()

  const whyPoints = [
    'Combines psychology and AI to generate career insights.',
    'Adaptive learning models personalize every assessment.',
    'Actionable feedback that grows with your growth.',
  ]

  const teamMembers = [
    {
      name: 'Muhammad Ali',
      role: 'AI Lead',
      avatarUrl: '/images/team/john.jpg',
      linkText: 'View Profile',
      linkHref: '/team/john',
    },
    {
      name: 'Ahmed Mustafa',
      role: 'Frontend Wizard',
      avatarUrl: '/images/team/jane.jpg',
      linkText: 'View Profile',
      linkHref: '/team/jane',
    },
    {
      name: 'Jawad Ul Hassan',
      role: 'Frontend Wizard',
      avatarUrl: '/images/team/jane.jpg',
      linkText: 'View Profile',
      linkHref: '/team/jane',
    },
    
  ]

  return (
    <>
      <Navbar  />

      {/* Hero (untouched) */}
      <section>
        <Hero
          title="Unlock Your Potential"
          description="Welcome to our career counseling platform. We are here to guide you towards success."
          buttonText="Learn More"
        />
      </section>

      {/* Mission */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Mission
            heading="Our Mission"
            text="We empower individuals by helping them understand their strengths, preferences, and potential career paths through cutting-edge AI and psychological assessments."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HowItWorks />
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold mb-8 text-foreground-light dark:text-foreground-dark">
            Why Career Connect Works
          </h2>
          <ul className="max-w-3xl mx-auto space-y-4 text-left text-gray-700 dark:text-gray-300">
            {whyPoints.map((point, i) => (
              <li key={i} className="flex items-start">
                <span className="mt-1 text-blue-600 dark:text-cyan-400 mr-3">✔</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {/* Back to the top */}
      <BackToTopButton/>

      {/* Team */}
      <section className="py-16 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-center mb-8 text-foreground-light dark:text-foreground-dark">
            Meet the Team
          </h2>
          <div className="grid px-8 gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {teamMembers.map((m) => (
              <Card
                key={m.name}
                imageSrc={m.avatarUrl}
                tag={m.role}
                title={m.name}
                className="overflow-hidden"
                linkText="View Profile"
                href={"#"}
              >
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mid‐page Banner */}
      <Banner
        title="Start Your Journey Today"
        description="Take our personality survey and adaptive quiz to discover the right career path for you."
      />

      {/* Footer */}
      <Footer className="bg-white dark:bg-gray-900" />
    </>
  )
}
