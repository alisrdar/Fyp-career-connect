import { categories } from '@/lib/newsCategories'

export async function GET() {
  const apiKey = process.env.RSS2JSON_API_KEY
  const previews = await Promise.all(
    categories.map(async (c) => {
      const feedUrl = encodeURIComponent(c.rssFeedUrl)
      const url = /* RSS2JSON endpoint */
        `https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}` +
        (apiKey ? `&api_key=${apiKey}` : '')

      const res = await fetch(url)
      if (!res.ok) {
        console.error('RSS2JSON error', res.status)
        return { id: c.id, title: c.title, articles: [] }
      }

      const json = await res.json()
      const items = json.items || []  // feed se milne wali array

      // filter + slice kar: sirf first 3, aur optional date sort
      const articles = items
        .slice(0, 3)
        .map((it) => ({
          title: it.title,
          description: it.description.replace(/<[^>]+>/g, ''), // HTML remove
          url: it.link,
          urlToImage: it.thumbnail || null,
          publishedAt: it.pubDate,
        }))

      return { id: c.id, title: c.title, articles }
    })
  )

  return new Response(JSON.stringify(previews), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
