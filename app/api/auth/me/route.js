import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    await DbCon();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("[/api/auth/me] User found:", user.email);
    console.log("[/api/auth/me] isAdmin:", user.isAdmin);

    delete user.password;
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
