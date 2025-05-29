import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { DbCon } from "@/lib/dbCon";
import PErsonalityResult from "@/models/PErsonalityResult";

export async function GET() {
  try {
    await DbCon();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: userId } = jwt.verify(token, process.env.TOKEN_SECRET);

    // Fetch latest personality score result
    const result = await PErsonalityResult.findOne({ userId }).lean();

    if (!result) {
      return NextResponse.json(
        { error: "No personality report found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      traitScores: result.traitScores,
      generatedAt: result.generatedAt,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
