// nodemailer is used for send otp to the user

import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});
 
export const sendOptMail =async(to,otp)=>{
await transporter.sendMail({
    from:process.env.EMAIL,
    to,
    subject:"Reset Your Password",
    html: `<p>Your OTP for password reset is <b>${otp}</b></p>`

})
}