import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrytjs, { genSalt } from "bcryptjs"
import { sendEmail } from "@/helpers/mailer";

export async function POST(request) {
    try{
        // db connectiion
        await DbCon()

        // geting credentials from frontend
        const reqBody =await request.json();
        const {name, email, password} = reqBody
        console.log(reqBody);

        // checking if email is present in db
        const user = await User.findOne({email});

        if(user) {
            return NextResponse.json(
                {error: "User Already Exists"},
                {status: 400}
            )
        }
        
        //hashing
        const salt = await bcrytjs.genSalt(10)
        const hashedPassword = await bcrytjs.hash(password, salt)

        const newUser = new User ({
            name,
            email,
            password : hashedPassword
        })

        const savedUser = await newUser.save();

        // send verification email
        await sendEmail({email,emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            savedUser
        })

    } catch(error){
        return NextResponse.json({error: error.message},
            {status: 500}
        )
    }
}