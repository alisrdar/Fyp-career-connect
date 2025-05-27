// lib/fetchers/eric.js
const BASE = "https://api.ies.ed.gov/eric/?";

export async function fetchERIC({ search, rows = 3, start = 0 }) {
  const params = new URLSearchParams({
    search,
    rows: String(rows),
    start: String(start),
    format: "json",
    apiKey: process.env.ERIC_API_KEY,
  });

  const url = `${BASE}${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`ERIC fetch failed: ${res.statusText}`);
  }
  const json = await res.json();
  return json.docs || [];  // adjust to the actual shape—in the Notebook it's json.docs
}
