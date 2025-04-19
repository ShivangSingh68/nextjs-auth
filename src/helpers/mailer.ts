import User from "@/models/users.models";
import { verify } from "crypto";
import nodemailer from "nodemailer";
import { Resend } from "resend";

// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export const mailSender = async ({ email, userId, emailType }: any) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const hashedOtp = Date.now() + Math.floor(Math.random() * 264) + userId;
    console.log(email, userId, emailType);
    let path;
    if (emailType === "Verify") {
      path = "confirmemail";
      const user = await User.findByIdAndUpdate(
        userId,
        {
          verifyToken: hashedOtp,
          verifyTokenExpiry: Date.now() + 3600000,
        },
        {
          new: true,
        }
      );
    } else if (emailType === "Reset") {
      path = "forgotpassword";
      const user = await User.findByIdAndUpdate(
        userId,
        {
          forgotPassword: hashedOtp,
          forgotPasswordExpiry: Date.now() + 3600000,
        },
        {
          new: true,
        }
      );
    }

    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "delivered@resend.dev",
      subject:
        emailType === "Verify" ? "Verify your Email" : "Reset your password",
      html: `<strong>Thanks for signing up! <a href="${process.env.DOMAIN}/${path}?token=${hashedOtp}">Click here!!</a><p> to confirm your email</p>${process.env.DOMAIN}/${path}?token=${hashedOtp}</strong>`,
    });

    return response;
  } catch (error: any) {
    console.error("❌ Mail send error:", error);
    throw new Error(error.message || "Unknown Error");
  }
};
