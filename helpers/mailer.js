import crypto from "crypto";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import User from "@/models/User";

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    // generate secure plain token
    const plainToken = crypto.randomBytes(32).toString("hex"); 
    const hashedToken = await bcryptjs.hash(plainToken, 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 600000,
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const link = emailType === "VERIFY"
      ? `${process.env.DOMAIN}/verifyemail?token=${plainToken}` // 🔥
      : `${process.env.DOMAIN}/reset-password?token=${plainToken}`;

    const actionText = emailType === "VERIFY" ? "verify your email" : "reset your password";

    const mailOptions = {
      from: "careerconnectpgce.dev@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your Email" : "Reset your Password",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <p>Click <a href="${link}">here</a> to ${actionText}</p>
          <p>Or copy and paste into your browser:</p>
          <p><a href="${link}">${link}</a></p>
        </div>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;

  } catch (err) {
    throw new Error(err.message);
  }
};
