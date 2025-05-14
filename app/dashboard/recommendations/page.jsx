'use client'
import React, { useState } from "react"
import Card from "@/components/ui/Card"
import SideBar from "@/components/dashboad/SideBar"

const CareerRecommendations = () => {
  const [collapsed, setCollapsed] = useState(false)

  const topMatches = [
    {
      imageSrc: "https://www.shutterstock.com/image-photo/panorama-shot-frontend-developer-team-260nw-2294268357.jpg",
      tag: "98% Match",
      title: "UX Designer",
      description:
        "Your creative problem-solving and empathy make you ideal for designing user experiences that solve real problems.",
      href: "/careers/ux-designer",
      linkText: "Learn More",
    },
    {
      imageSrc: "/images/data-science.jpg.webp",
      tag: "95% Match",
      title: "Data Scientist",
      description:
        "Your analytical thinking and pattern recognition skills are perfect for extracting insights from complex data.",
      href: "/careers/data-scientist",
      linkText: "Learn More",
    },
    {
      imageSrc: "https://media.istockphoto.com/id/1488294044/photo/businessman-works-on-laptop-showing-business-analytics-dashboard-with-charts-metrics-and-kpi.jpg?s=612x612&w=0&k=20&c=AcxzQAe1LY4lGp0C6EQ6reI7ZkFC2ftS09yw_3BVkpk=",
      tag: "92% Match",
      title: "Product Manager",
      description:
        "Your strategic thinking and ability to balance user needs with business goals align with product management.",
      href: "/careers/product-manager",
      linkText: "Learn More",
    },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={() => console.log('Logout clicked')} />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="max-w-6xl mx-auto p-6 space-y-10">
          <header>
            <h1 className="text-3xl font-bold mb-2 text-foreground-light dark:text-foreground-dark">Your Career Recommendations</h1>
            <p className="text-lg text-muted-foreground dark:text-less-dark">
              Based on your quiz responses, we’ve identified these career paths that align with your
              skills, interests, and problem-solving approach.
            </p>
          </header>

          {/* Top Matches */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">Top Matches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topMatches.map((match, index) => (
                <Card key={index} {...match} />
              ))}
            </div>
          </section>

          {/* Why These Recommendations */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">Why These Recommendations?</h2>
            <ul className="space-y-4 text-surface dark:text-gray-400">
              <li>🧠 <strong>Problem-Solving Approach:</strong> You excel at creative solutions and considering multiple perspectives.</li>
              <li>🗣️ <strong>Communication Style:</strong> You communicate clearly and can explain complex concepts effectively.</li>
              <li>🤝 <strong>Work Environment Preference:</strong> You thrive in collaborative settings with opportunities for innovation.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}

export default CareerRecommendations
