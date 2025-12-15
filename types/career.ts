export interface Career {
  id: string; // URL slug e.g., 'ux-designer'
  title: string;
  matchScore: number; // Percentage match
  tagline: string; // Short catchy description
  description: string;
  imageSrc: string;
  salary: {
    min: string;
    max: string;
    currency: string;
  };
  outlook: string; // Growth projection
  education: string; // Required education level
  workStyle: string; // Remote/Hybrid/Office
  whyItFits: {
    trait: string; // Personality trait (Openness, etc.)
    explanation: string;
  }[];
  roadmap: {
    phase: number;
    title: string;
    duration: string;
    skills: string[];
    resources: { name: string; url: string; type: 'course' | 'article' | 'video' | 'book' }[];
  }[];
  tools: {
    name: string;
    category: 'design' | 'development' | 'analytics' | 'collaboration' | 'other';
    icon?: string;
  }[];
  dayInLife: string[];
  externalLinks: {
    careerGuide: string;
    salaryData: string;
    jobBoard: string;
  };
}
