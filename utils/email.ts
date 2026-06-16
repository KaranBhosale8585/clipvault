import nodemailer from "nodemailer";
import { logger } from "./logger";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendApprovalEmail(email: string, name: string) {
  try {
    await transporter.sendMail({
      from: `"ClipVault Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "🚀 ClipVault Unlimited Access Approved!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Congratulations ${name}!</h2>
          <p>We are excited to inform you that your request for <b>Unlimited Access</b> to ClipVault has been <b>APPROVED</b>.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; margin: 20px 0; border-radius: 12px;">
            <h3 style="margin-top: 0; color: #166534;">What changes for you?</h3>
            <ul style="padding-left: 20px;">
              <li><b>Zero Limits:</b> Extract as many Reels as you need.</li>
              <li><b>No Daily Caps:</b> Your 10-download daily limit has been lifted.</li>
              <li><b>Priority Support:</b> Your requests are prioritized.</li>
            </ul>
          </div>
          
          <p>You can start using your unlimited access immediately. No further action is required.</p>
          <p>Thank you for being a part of ClipVault!</p>
          
          <br/>
          <p>Best regards,</p>
          <p><b>The ClipVault Team</b></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">If you have any questions, feel free to reply to this email or contact support.</p>
        </div>
      `,
    });
    logger.info(`Approval email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send approval email to ${email}`, "email-service", { error });
    // We don't throw here to avoid breaking the main flow
  }
}

export async function sendRejectionEmail(email: string, name: string) {
  try {
    await transporter.sendMail({
      from: `"ClipVault Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "ClipVault Unlimited Access Request Update",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2>Hello ${name},</h2>
          <p>Thank you for your interest in ClipVault Unlimited Access.</p>
          <p>After reviewing your request, we regret to inform you that we are unable to approve your application for unlimited access at this time.</p>
          
          <div style="background: #fff7ed; border: 1px solid #fed7aa; padding: 20px; margin: 20px 0; border-radius: 12px;">
            <p style="margin: 0; color: #9a3412;"><b>What this means?</b></p>
            <p style="margin: 10px 0 0 0;">Your account will remain on the standard tier with a daily limit of 10 downloads. You can continue using ClipVault as usual.</p>
          </div>
          
          <p>If you believe this was a mistake or your usage needs have changed, you can submit a new request in the future with more details about your use case.</p>
          
          <br/>
          <p>Best regards,</p>
          <p><b>The ClipVault Team</b></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">If you have any questions, feel free to contact support.</p>
        </div>
      `,
    });
    logger.info(`Rejection email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send rejection email to ${email}`, "email-service", { error });
    // We don't throw here to avoid breaking the main flow
  }
}

export async function sendContactNotificationEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    await transporter.sendMail({
      from: `"ClipVault Contact" <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM,
      subject: `📩 New Contact Submission: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #4f46e5;">New Contact Submission</h2>
          <p>You have received a new message from the ClipVault contact form.</p>
          
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0; border-radius: 12px;">
            <p style="margin: 0 0 10px 0;"><b>Name:</b> ${data.name}</p>
            <p style="margin: 0 0 10px 0;"><b>Email:</b> ${data.email}</p>
            <p style="margin: 0 0 10px 0;"><b>Subject:</b> ${data.subject}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
            <p style="margin: 0;"><b>Message:</b></p>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <p>Please log in to the admin panel to manage this submission.</p>
          
          <br/>
          <p>Best regards,</p>
          <p><b>ClipVault System</b></p>
        </div>
      `,
    });
    logger.info(`Contact notification email sent for ${data.email}`);
  } catch (error) {
    logger.error(`Failed to send contact notification email for ${data.email}`, "email-service", { error });
  }
}
