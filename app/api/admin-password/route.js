import connectdb from "@/config/Db";
import adminSchemasave from "@/modal/admin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectdb();
    const { password } = await request.json();

    const verify = await adminSchemasave.findOne({ password });
    if (verify) {
      return NextResponse.json({
        success: true,
        message: "welcome bhailog",
      });
    }
    return NextResponse.json({
      success: false,
      message: "kaun bhailog",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: err,
    });
  }
}
