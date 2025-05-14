import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import UserResponse from "@/models/UserResponse";

export async function GET() {
  try {
    await DbCon();

    const cookieStore = cookies();
    const token = await cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.id;

    const user = await User.findById(userId).select("completedQuestionIds currentAbility");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalCompleted = user.completedQuestionIds.length;

    const correctResponses = await UserResponse.countDocuments({
      user: userId,
      isCorrect: true,
    });

    return NextResponse.json({
      completed: totalCompleted,
      correct: correctResponses,
      currentAbility: user.currentAbility || 0,
    });
  } catch (error) {
    console.error("Quiz progress error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
