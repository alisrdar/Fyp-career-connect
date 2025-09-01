export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000, // 1 hour
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

    const action = emailType === 'VERIFY'
      ? "verify your email"
      : "reset your password";

    const link = emailType === "VERIFY"
      ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
      : `${process.env.DOMAIN}/reset-password?token=${hashedToken}`;

    const mailOptions = {
      from: 'careerconnectpgce.dev@gmail.com',
      to: email,
      subject: emailType === 'VERIFY' ? "Verify your Email" : "Reset your Password",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <p>Click <a href="${link}">here</a> to ${action}</p>
          <p>Or copy and paste this link into your browser:</p>
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
