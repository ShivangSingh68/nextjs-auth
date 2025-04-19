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
    // console.log("SMTP CONFIG", {
    //   host: process.env.MAIL_HOST,
    //   port: process.env.MAIL_PORT,
    //   user: process.env.MAILTRAP_USER,
    //   pass: process.env.MAILTRAP_PASSWORD ? "✔️ set" : "❌ missing",
    // });
    // const hashedOtp = Date.now() + Math.floor(Math.random() * 264) + userId;
    // console.log(email, userId, emailType);
    // let path;
    // if (emailType === "Verify") {
    //   path = "confirmemail";
    //   const user = await User.findByIdAndUpdate(
    //     userId,
    //     {
    //       verifyToken: hashedOtp,
    //       verifyTokenExpiry: Date.now() + 3600000,
    //     },
    //     {
    //       new: true,
    //     }
    //   );
    //   console.log(user);
    // } else if (emailType === "Reset") {
    //   path = "forgotpassword";
    //   const user = await User.findByIdAndUpdate(
    //     userId,
    //     {
    //       forgotPassword: hashedOtp,
    //       forgotPasswordExpiry: Date.now() + 3600000,
    //     },
    //     {
    //       new: true,
    //     }
    //   );
    //   console.log(user);
    // }

    // const info = await transport.sendMail({
    //   from: "nextjs-auth.com", // sender address
    //   to: "bar@example.com, baz@example.com", // list of receivers
    //   subject:
    //     emailType === "Verify" ? "Verify your Email" : "Reset your password", // Subject line
    //   html: `<div
    //   style="
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     flex-direction: column;
    //   "
    // >
    //   <h1
    //     style="
    //       border-radius: 5px;
    //       padding: 5px;
    //       color: rgb(49, 57, 87);
    //       font-size: 50px;
    //     "
    //   >
    //     You are just one step away!!
    //   </h1>
    //   <div
    //     style="
    //       display: flex;
    //       justify-content: center;
    //       align-items: center;
    //       flex-direction: column;
    //       background-color: rgb(228, 173, 69);
    //       border-radius: 10px;
    //       padding: 10px;
    //       flex-wrap: wrap
    //     "
    //   >
    //     <a href="${process.env.DOMAIN}/${path}?token=${hashedOtp}">Click here!!</a>
    //     <div
    //       style="
    //         padding-top: 4px;
    //         font-size: larger;
    //         font-weight: 600;
    //         margin-top: 10px;
    //       "
    //     >
    //       <br />
    //       Or
    //     </div>
    //     <br />
    //     <p style="font-size: 20px">
    //       Copy and paste the link below in your web browser:
    //     </p>
    //     <p style="font-weight: 400; font-size: large">${process.env.DOMAIN}/confirmemail?token=${hashedOtp}</p>
    //   </div>
    // </div>`, // html body
    // });
    // console.log("Mail sent");
    // return info;
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
      console.log(user);
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
      console.log(user);
    }

    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "delivered@resend.dev",
      subject:
        emailType === "Verify" ? "Verify your Email" : "Reset your password",
      html: `<strong>Thanks for signing up! <a href="${process.env.DOMAIN}/${path}?token=${hashedOtp}">Click here!!</a><p> to confirm your email</p>${process.env.DOMAIN}/${path}?token=${hashedOtp}</strong>`,
    });

    console.log("mail sent!!");
    console.log(response);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Unknown Error");
  }
};
