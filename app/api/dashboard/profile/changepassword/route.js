import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function PUT(req) {
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

		const { currentPassword, newPassword } = await req.json();
		if (!currentPassword || !newPassword) {
			return NextResponse.json(
				{ error: "Both current and new password required" },
				{ status: 400 }
			);
		}

		const user = await User.findById(decoded.id);
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const match = await bcrypt.compare(currentPassword, user.password);
		if (!match) {
			return NextResponse.json(
				{ error: "Current password is wrong" },
				{ status: 401 }
			);
		}

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(newPassword, salt);
		await user.save();

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Password change failed" },
			{ status: 500 }
		);
	}
}
