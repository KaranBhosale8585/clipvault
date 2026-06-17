import nodemailer from "nodemailer";
import { logger } from "./logger";

export async function sendOtp(email: string, name: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: process.env.EMAIL_SERVER_SECURE === "true",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Auth Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "🔐 Your One-Time Password (OTP)",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Hello ${name},</h2>
          <p>We received a request to verify your identity. Please use the following One-Time Password (OTP):</p>
          
          <div style="background: #f9f9f9; border: 1px solid #ddd; padding: 15px; margin: 20px 0; text-align: center;">
            <h1 style="color: #333; letter-spacing: 3px;">${otp}</h1>
          </div>
          
          <p>This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
          
          <br/>
          <p>Best regards,</p>
          <p><b>Auth Team</b></p>
        </div>
      `,
    });
    await logger.info(`Email sent successfully to ${email}`, "email-service", { messageId: info.messageId, response: info.response });
    return info;
  } catch (error) {
    await logger.error(`Failed to send email to ${email}`, "email-service", error);
    throw error;
  }
}
