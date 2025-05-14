import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { DbCon } from '@/lib/dbCon'
import PersonalityQuestion from '@/models/PersonalityQuestion'

export async function GET(req) {
  try {
    await DbCon()
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token found' }, { status: 401 })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Fetch all survey questions
    // Optionally filter by type or order
    const questions = await PersonalityQuestion.find().sort({ type: 1, _id: 1 }).lean()

    return NextResponse.json({ questions }, { status: 200 })
  } catch (err) {
    console.error('[SURVEY QUESTIONS ERROR]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
