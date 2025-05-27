import { NextResponse } from "next/server";
import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

export async function POST(request) {
  try {
    await DbCon();

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Step 1: Find all users with non-null verifyToken and not expired
    const users = await User.find({
      verifyToken: { $ne: null },
      verifyTokenExpiry: { $gt: Date.now() },
    });

    // Step 2: Check which user's verifyToken matches using bcrypt
    let matchedUser = null;
    for (const user of users) {
      const isMatch = await bcryptjs.compare(token, user.verifyToken);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Step 3: Update user as verified
    matchedUser.isVerified = true;
    matchedUser.verifyToken = undefined;
    matchedUser.verifyTokenExpiry = undefined;
    await matchedUser.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    }, { status: 200 });

  } catch (error) {
    console.error("Verify Email Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
