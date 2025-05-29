// components/resources/ResourceSection.jsx
import Card from "../ui/Card";
import React from 'react'
import { useSearchParams } from "next/navigation";

const ResourceSection = ({data}) => {
  return (
    <div className="grid gap-8">
      {data.map((category) => (
        <section key={category.category} className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground-light dark:text-foreground-dark">{category.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.articles.map((article, index) => (
              <Card
                key={index}
                title={article.title}
                description={article.description}
                href={article.url}
                imageSrc={article.image_url}
                tag={category.category}
                readingTime={article.published_date}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default ResourceSection

