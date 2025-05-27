// lib/fetchers/nyt.js

/**
 * Fetch top stories for a given NYT section.
 * @param {string} section — one of 'science','education','technology', etc.
 * @returns {Promise<Array>} — array of article objects
 */
export async function fetchNYTTopStories(section = 'home') {
  const apiKey = process.env.NYT_API_KEY
  if (!apiKey) throw new Error('Missing NYT_API_KEY in .env.local')

  const url = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(`NYT TopStories ${section} error ${res.status}: ${err?.message || res.statusText}`)
  }

  const json = await res.json()
  return (json.results || []).map((d) => ({
    title: d.title,
    description: d.abstract,
    url: d.url,
    urlToImage: d.multimedia?.[0]?.url || null,
    publishedAt: d.published_date,
  }))
}
