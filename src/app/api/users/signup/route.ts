import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models.js";
import bcrypt from "bcryptjs";
import { mailSender } from "@/helpers/mailer";

await connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, username, password } = reqBody;

    if ([email, username, password].some((field) => field.trim() === "")) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        { status: 402 }
      );
    }
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
      console.log("existed");
      return NextResponse.json(
        {
          error: "User with same email or username already exists",
        },
        {
          status: 401,
        }
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const registeredUser = await User.findById(user._id);
    if (!registeredUser) {
      return NextResponse.json(
        {
          error: "Something went wrong while registering User",
          success: false,
        },
        { status: 403 }
      );
    }
    const emailResponse = mailSender({
      email,
      userId: user._id,
      emailType: "Verify",
    });
    console.log(user);
    return NextResponse.json(
      {
        message: "User registered successfully",
        success: true,
        registeredUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
