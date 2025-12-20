// app/api/dashboard/survey/submit/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { DbCon } from "@/lib/dbCon";
import PersonalityResponse from "@/models/PersonalityResponse";

export async function POST(req) {
  try {
    await DbCon();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    const userId = decoded.id;

    // Critical validation
    if (!userId || typeof userId !== 'string') {
      console.error('[SURVEY SUBMIT] Invalid userId from token:', userId);
      return NextResponse.json(
        { error: "Invalid user identification" },
        { status: 400 }
      );
    }

    const { responses } = await req.json();

    if (!Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: "No responses submitted" },
        { status: 400 }
      );
    }

    // Ensure each entry has both fields
    const bad = responses.some(
      (r) => !r.questionId || r.answer === undefined || r.answer === null
    );
    if (bad) {
      return NextResponse.json(
        { error: "Each response must include questionId and answer" },
        { status: 400 }
      );
    }

    // Upsert: merge new responses with existing ones
    const existingResponse = await PersonalityResponse.findOne({ userId });
    
    console.log(`[SURVEY SUBMIT] User ${userId} submitting ${responses.length} response(s)`);
    console.log(`[SURVEY SUBMIT] Existing record found: ${!!existingResponse}`);
    
    if (existingResponse) {
      // Merge: update existing answers, add new ones
      const responseMap = new Map(
        existingResponse.responses.map(r => [r.questionId, r.answer])
      );
      
      console.log(`[SURVEY SUBMIT] User ${userId} had ${existingResponse.responses.length} existing responses`);
      
      // Update/add new responses
      responses.forEach(r => {
        responseMap.set(r.questionId, r.answer);
      });
      
      // Convert back to array
      const mergedResponses = Array.from(responseMap.entries()).map(([questionId, answer]) => ({
        questionId,
        answer
      }));
      
      console.log(`[SURVEY SUBMIT] User ${userId} now has ${mergedResponses.length} total responses`);
      
      await PersonalityResponse.findOneAndUpdate(
        { userId },
        { responses: mergedResponses, updatedAt: new Date() },
        { upsert: true }
      );
    } else {
      // First submission - create new document
      console.log(`[SURVEY SUBMIT] Creating first submission for user ${userId}`);
      await PersonalityResponse.create({
        userId,
        responses,
        updatedAt: new Date()
      });
    }

    console.log(`[SURVEY SUBMIT] Successfully saved for user ${userId}`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[SURVEY SUBMIT ERROR]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
