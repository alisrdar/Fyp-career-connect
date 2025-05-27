// lib/fetchers/devto.js
// Uses the public DEV.to (Forem) API—no auth needed for public articles :contentReference[oaicite:4]{index=4}
export async function fetchDevTo({ tag = 'career', per_page = 5 }) {
  const url = `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=${per_page}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('dev.to fetch failed')
  const data = await res.json()
  return data.map((a) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    urlToImage: a.social_image,
    publishedAt: a.published_at,
  }))
}
