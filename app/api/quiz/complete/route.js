// app/api/quiz/complete/route.js
import { NextResponse } from 'next/server';
import { DbCon } from '@/lib/dbCon';
import QuizSession from '@/models/QuizSession';
import { getDataFromToken } from '@/helpers/getDataFromToken';

// POST - Mark quiz as completed
export async function POST(req) {
  try {
    await DbCon();
    
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { finalXp, finalStreak } = body;

    // Find and complete the current session
    const session = await QuizSession.findOneAndUpdate(
      { userId, status: 'in_progress' },
      {
        $set: {
          status: 'completed',
          completedAt: new Date(),
          completedStages: [1, 2, 3],
          xp: finalXp,
          streak: finalStreak,
        }
      },
      { new: true, sort: { createdAt: -1 } }
    );

    if (!session) {
      return NextResponse.json({ error: 'No active session found' }, { status: 404 });
    }

    return NextResponse.json({ session }, { status: 200 });
  } catch (error) {
    console.error('Complete session error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
