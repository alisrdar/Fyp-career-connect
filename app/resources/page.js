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

export default function ResourcesPage() {
  const router = useRouter()
      const [q, setQ] = useState('')
      function handleSearch(e) {
          e.preventDefault()
          if (q.trim() !== '') {
              router.push(`/resources/search?q=${encodeURIComponent(q)}`)
          }
      }
  return (
    <>
      <Navbar />
      <div className="p-6">
        <SearchBar
          value={q}
          onChange={(e)=> setQ(e.target.value)}
          handleSearch={handleSearch}
        />
        <BreadcrumbNav paths={[{ label: "Resources", href: "/resources" }]} />
        <ResourceSection
          data={articleData}
        />
        
      </div>
      <Footer />
    </>
  );
}
