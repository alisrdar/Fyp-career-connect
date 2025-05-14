
// app/api/dashboard/survey/progress/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { DbCon } from '@/lib/dbCon'
import PersonalityResponse from '@/models/PersonalityResponse'

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

    const record = await PersonalityResponse.findOne({ userId }).lean()
    if (!record) {
      return NextResponse.json({ completed: 0, responses: [] }, { status: 200 })
    }

    return NextResponse.json(
      { completed: record.responses.length, responses: record.responses },
      { status: 200 }
    )
  } catch (err) {
    console.error('[SURVEY PROGRESS ERROR]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
