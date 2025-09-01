// app/api/survey/score/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { DbCon } from "@/lib/dbCon";
import PersonalityResponse from "@/models/PersonalityResponse";
import PersonalityQuestion from "@/models/PersonalityQuestion.js";
import { scorePersonalityFromDoc } from "../utils/scorePersonalityFromDoc.js";
import PersonalityResult from "@/models/PersonalityResult.js";

export async function POST() {
  try {
    await DbCon();

    //  Auth check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: userId } = jwt.verify(token, process.env.TOKEN_SECRET);

    // Find user's submitted survey answers
    const saved = await PersonalityResponse.findOne({ userId }).lean();
    console.log(saved.responses)

    if (!saved) {
      return NextResponse.json(
        { error: "No responses found" },
        { status: 404 }
      );
    }

    // Score their personality traits
    const traitScores = await scorePersonalityFromDoc(saved.responses);

    // Save or update the scored result in DB
    await PersonalityResult.findOneAndUpdate(
      { userId },
      {
        userId,
        traitScores,
        generatedAt: new Date(),
      },
      { upsert: true }
    );

    //  Return the scored result
    return NextResponse.json({ success: true, traitScores }, { status: 200 });
  } catch (err) {
    console.error("Error scoring personality:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}