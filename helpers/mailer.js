import mongoose from "mongoose";
import nodemailer from "nodemailer"
import User from "@/models/User";
import bcryptjs from "bcryptjs"

export const sendEmail = async({email, emailType, userId}) => {
    try{

        //  configure mail for usage
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId, 
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000  // 60 minutes
                }
            ) 
        } else if(emailType === "RESET"){ 
            await User.findByIdAndUpdate( userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                }
            )
        }

        // Looking to send emails 
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        });

        const action = emailType === 'VERIFY' ? "Verify your Email" : "Reset your passsword";
        const link = `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`;

        const mailOptions = {
            from: 'careerconnectpgce.dev@gmail.com', // sender address
            to: email, // receiver
            subject: emailType === 'VERIFY' ? "Verify your Email" : "Reset your password", // Subject line
            html: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <p>Click <a href="${link}">here</a>to ${action}</p>
                    <p>Or copy and paste into your browser:</p>
                    <p><a href="${link}">${link}</a></p>
                </div>
            `, // html 
          }
        const mailResponse= await transport.sendMail(mailOptions)
        return mailResponse
    }
    catch(err){
        throw new Error(err.message)
    }
} 

{/* <p>
    Click 
    <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> 

    to ${emailType === "VERIFY" ? "verify your email": "reset your password"} 
    or copy the link bellow in your browser. 

    <br/> 
    ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
</p> */}

    // const transporter = nodemailer.createTransport({
        //     host: "smtp.ethereal.email",
        //     port: 587,
        //     secure: false, // true for port 465, false for other ports
        //     auth: {
        //     user: "maddison53@ethereal.email",
        //     pass: "jn7jnAPss4f63QBp6D",

        //     },
        // });

        // user: "e9ab5da3af271a", // ❌ should be .env
        // pass: "257af42f190ca5"  // ❌
