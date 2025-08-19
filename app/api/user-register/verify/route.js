import { Resend } from "resend";
import { NextResponse } from "next/server";

// Use environment variables for security and flexibility
const resendApiKey =
  process.env.RESEND_API_KEY || "re_GYPMdxgQ_LJV5fXhh2Jy2dKUbf35HkT2F";
const defaultFrom = process.env.EMAIL_FROM || "roamtogether@codelesspages.info";
const resend = new Resend(resendApiKey);

export async function POST(request) {
  try {
    const { to, subject, message, fromName } = await request.json();

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Email service not configured (missing RESEND_API_KEY)" },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, message" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to: [to],
      subject: subject,
      html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ${fromName || "Bhailkog"}
        </h1>
        <p style="color: #e0e7ff; font-size: 16px; margin: 10px 0 0 0; opacity: 0.9;">
          Email Verification Required
        </p>
      </div>
      
      <!-- Main Content -->
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <!-- Welcome Message -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); width: 70px; height: 70px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" stroke-width="2" fill="none"/>
              <polyline points="22,6 12,13 2,6" stroke="white" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0; font-weight: 600;">
            Verify Your Email
          </h2>
          <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.5;">
            Welcome to Bhailkog! Please verify your email to complete your registration.
          </p>
        </div>
        
        <!-- Verification Code -->
        <div style="background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
            Your Verification Code
          </p>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 10px 0;">
            <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 4px;">
              ${message}
            </span>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
            This code expires in 15 minutes
          </p>
        </div>
        
        <!-- Message Content -->
        <div style="margin: 30px 0; padding: 20px; background: #fefefe; border-left: 4px solid #3b82f6; border-radius: 0 6px 6px 0;">
          <div style="color: #374151; font-size: 15px; line-height: 1.6;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
        
        <!-- Security Note -->
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 25px 0;">
          <div style="display: flex; align-items: flex-start;">
            <div style="margin-right: 10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <p style="color: #92400e; font-size: 13px; margin: 0; font-weight: 500;">
                <strong>Security Tip:</strong> If you didn't request this verification, please ignore this email. Never share your verification code with anyone.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
            Need help? Contact our support team
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            This email was sent from <strong>Bhailkog</strong> • Powered by Resend
          </p>
        </div>
      </div>
    </div>
  `,
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email route error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
