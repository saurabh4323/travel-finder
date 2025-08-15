import { NextResponse } from "next/server";
import connectdb from "@/config/Db";
import UserSchemasave from "@/modal/user";

export async function POST(request) {
  try {
    const { email, OTP } = await request.json();
    console.log(OTP, email);
    const validate = await UserSchemasave.findOne({ email, OTP });
    if (validate) {
      validate.verified = "true";
      await validate.save();
      return NextResponse.json({
        message: "Verified successfully",
        success: true,
      });
    }
    return NextResponse.json({
      message: "Verification failed",
      success: false,
    });
  } catch (err) {
    console.log(err);
  }
}
