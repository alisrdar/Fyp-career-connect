// app/api/dashboard/survey/submit/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { DbCon } from "@/lib/dbCon";
import PersonalityResponse from "@/models/PersonalityResponse";

export async function POST(req) {
  try {
    await DbCon();
    const cookieStore = cookies();
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

    // Upsert: create or overwrite existing survey responses for this user
    await PersonalityResponse.findOneAndUpdate(
      { userId },
      { userId, responses, updatedAt: new Date() },
      { upsert: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[SURVEY SUBMIT ERROR]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
