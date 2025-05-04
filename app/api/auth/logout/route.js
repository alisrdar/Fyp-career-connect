import { DbCon } from "@/lib/dbCon";
import { NextRequest, NextResponse } from "next/server";


//db connection
await DbCon()

export async function GET() {
    try{
        const response = NextResponse.json({
            message: "Logged out successfully",
            success: true
        })

        response.cookies.set("token","",{
            httpOnly: true,
            expires: new Date(0)
        })

        return response
    } catch(error){
        return NextResponse.json({error: error.message},
            {status: 500}
        )
    }
}