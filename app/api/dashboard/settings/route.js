import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// Basic settings endpoint ensuring the file is a valid module
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
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
		}

		const user = await User.findById(decoded.id).select("name email");
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Placeholder user settings payload
		return NextResponse.json({
			user: { name: user.name, email: user.email },
			settings: {
				theme: "system",
				notifications: true,
			},
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
	}
}
