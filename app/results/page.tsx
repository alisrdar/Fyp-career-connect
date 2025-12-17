import ResultsView from './components/ResultsView';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { formatRIASECDescription } from '@/lib/riasecUtils';
import { DbCon } from '@/lib/dbCon';
import PErsonalityResult from '@/models/PErsonalityResult';

// --- 1. Type Definitions (Aligned with Python Backend) ---

interface CareerRecommendation {
  title: string;
  code: string;
  match_score: number;
  top_factors: string[];
  personality_fit: number;
  aptitude_score: number;
  // Optional fields (add these if your backend sends them)
  description?: string;
  salary_range?: string;
  job_outlook?: string;
  reasoning?: string;
}

interface RecommendationData {
  user_profile: Record<string, number>; // e.g. { "logic": 0.8, "math": 0.5 }
  recommendations: CareerRecommendation[];
}

// --- 2. Data Fetching Logic ---

async function getRecommendations(userId: string): Promise<RecommendationData | null> {
  try {
    // Use environment variable for Docker/Prod, fallback to localhost for local dev
    const API_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';
    
    console.log(`[Results Page] Fetching recommendations from AI Engine: ${API_URL}/recommend/results/${userId}`);
    
    // Call the new GET endpoint
    const response = await fetch(`${API_URL}/recommend/results/${userId}`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[Results Page] Fetch failed: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`[Results Page] Error response:`, errorText);
      return null;
    }

    const data = await response.json();
    console.log(`[Results Page] Successfully fetched recommendations from AI Engine:`, data);
    return data;
  } catch (error) {
    console.error('[Results Page] Error fetching recommendations:', error);
    return null;
  }
}

// --- Helper function to fetch personality data ---
async function getPersonalityData(userId: string) {
  try {
    await DbCon();
    const result: any = await PErsonalityResult.findOne({ userId }).lean();
    
    if (!result) {
      console.log('[Results Page] No personality data found for user');
      return { hasPersonality: false };
    }

    console.log('[Results Page] Found personality data:', result);
    return {
      hasPersonality: true,
      traitScores: result.traitScores
    };
  } catch (error) {
    console.error('[Results Page] Error fetching personality data:', error);
    return { hasPersonality: false };
  }
}

// --- 3. The Server Component ---

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  // Extract user ID from URL query params (?id=...) OR from auth token
  const params = await searchParams;
  let userId = params.id;

  // If no ID in URL, try to get from auth token
  if (!userId) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      
      if (token) {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string };
        userId = decoded.id;
      }
    } catch (error) {
      console.error('Error extracting user from token:', error);
    }
  }

  // Case A: No ID available (not logged in and no URL param)
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No User Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please log in or complete the quiz first to view your career recommendations.
          </p>
          <div className="flex gap-3 justify-center">
            <a 
              href="/login" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Log In
            </a>
            <a 
              href="/quiz" 
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Take Quiz
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Case B: Fetching Data
  const data = await getRecommendations(userId);
  const personalityData = await getPersonalityData(userId);

  // Case C: Error / Failed to Load
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 max-w-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Unable to Load Results
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn't retrieve recommendations for User ID: <span className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{userId}</span>. 
            Please ensure the AI Engine is running.
          </p>
          <a 
            href="/quiz" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retake Quiz
          </a>
        </div>
      </div>
    );
  }

  // Case D: Success - Transform data to match ResultsView expectations
  console.log('[Results Page] Raw data from AI Engine:', JSON.stringify(data, null, 2));
  console.log('[Results Page] Personality data:', JSON.stringify(personalityData, null, 2));
  
  const transformedData = {
    top_recommendation: {
      career_title: data.recommendations[0]?.title || 'No Match Found',
      match_score: (data.recommendations[0]?.match_score || 0) / 100, // Convert to 0-1 range
      career_code: data.recommendations[0]?.code,
      personality_fit: data.recommendations[0]?.personality_fit,
      aptitude_score: data.recommendations[0]?.aptitude_score,
      salary_range: undefined, // Backend doesn't provide this yet
      job_outlook: undefined,
      description: formatRIASECDescription(`Match Score: ${data.recommendations[0]?.match_score}% | Top Factors: ${data.recommendations[0]?.top_factors?.join(', ')}`),
      skills_matched: data.recommendations[0]?.top_factors || [],
      personality_alignment: {
        analytical: data.user_profile.logic || 0.5,
        creative: data.user_profile.creativity_design || 0.5,
        social: data.user_profile.service_social || 0.5,
        independent: data.user_profile.interest_r || 0.5,
        structured: data.user_profile.attention_speed || 0.5,
        flexible: data.user_profile.interest_a || 0.5,
      },
      reasoning: formatRIASECDescription(`Based on your aptitude scores in ${data.recommendations[0]?.top_factors?.join(', ')}, this career is an excellent match for you.`),
    },
    alternative_careers: data.recommendations.slice(1, 6).map((career) => ({
      career_title: career.title,
      match_score: career.match_score / 100,
      career_code: career.code,
      personality_fit: career.personality_fit,
      aptitude_score: career.aptitude_score,
      description: formatRIASECDescription(`Code: ${career.code} | Match: ${career.match_score}%`),
      skills_matched: career.top_factors,
      personality_alignment: {
        analytical: data.user_profile.logic || 0.5,
        creative: data.user_profile.creativity_design || 0.5,
        social: data.user_profile.service_social || 0.5,
        independent: data.user_profile.interest_r || 0.5,
        structured: data.user_profile.attention_speed || 0.5,
        flexible: data.user_profile.interest_a || 0.5,
      },
    })),
    user_profile: {
      dominant_traits: Object.entries(data.user_profile)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([key]) => key),
      skill_strengths: data.recommendations[0]?.top_factors || [],
    },
    personality_data: personalityData,
  };

  console.log('[Results Page] Transformed data for display:', JSON.stringify(transformedData, null, 2));

  return <ResultsView initialData={transformedData} />;
}