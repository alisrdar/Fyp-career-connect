// components/CategoryPreviewCard.jsx
'use client'

import Card from "../ui/Card"
import { articleData } from "@/lib/data/educationArticles"

export default function CategoryPreviewCard({ title, articles, viewMoreHref }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {articleData.map((art) => (
          <Card
            key={art.url}
            imageSrc={art.urlToImage}
            tag={art.source.name}
            readingTime={new Date(art.publishedAt).toLocaleDateString()}
            title={art.title}
            description={art.description}
            href={art.url}
            linkText="View more"
          />
        ))}
      </div>
      {/* <a href={viewMoreHref} className="mt-2 inline-block text-blue-500 hover:underline">
        View more
      </a> */}
    </section>
  )
}