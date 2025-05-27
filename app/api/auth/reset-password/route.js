import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrytjs, { genSalt } from "bcryptjs"

export async function POST(request) {
  try {
    await DbCon();

    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 }
      );
    }

    // Step 1: Get all users with a reset token that hasn't expired
    const users = await User.find({
      forgotPasswordToken: { $ne: null },
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    // Step 2: Find matching user by comparing token
    let matchedUser = null;

    for (const user of users) {
      const isMatch = await bcrytjs.compare(token, user.forgotPasswordToken);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 400 }
      );
    }

    // Step 3: Hash new password
    const salt = await bcrytjs.genSalt(10)
    const hashedPassword = await bcrytjs.hash(newPassword, salt);

    console.log("Before password change:", matchedUser.password);
    // Step 4: Save new password and clear reset token
    matchedUser.password = hashedPassword;
    matchedUser.forgotPasswordToken = undefined;
    matchedUser.forgotPasswordTokenExpiry = undefined;
    await matchedUser.save();

    console.log("After password change:", matchedUser.password);

    return NextResponse.json({
      message: "Password updated successfully",
      success: true,
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
