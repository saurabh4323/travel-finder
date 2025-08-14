import { Resend } from "resend";
import { NextResponse } from "next/server";

// Use environment variables for security and flexibility
const resendApiKey =
  process.env.RESEND_API_KEY || "re_GYPMdxgQ_LJV5fXhh2Jy2dKUbf35HkT2F";
const defaultFrom = process.env.EMAIL_FROM || "Sustainability@codelesspages.info";
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
      <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        
        <p style="color: #fff3cd; font-size: 16px; margin: 10px 0 0 0; opacity: 0.9;">
          L'Oréal Sustainability Challenge 2025
        </p>
      </div>
      
      <!-- Main Content -->
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <!-- Welcome Message -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); width: 70px; height: 70px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white"/>
            </svg>
          </div>
          <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0; font-weight: 600;">
            L'Oréal Sustainability Challenge 2025
          </h2>
          <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.5;">
            Exciting news about your participation marks!
          </p>
        </div>
        
        <!-- Main Message -->
        <div style="background: #f9fafb; border: 2px solid #ff6b35; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
          <h3 style="color: #ff6b35; font-size: 22px; margin: 0 0 20px 0; font-weight: 700;">
            🎉 Can you give me a Munch?
          </h3>
          <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0; line-height: 1.6;">
            I will tell your marks of L'Oréal Sustainability Challenge 2025
          </p>
          
         
        </div>
        
        <!-- Exciting Note -->
        <div style="background: #fff8e1; border: 2px solid #ff6b35; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <div style="text-align: center;">
            <div style="margin-bottom: 15px;">
              <span style="font-size: 40px;">🍽️</span>
            </div>
            <p style="color: #e65100; font-size: 16px; margin: 0; font-weight: 600; line-height: 1.4;">
              <strong>Ready for a Munch?</strong><br>
              Get ready to discover your L'Oréal Sustainability Challenge 2025 performance results!
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
            Contact Saurabh Singh your best friend!
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
