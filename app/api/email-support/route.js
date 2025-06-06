import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!email || !subject || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a transporter with just the essential credentials
    const transporter = nodemailer.createTransport({
      service: "gmail", // Using Gmail as the service simplifies configuration
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Format the email
    const senderName = name || "Blawg User";
    const mailOptions = {
      from: `"${senderName}" <${email}>`, // Shows as sent from the user's email
      to: process.env.EMAIL_USER, // Support email is the same as the sending email
      replyTo: email, // Replies will go to the user
      subject: `Support Request: ${subject}`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4a5568;">New Support Request</h2>
  <p><strong>From:</strong> ${senderName}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Subject:</strong> ${subject}</p>
  <div style="margin-top: 20px; padding: 15px; background-color: #f7fafc; border-left: 4px solid #4299e1; border-radius: 4px;">
    <h3 style="margin-top: 0; color: #4a5568;">Message:</h3>
    <p style="white-space: pre-line;">${message}</p>
  </div>
</div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
} 