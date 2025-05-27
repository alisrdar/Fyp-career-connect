// Fetch and convert RSS feed entries to clean JSON objects
export async function fetchRSS2JSON(feedUrl, limit = 3) {
  const apiKey = process.env.RSS2JSON_KEY // optional
  const base = 'https://api.rss2json.com/v1/api.json'
  const params = new URLSearchParams({ rss_url: feedUrl })
  if (apiKey) params.set('api_key', apiKey)

  const res = await fetch(`${base}?${params}`)
  if (!res.ok) {
    console.error('RSS2JSON failed:', await res.text())
    return []
  }
  const { items = [] } = await res.json()

  // utility to strip HTML tags for plain-text descriptions
  const stripHTML = (str) => str.replace(/<[^>]*>/g, '').trim()

  return items.slice(0, limit).map((i) => {
    const raw = i.description || i.contentSnippet || ''
    return {
      title:       i.title,
      description: stripHTML(raw),
      url:         i.link,
      urlToImage:  i.enclosure?.link || null,
      publishedAt: i.pubDate,
    }
  })
}
