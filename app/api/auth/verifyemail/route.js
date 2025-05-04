import { DbCon } from "@/lib/dbCon";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";


export async function POST(request) {

    await DbCon();
    try{
        const reqBody = await request.json();
        const {token} = reqBody
        console.log(token);

        // getting the User
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: {$gt: Date.now()}
        })

        // if user not found
        if(!user){
            return NextResponse.json(
                {error: "Invalid token"}, 
                {status: 400}
            )
        }
        console.log(user);
        
        // removing unessary values
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        // inserying into db
        await user.save()

        console.log(user);

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        }, {status: 200})
        
    } catch (error){
        return NextResponse.json(
            {error: error.message}, 
            {status: 500}
        )
    }
}