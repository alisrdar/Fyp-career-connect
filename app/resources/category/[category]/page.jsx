// app/resources/category/[category]/page.jsx
"use client";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import Card from "@/components/ui/Card";
import { articleData } from "@/lib/data/educationArticles";
import BreadcrumbNav from "@/components/resources/BreadcrumbNav";

export default function CategoryPage() {
  const { category } = useParams();
  const categoryObj = articleData.find(
    (c) => c.category.toLowerCase().replace(/\s+/g, "-") === category
  );

  return (
    <>
      <Navbar />
      <div className="p-6">
        <BreadcrumbNav
          paths={[
            { label: "Resources", href: "/resources" },
            { label: categoryObj?.category || "Not Found", href: "" },
          ]}
        />

        <h2 className="text-2xl font-bold mb-6 text-foreground-light dark:text-foreground-dark">
          {categoryObj?.category || "Category Not Found"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryObj?.articles?.length > 0 ? (
            categoryObj.articles.map((article, index) => (
              <Card
                key={index}
                title={article.title}
                description={article.description}
                href={article.url}
                imageSrc={article.image_url}
                tag={categoryObj.category}
                readingTime={article.published_date}
              />
            ))
          ) : (
            <p className="text-muted">No articles found for this category.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
