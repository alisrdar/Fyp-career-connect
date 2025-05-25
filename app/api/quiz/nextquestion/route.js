import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { DbCon } from "@/lib/dbCon";
import Question from "@/models/Question";
import UserResponse from "@/models/UserResponse";

// Dummy logic to estimate ability
function estimateUserAbility(responses) {
  if (responses.length === 0) return 0.5;
  const correct = responses.filter((r) => r.correct).length;
  return correct / responses.length;
}

export async function GET(req) {
  try {
    await DbCon(); // Assuming this connects to your database
    console.log('Database connected');

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    console.log('Token:', token);

    if (!token) {
      console.log('No token found');
      return NextResponse.json({ error: 'Unauthorized: No token found' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log('Token decoded:', decoded);
    } catch (err) {
      console.log('Invalid token');
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = decoded.id;
    console.log('User ID:', userId);

    const responses = await UserResponse.find({ user: userId });
    console.log('User responses:', responses.length);

    if (responses.length >= 10) {
      return NextResponse.json(
        { message: 'Quiz completed!', done: true },
        { status: 200 }
      );
    }

    const ability = estimateUserAbility(responses); // Your ability estimation function
    console.log('Estimated ability:', ability);

    // Define the missing function here
    function getDifficultyFromAbility(ability) {
      if (ability < 0.33) return "easy";
      else if (ability < 0.66) return "medium";
      else return "hard";
    }

    const targetDifficulty = getDifficultyFromAbility(ability);
    console.log('Target difficulty:', targetDifficulty);

    const answeredIds = responses.map(r => r.question.toString());
    console.log('Answered question IDs:', answeredIds);

    const nextQuestion = await Question.findOne({
      _id: { $nin: answeredIds },
      difficulty: targetDifficulty
    });
    console.log('Next question:', nextQuestion);

    if (!nextQuestion) {
      console.log('No more questions available for difficulty:', targetDifficulty);
      return NextResponse.json(
        { message: 'No more questions available.', done: true }, 
        { status: 200 });
    }


    return NextResponse.json({
      id: nextQuestion._id,
      question: nextQuestion.question,
      options: nextQuestion.options,
      subject: nextQuestion.subject,
      difficulty: nextQuestion.difficulty,
      ...(nextQuestion.subject === "verbal" ? { article: nextQuestion.article } : nextQuestion.subject === "science" ? { support: nextQuestion.support } : {})
    });
  } catch (err) {
    console.error('QUIZ NEXT ERROR', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// magic mantra try to clean next cache: Remove-Item -Recurse -Force .next

