import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/footer'
import Hero from '@/components/Hero'
import Mission from '@/components/Mission'
import HowItWorks from '@/components/HowItWorks'
import WhyItWorks from '@/components/WhyItWorks'
import Team from '@/components/Team'
import CallToAction from '@/components/CTA2'

const About = () => {
  const teamMembers = [
    {
      name: 'Muhammad Ali',
      role: 'Frontend Dev & AI Lead',
      avatarUrl: '/images/Ali.jpg',
      linkText: 'View Profile',
      linkHref: 'https://www.linkedin.com/in/alisrdar5870/',
    },
    {
      name: 'Ahmed Mustafa',
      role: 'Frontend Dev + UI/UX',
      avatarUrl: '/images/Ahmed.jpg',
      linkText: 'View Profile',
      linkHref: '#',
    },
    {
      name: 'Jawad Ul Hassan',
      role: 'Backend Developer',
      avatarUrl: '/images/jawad.jpg',
      linkText: 'View Profile',
      linkHref: '#',
    }
  ];

  const whyPoints = [
    'Combines psychology and AI to generate career insights.',
    'Uses adaptive learning models for tailored assessments.',
    'Personalized feedback that grows with your learning curve.',
  ];

  return (
    <>
      <Navbar />
      <div className='min-h-screen'>
        <section>
          <Hero
            title={"Unlock Your Potential "}
            description={"Welcome to our career counseling platform. We are here to guide you towards succss."}
            buttonText={"Learn More"}
          />
        </section>
      </div>
      <Mission
        heading="Our Mission"
        text="We empower individuals by helping them understand their strengths, preferences, and potential career paths through cutting-edge AI and psychological assessments."
      />

      <HowItWorks />

      <WhyItWorks points={whyPoints} />

      <Team members={teamMembers} />

      <CallToAction
        title="Start Your Journey Today"
        description="Take our personality survey and adaptive quiz to discover the right career path for you."
        imgSrc="/images/cta/career-path.jpg"
      />
      <Footer />
    </>
  )
}

export default About
