import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrytjs, { genSalt } from "bcryptjs"
import { sendEmail } from "@/helpers/mailer";

// db connection
await DbCon();

export async function POST(request) {
    try{
        // getting email and pass from frontend
        const reqBody = await request.json()
        const {email, password} = reqBody;

        console.log(reqBody);

        // //hashing ---> wrong ❌; as hash is different each time --> only compare it
        // const salt = await bcrytjs.genSalt(10)
        // const hashedPassword = await bcrytjs.hash(password, salt)

        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        } 

        const passswordMatch = bcrytjs.compare(password, user.password)
        if(!passswordMatch){
            return NextResponse.json(
                { error: "Invalid credentials"},
                { status: 401}
            )
        }

        return NextResponse.json(
            { 
                message: "Sign in successful", 
                success: true 
            },
            { status: 200 }
        )

        
    } catch (error){
        return NextResponse.json({error: error.message},
            {status: 500}
        )
    }
}