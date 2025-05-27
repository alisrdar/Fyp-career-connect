import { NextResponse } from "next/server";
import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import { sendEmail } from "@/helpers/mailer"; // your token-hashing email helper

export async function POST(request) {
  try {
    await DbCon();

    const { email } = await request.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Call your email helper
    await sendEmail({
      email,
      emailType: "RESET",
      userId: user._id,
    });

    return NextResponse.json({
      message: "Reset password email sent successfully",
      success: true,
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
