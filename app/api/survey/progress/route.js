
// app/api/dashboard/survey/progress/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { DbCon } from '@/lib/dbCon'
import PersonalityResponse from '@/models/PersonalityResponse'
import PersonalityQuestion from '@/models/PersonalityQuestion'

export async function GET(req) {
  try {
    await DbCon()
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 })
    }
    let decoded
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }
    const userId = decoded.id

    // Critical validation
    if (!userId || typeof userId !== 'string') {
      console.error('[SURVEY PROGRESS] Invalid userId from token:', userId);
      return NextResponse.json(
        { error: "Invalid user identification" },
        { status: 400 }
      );
    }

    console.log(`[SURVEY PROGRESS] Fetching progress for user: ${userId}`);

    // Fetch total number of questions
    const totalQuestions = await PersonalityQuestion.countDocuments()

    // Fetch user's responses
    const record = await PersonalityResponse.findOne({ userId }).lean()
    if (!record) {
      return NextResponse.json({ 
        completed: 0, 
        responses: [],
        totalQuestions,
        isComplete: false
      }, { status: 200 })
    }

    const answeredCount = record.responses.length
    const isComplete = answeredCount >= totalQuestions

    return NextResponse.json(
      { 
        completed: answeredCount, 
        responses: record.responses,
        totalQuestions,
        isComplete
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[SURVEY PROGRESS ERROR]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
