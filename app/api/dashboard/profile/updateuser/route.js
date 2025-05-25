// api/dashboard/profile/UpdateUser/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    await DbCon();

    // 1) token nikaalo cookies se
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) verify & decode
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    const userId = decoded.id;

    // 3) body fields
    const { name, email, phone, avatarUrl } = await req.json();

    // 4) update user
    const updated = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, avatarUrl  },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    delete updated.password;
    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
