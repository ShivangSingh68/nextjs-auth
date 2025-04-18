import { connect } from "@/dbconfig/dbconfig";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/users.models";
import bcrypt from "bcryptjs";

await connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, newPassword } = reqBody;
    console.log(token, newPassword);

    const user = await User.findOne({
      forgotPassword: token,
      forgotPasswordExpiry: { $gt: Date.now() },
    });
    console.log("user", user);
    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid token",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    user.forgotPassword = undefined;
    user.forgotPasswordExpiry = undefined;
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      {
        message: "Password changed successfully",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
