import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";



export async function POST(request) {
    await DbCon();
    const userId= await getDataFromToken(request);
    const user = await User.findOne({_id: userId}).select("-password");

    // check if there is no user 

    return NextResponse.json({
        message: "User found",
        data: user
    })
}