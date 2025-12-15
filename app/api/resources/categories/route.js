import { NextResponse } from "next/server";
import { DbCon } from "@/lib/dbCon";
import { categories } from "@/lib/newsCategories";

export async function GET() {
	try {
		await DbCon();
		// Return static categories for now; replace with DB later if needed
		return NextResponse.json({ categories }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
	}
}
