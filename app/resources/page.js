// app/resources/page.jsx
"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import CategoryPreviewCard from "@/components/resources/CategoryPreviewCard";
import SearchBar from "@/components/resources/SearchBar";
import BreadcrumbNav from "@/components/resources/BreadcrumbNav";
import { articleData } from "@/lib/data/educationArticles";
import ResourceSection from "@/components/resources/ResourceSection";
import { useRouter } from "next/navigation";
import BackToTopButton from "@/components/ui/BacktoTheTop";


export default function ResourcesPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  function handleSearch(e) {
    e.preventDefault();
    if (q.trim() !== "") {
      router.push(`/resources/search?q=${encodeURIComponent(q)}`);
    }
  }
  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Title */}
            <h1 className="text-3xl sm:text-3xl font-extrabold text-foreground-light dark:text-foreground-dark">
              Browse Our Resource Library
            </h1>

            {/* SearchBar wrapper */}
            <div className="w-full sm:w-1/2 lg:w-1/3">
              <SearchBar
                value={q}
                onChange={(e) => setQ(e.target.value)}
                handleSearch={handleSearch}
              />
            </div>
          </div>
        </div>

        
        <ResourceSection data={articleData} />
        <BackToTopButton />
      </div>
      <Footer />
    </>
  );
}
