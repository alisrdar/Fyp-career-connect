// app/api/proxy/[...path]/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import { DbCon } from '@/lib/dbCon';
import UserAIProfile from '@/models/UserAIProfile';

const AI_ENGINE_URL = process.env.AI_ENGINE_URL 

export async function GET(req, { params }) {
  const resolvedParams = await params;
  const endpoint = Array.isArray(resolvedParams?.path) ? resolvedParams.path.join('/') : '';

  try {
    const url = `${AI_ENGINE_URL}/${endpoint}`;
    console.log(`🔌 Proxying GET to: ${url}`);

    const resp = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
    });

    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    console.error(`❌ Proxy GET Error [${endpoint}]:`, error?.message || error);
    return NextResponse.json(
      { error: 'Failed to reach AI Engine' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(req, { params }) {
  const resolvedParams = await params;
  const endpoint = Array.isArray(resolvedParams?.path) ? resolvedParams.path.join('/') : '';

  // Validate AI_ENGINE_URL exists
  if (!AI_ENGINE_URL) {
    console.error('❌ AI_ENGINE_URL is not defined in environment variables!');
    return NextResponse.json(
      { 
        error: 'AI Engine Configuration Missing', 
        details: 'AI_ENGINE_URL environment variable is not set' 
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const url = `${AI_ENGINE_URL}/${endpoint}`;
    console.log(`🔌 Proxying POST to: ${url}`);
    console.log(`🌐 AI_ENGINE_URL: ${AI_ENGINE_URL}`);
    console.log(`📦 Body:`, body);

    const resp = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true, // handle all statuses manually
    });

    // --- 🛑 INTERCEPTION LOGIC 🛑 ---
    // If this was a "Save Response" call, we must sync the Python result to MongoDB
    if (endpoint === 'user/save-response') {
      await DbCon(); // Connect to MongoDB

      // The Python engine returns: { current_scores: { logic: { mu: 0.6... } } }
      const { current_scores } = resp.data || {};
      const { user_id, question_id } = body;

      if (current_scores && user_id) {
        try {
          // Update the UserAIProfile in MongoDB
          const updated = await UserAIProfile.findOneAndUpdate(
            { userId: user_id },
            { 
              $set: { aptitudeScores: current_scores },
              $addToSet: { questionHistory: question_id } // Prevent repeat questions
            },
            { upsert: true, new: true }
          );
          console.log("✅ Synced AI scores to MongoDB for user:", user_id);
          console.log("📊 Updated scores:", current_scores);
        } catch (dbError) {
          console.error("❌ MongoDB sync error:", dbError.message);
          // Don't fail the request if DB sync fails - Python calculation still succeeded
        }
      }
    }
    // --------------------------------

    if (resp.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    // Handle "Quiz Finished" signal
    if (error.response?.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    
    // Handle "Session Expired" (Python RAM cleared)
    if (error.response?.status === 404) {
      console.log(`⚠️ Session expired for endpoint: ${endpoint}`);
      return NextResponse.json({ error: 'Session Expired' }, { status: 404 });
    }

    console.error(`❌ Proxy POST Error [${endpoint}]:`, error?.message || error);
    console.error(`   Response:`, error?.response?.data);
    console.error(`   AI_ENGINE_URL:`, AI_ENGINE_URL);
    console.error(`   Attempted URL:`, `${AI_ENGINE_URL}/${endpoint}`);
    return NextResponse.json(
      { 
        error: 'AI Engine Connection Failed', 
        details: error?.response?.data || error.message,
        attemptedUrl: AI_ENGINE_URL ? 'configured' : 'MISSING',
        endpoint: endpoint
      },
      { status: error.response?.status || 500 }
    );
  }
}
