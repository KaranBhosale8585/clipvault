import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissionsTable } from "@/db/schema";
import { sendContactNotificationEmail } from "@/utils/email";
import { logger } from "@/utils/logger";
import { checkIPRateLimit } from "@/utils/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const isAllowed = await checkIPRateLimit(ip, "contact");
    
    if (!isAllowed) {
      logger.warn(`Rate limit exceeded for contact form from IP: ${ip}`, "contact-api");
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    logger.info("Received contact submission request", "contact-api", { body });
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      logger.warn("Validation failed: missing fields", "contact-api", { body });
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.warn("Validation failed: invalid email format", "contact-api", { email });
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Truncate inputs to fit DB schema
    const safeName = name.substring(0, 255);
    const safeEmail = email.substring(0, 255);
    const safeSubject = subject.substring(0, 255);
    const safeMessage = message.substring(0, 4096);

    // Store in database
    try {
      logger.info("Attempting database insertion", "contact-api");
      await db.insert(contactSubmissionsTable).values({
        name: safeName,
        email: safeEmail,
        subject: safeSubject,
        message: safeMessage,
      });
      logger.info("Database insertion successful", "contact-api");
    } catch (dbError) {
      const error = dbError as Error;
      logger.error("Database insertion failed", "contact-api", { 
        message: error.message, 
        stack: error.stack,
        error 
      });
      return NextResponse.json(
        { error: "Internal server error: failed to save submission", details: error.message },
        { status: 500 }
      );
    }

    // Send notification email to admin
    // We do this asynchronously and catch errors internally to not fail the request
    logger.info("Triggering admin notification email", "contact-api");
    sendContactNotificationEmail({ name, email, subject, message }).catch((err) => {
      logger.error("Failed to send contact notification email", "contact-api", { error: err });
    });

    logger.info(`New contact submission from ${email}`, "contact-api");

    return NextResponse.json({ success: true, message: "Submission received" });
  } catch (error) {
    const err = error as Error;
    logger.error("Unexpected error in contact submission API", "contact-api", { 
      message: err.message,
      stack: err.stack,
      error: err 
    });
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
