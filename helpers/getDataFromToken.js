import { cookies } from "next/headers";
import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrytjs, { genSalt } from "bcryptjs"
import jwt from "jsonwebtoken";
export const getDataFromToken = (request) => {
  try {
    const token = request.cookies.get("token")?.value || "";

    if (!token) {
      throw new Error("No token found in cookies");
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

    return decodedToken.id;

  } catch (error) {
    
    throw new Error("Token verification failed: " + error.message)
  }
}