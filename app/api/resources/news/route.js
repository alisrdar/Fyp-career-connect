// app/api/resources/news/route.js

export async function GET(request) {
  const categories = [
    {
      id: "webdev",
      title: "Web Development",
      keywords: [
        "JavaScript",
        "React",
        "Node.js",
        "Frontend",
        "Backend",
        "CSS",
      ],
    },
    {
      id: "datasci",
      title: "Data Science",
      keywords: ["Machine Learning", "Python", "Pandas", "AI", "Data Analysis"],
    },
    {
      id: "softskills",
      title: "Soft Skills",
      keywords: [
        "communication",
        "leadership",
        "teamwork",
        "emotional intelligence",
      ],
    },
    {
      id: "physics",
      title: "Physics",
      keywords: ["quantum mechanics", "classical mechanics", "thermodynamics"],
    },
    {
      id: "nuclearphysics",
      title: "Nuclear Physics",
      keywords: [
        "nuclear fission",
        "nuclear reactors",
        "particle physics",
        "CERN",
      ],
    },
    {
      id: "astrophysics",
      title: "Astrophysics",
      keywords: ["black holes", "cosmology", "dark matter", "space telescopes"],
    },
    {
      id: "biology",
      title: "Biology",
      keywords: ["genetics", "evolution", "cell biology", "microbiology"],
    },
    {
      id: "chemistry",
      title: "Chemistry",
      keywords: [
        "organic chemistry",
        "chemical reactions",
        "molecules",
        "biochemistry",
      ],
    },
    {
      id: "arts",
      title: "Arts & Design",
      keywords: [
        "graphic design",
        "painting",
        "illustration",
        "visual arts",
        "creativity",
      ],
    },
    {
      id: "music",
      title: "Music",
      keywords: [
        "composition",
        "musicians",
        "classical music",
        "music theory",
        "sound design",
      ],
    },
    {
      id: "medicine",
      title: "Medicine",
      keywords: [
        "surgery",
        "public health",
        "pharmacology",
        "clinical research",
      ],
    },
    {
      id: "engineering",
      title: "Engineering",
      keywords: [
        "mechanical engineering",
        "civil engineering",
        "robotics",
        "CAD",
      ],
    },
    {
      id: "law",
      title: "Law",
      keywords: [
        "legal system",
        "criminal law",
        "international law",
        "court cases",
      ],
    },
    {
      id: "business",
      title: "Business & Management",
      keywords: [
        "startups",
        "entrepreneurship",
        "marketing",
        "strategy",
        "finance",
      ],
    },
    {
      id: "finance",
      title: "Finance",
      keywords: [
        "investment",
        "stock market",
        "personal finance",
        "cryptocurrency",
      ],
    },
    {
      id: "psychology",
      title: "Psychology",
      keywords: [
        "cognitive science",
        "mental health",
        "behavioral science",
        "therapy",
      ],
    },
    {
      id: "education",
      title: "Education",
      keywords: [
        "teaching",
        "learning science",
        "curriculum",
        "online learning",
      ],
    },
    {
      id: "environment",
      title: "Environmental Science",
      keywords: [
        "climate change",
        "sustainability",
        "pollution",
        "renewable energy",
      ],
    },
  ];

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q") || "";

  const categoryObj = categories.find((c) => c.id === category);
  const keywords = categoryObj ? categoryObj.keywords.join(" OR ") : "";

  const queryString = [q, keywords].filter(Boolean).join(" OR ");

  const apiKey = process.env.NEWS_API_KEY;

  const url =
    `https://newsapi.org/v2/everything?` +
    `q=${encodeURIComponent(queryString)}&` +
    `pageSize=12&` +
    `sortBy=publishedAt&` +
    `apiKey=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    return new Response(JSON.stringify({ error: "Fetch failed" }), {
      status: response.status,
    });
  }

  const data = await response.json();

  return new Response(JSON.stringify(data.articles), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
