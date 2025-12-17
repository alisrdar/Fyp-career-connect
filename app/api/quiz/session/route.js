// app/api/quiz/session/route.js
import { NextResponse } from 'next/server';
import { DbCon } from '@/lib/dbCon';
import QuizSession from '@/models/QuizSession';
import { getDataFromToken } from '@/helpers/getDataFromToken';

// GET - Get current user's active session
export async function GET(req) {
  try {
    await DbCon();
    
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activeSession = await QuizSession.findOne({
      userId,
      status: 'in_progress'
    }).sort({ createdAt: -1 });

    return NextResponse.json({ session: activeSession }, { status: 200 });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create or update quiz session
export async function POST(req) {
  try {
    await DbCon();
    
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { demographic, questionCount, currentStageId, completedStages, streak, xp, maxQuestions } = body;

    // Find existing in-progress session
    let session = await QuizSession.findOne({
      userId,
      status: 'in_progress'
    });

    if (session) {
      // Update existing session
      session.questionCount = questionCount ?? session.questionCount;
      session.currentStageId = currentStageId ?? session.currentStageId;
      session.completedStages = completedStages ?? session.completedStages;
      session.streak = streak ?? session.streak;
      session.xp = xp ?? session.xp;
      await session.save();
    } else {
      // Create new session
      session = await QuizSession.create({
        userId,
        demographic,
        maxQuestions: maxQuestions || 30,
        questionCount: questionCount || 0,
        currentStageId: currentStageId || 1,
        completedStages: completedStages || [],
        streak: streak || 0,
        xp: xp || 0,
      });
    }

    return NextResponse.json({ session }, { status: 200 });
  } catch (error) {
    console.error('Create/Update session error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete/abandon current session (for retake)
export async function DELETE(req) {
  try {
    await DbCon();
    
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mark current session as abandoned
    await QuizSession.updateMany(
      { userId, status: 'in_progress' },
      { $set: { status: 'abandoned' } }
    );

    return NextResponse.json({ message: 'Session abandoned' }, { status: 200 });
  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
