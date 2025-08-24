import driverSchemasave from "@/modal/driver";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { v4 as uuidv4 } from "uuid";
import connectdb from "@/config/Db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectdb();
  try {
    const { vehicleNumber } = await params;

    const finduser = await driverSchemasave.findOne({ vehicleNumber });
    if (finduser) {
      return NextResponse.json({
        data: finduser,
        ok: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
}
