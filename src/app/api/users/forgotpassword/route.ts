import { mailSender } from "@/helpers/mailer";
import User from "@/models/users.models";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";

await connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          error: "Email not registered",
          success: false,
        },
        { status: 400 }
      );
    }

    const emailResponse = mailSender({
      email,
      userId: user._id,
      emailType: "Reset",
    });

    return NextResponse.json(
      {
        message: "Email send successfully",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message,
        success: false,
      },
      {
        status: 403,
      }
    );
  }
}
