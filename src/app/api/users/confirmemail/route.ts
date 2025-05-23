import { connect } from "@/dbconfig/dbconfig";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/users.models";

await connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid token",
          success: false,
        },
        {
          status: 401,
        }
      );
    }

    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    user.isVerified = true;
    await user.save();

    return NextResponse.json(
      {
        message: "Email confirmed successfully",
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
