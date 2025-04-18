import { connect } from "@/dbconfig/dbconfig";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/users.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

await connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if ([email, password].some((fields) => fields.trim() === "")) {
      return NextResponse.json(
        { error: "All fields are required" },
        {
          status: 401,
        }
      );
    }

    const user = await User.find({ email }); //user is a Array of length= 1
    if (user.length === 0) {
      return NextResponse.json(
        {
          error: "Email not registered",
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Incorrect Password",
        },
        {
          status: 401,
        }
      );
    }
    const tokenData = {
      id: user[0]._id,
      username: user[0].username,
      email: user[0].email,
      isAdmin: user[0].isAdmin,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    }); //Creating token

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        user: user[0],
      },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
