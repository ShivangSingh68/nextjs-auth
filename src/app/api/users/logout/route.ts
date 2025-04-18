import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { log } from "console";
import { Long_Cang } from "next/font/google";

dotenv.config();

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        message: "Logout successfull",
        success: true,
      },
      { status: 200 }
    );

    response.cookies.set("token", "", { httpOnly: true });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        success: false,
      },
      {
        status: 402,
      }
    );
  }
}
