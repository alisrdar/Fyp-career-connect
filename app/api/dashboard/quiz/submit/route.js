import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import Question from "@/models/Question";
import UserResponse from "@/models/UserResponse";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await DbCon();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log("Token decoded:", decoded);
    } catch (err) {
      console.log("Invalid token");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    const { questionId, selectedAnswer } = await req.json();

    if (!questionId || !selectedAnswer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let question;
    if (mongoose.Types.ObjectId.isValid(questionId)) {
      question = await Question.findById(questionId);
    }
    if (!question) {
      question = await Question.findOne({ id: questionId });
    }
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const isCorrect = question.correctAnswer === selectedAnswer;

    await UserResponse.create({
      user: userId,
      question: question._id,
      response: selectedAnswer,
      isCorrect,
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { completedQuestionIds: question._id },
    });

    if (isCorrect) {
      await User.findByIdAndUpdate(userId, {
        $inc: { currentAbility: 0.1 },
      });
    }

    return NextResponse.json({ success: true, isCorrect }, { status: 200 });
  } catch (error) {
    console.error("Submit response error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
