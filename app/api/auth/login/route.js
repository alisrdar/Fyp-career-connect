import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrytjs, { genSalt } from "bcryptjs"
import jwt from "jsonwebtoken"

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

        // Finding user in db
        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        } 

        // checking credentials
        const passswordMatch = await bcrytjs.compare(password, user.password)
        if(!passswordMatch){
            return NextResponse.json(
                { error: "Invalid credentials"},
                { status: 401}
            )
        }

        // json web token logic
        const tokenData = {
            id : user._id,
            name: user.name,
            email: user.email
        }

        const token =  jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: '1d'})

        const response =  NextResponse.json(
            { 
                message: "Sign in successful", 
                success: true
            },
            { status: 200 }
        )

        response.cookies.set("token", token, {
            httpOnly: true,
            // secure: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", 
            path: "/",
            maxAge: 3600,
        })

        return response;
    } catch (error){
        return NextResponse.json({error: error.message},
            {status: 500}
        )
    }
}
