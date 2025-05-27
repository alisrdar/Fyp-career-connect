"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { articleData } from "@/lib/data/educationArticles";
import BreadcrumbNav from "@/components/resources/BreadcrumbNav";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    const matched = [];
    articleData.forEach((category) => {
      category.articles.forEach((article) => {
        const text = `${article.title} ${article.description}`.toLowerCase();
        if (text.includes(query)) {
          matched.push({ ...article, category: category.category });
        }
      });
    });

    setResults(matched);
  }, [query]);

  return (
    <>
      <BreadcrumbNav paths={[{ label: "Resources", href: "/dashboard/resources" }]} />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-foreground-light dark:text-foreground-dark">Search Results for: "{query}"</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.length > 0 ? (
            results.map((a, i) => (
              <Card
                key={i}
                title={a.title}
                description={a.description}
                href={a.url}
                imageSrc={a.image_url}
                tag={a.category}
                readingTime={a.published_date}
              />
            ))
          ) : (
            <p className="text-less-dark dark:text-extra-muted ">No matching articles found.</p>
          )}
        </div>
      </div>
    </>
  );
}