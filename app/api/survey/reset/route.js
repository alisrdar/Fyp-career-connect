import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { DbCon } from "@/lib/dbCon";
import PersonalityResponse from "@/models/PersonalityResponse";
import PErsonalityResult from "@/models/PErsonalityResult";

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
      console.error('[SURVEY RESET] Invalid userId from token:', userId);
      return NextResponse.json(
        { error: "Invalid user identification" },
        { status: 400 }
      );
    }

    console.log(`[SURVEY RESET] ============================================`);
    console.log(`[SURVEY RESET] User requesting reset: ${userId}`);
    console.log(`[SURVEY RESET] Token decoded user ID: ${JSON.stringify(decoded)}`);
    
    // Count before deletion
    const beforeResponseCount = await PersonalityResponse.countDocuments({ userId });
    const beforeResultCount = await PErsonalityResult.countDocuments({ userId });
    const totalResponsesBefore = await PersonalityResponse.countDocuments({});
    const totalResultsBefore = await PErsonalityResult.countDocuments({});
    
    console.log(`[SURVEY RESET] THIS USER has ${beforeResponseCount} responses, ${beforeResultCount} results`);
    console.log(`[SURVEY RESET] TOTAL IN DB: ${totalResponsesBefore} responses, ${totalResultsBefore} results`);

    // Delete existing survey responses and results for THIS SPECIFIC USER ONLY
    const responseResult = await PersonalityResponse.deleteMany({ userId: userId });
    const resultResult = await PErsonalityResult.deleteMany({ userId: userId });
    
    // Count after deletion
    const totalResponsesAfter = await PersonalityResponse.countDocuments({});
    const totalResultsAfter = await PErsonalityResult.countDocuments({});

    console.log(`[SURVEY RESET] Deleted ${responseResult.deletedCount} responses for user: ${userId}`);
    console.log(`[SURVEY RESET] Deleted ${resultResult.deletedCount} results for user: ${userId}`);
    console.log(`[SURVEY RESET] TOTAL IN DB AFTER: ${totalResponsesAfter} responses, ${totalResultsAfter} results`);
    console.log(`[SURVEY RESET] ============================================`);

    return NextResponse.json({ 
      success: true,
      message: "Survey reset successful. You can now retake the survey.",
      deletedResponses: responseResult.deletedCount,
      deletedResults: resultResult.deletedCount
    }, { status: 200 });
    
  } catch (err) {
    console.error("[SURVEY RESET ERROR]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
