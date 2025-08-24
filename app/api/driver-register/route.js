import driverSchemasave from "@/modal/driver";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { v4 as uuidv4 } from "uuid";
import connectdb from "@/config/Db";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectdb();
  try {
    const {
      location,
      name,
      email,
      vehicleNumber,
      drivingLicensePhoto,
      driverPhoto,
      phoneNumber,
      OTP,
      verified,
      password,
    } = await request.json();

    const findemail = await driverSchemasave.findOne({ email });

    if (findemail) {
      return NextResponse.json({
        message: "Email already registered",
        status: 200,
      });
    }
    // ----------------------
    const saltRounds = 10;
    const hashedpassword = bcrypt.hashSync(password, saltRounds);

    const usertokenuuid = uuidv4();
    const msg = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    // ----------------------
    const savetheuser = new driverSchemasave({
      location,
      name,
      email,
      vehicleNumber,
      drivingLicensePhoto,
      driverPhoto,
      phoneNumber,
      OTP: msg,
      verified,
      password: hashedpassword,
    });
    const user = await savetheuser.save();
    // const subject = "Your OTP for verification";

    // const fromName = "RoamTogether@codelesspages.info";
    // await fetch("https://www.roamtogether.online/api/user-register/verify", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     to: email,
    //     subject,
    //     message: msg,
    //     fromName,
    //   }),
    // });

    return NextResponse.json({
      success: true,
      message: "Account  registered",
      status: 200,
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
}
