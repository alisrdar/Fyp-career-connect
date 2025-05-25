// components/DashboardWelcome.jsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ProfileHero from "./profile/CoverBanner";
import StepCard from "./StepCard";
import ProgressItem from "./ProgressItem";
import ResourceItem from "./ResourseItem";
import { useUser } from "@/context/UserContext";  // custom hook
import {
  FileChartColumn,
  FileVideo,
  Compass,
  UserCircle,
} from "lucide-react";

export default function DashboardWelcome() {
  const { user, loading, err } = useUser();
  const router = useRouter();

  if (loading) return <p>Loading profile…</p>;
  if (err) return <p className="text-red-500">{err}</p>;

  // Next steps data
  const steps = [
    {
      id: "survey",
      imageLink:
        "https://www.limesurvey.org/images/2024/blog/SResearch_blog_article_img.png",
      step: "1",
      title: "Career Interest Survey",
      description:
        "Complete this survey to help us understand your interests and preferences.",
      primaryLabel: "Start Survey",
      onPrimaryClick: () => router.push("/survey"),
    },
    {
      id: "quiz",
      imageLink:
        "https://mayfairstjames.london/wp-content/uploads/2024/08/MSJA-Quiz.jpg",
      step: "2",
      title: "Skills Assessment Quiz",
      description:
        "Take this quiz to identify your strengths and areas for development.",
      primaryLabel: "Take Quiz",
      onPrimaryClick: () => router.push("/quiz"),
    },
  ];

  // Progress items
  const progressItems = [
    {
      id: "profile",
      icon: UserCircle,
      title: "Profile Completed",
      detail: "You’ve added your bio and photo",
      status: "completed",
      action: () => console.log("Profile clicked"),
    },
    {
      id: "survey",
      icon: Compass,
      title: "Survey Pending",
      detail: "Tell us more about your interests",
      status: "inProgress",
      action: () => router.push("/survey"),
    },
  ];

  // Resources
  const resources = [
    {
      id: "interviews",
      icon: FileChartColumn,
      title: "How to Ace Interviews",
      meta: "5 min read • Career Tips",
      onClick: () => router.push("/resources/interviews"),
    },
    {
      id: "strengths",
      icon: FileVideo,
      title: "Understanding Your Career Strengths",
      meta: "10 min video • Learning",
      onClick: () => router.push("/resources/strengths"),
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-background-dark">
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Hero */}
        <ProfileHero
          user={user}
          title={`Welcome! ${user.name}`}
        />

        <main className="flex-1 mt-6 px-4 pb-6 sm:px-10 sm:py-2">
          {/* Next Steps */}
          <section className="mb-12 px-4">
            <h3 className="text-2xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">
              Next Steps
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {steps.map((s) => (
                <StepCard key={s.id} {...s} />
              ))}
            </div>
          </section>

          {/* Progress */}
          <section className="mb-12 px-4">
            <h3 className="text-2xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">
              Your Progress
            </h3>
            <div className="space-y-4">
              {progressItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="bg-white dark:bg-surface p-3 rounded-xl">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <ProgressItem {...item} />
                </div>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section className="px-4">
            <h3 className="text-2xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">
              Recommended Resources
            </h3>
            <div className="space-y-4">
              {resources.map((res) => (
                <div key={res.id} className="flex items-center gap-4">
                  <div className="bg-white dark:bg-surface p-3 rounded-xl">
                    <res.icon className="h-6 w-6 text-accent" />
                  </div>
                  <ResourceItem {...res} />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
