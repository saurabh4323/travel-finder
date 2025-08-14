import { NextResponse } from "next/server";
import connectdb from "@/config/Db";
import bcrypt from "bcrypt";
import UserSchemasave from "@/modal/user";
import { v4 as uuidv4 } from "uuid";
import sendmailverification from "./verify/route";
import otpGenerator from "otp-generator";
export async function POST(request) {
  await connectdb();
  try {
    const { name, email, phoneNumber, password, userToken, age } =
      await request.json();

    const findemail = await UserSchemasave.findOne({ email });

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

    // ----------------------
    const savetheuser = new UserSchemasave({
      name,
      email,
      phoneNumber,

      password: hashedpassword,
      userToken: usertokenuuid,
      age,
    });
    const user = await savetheuser.save();
    const subject = "Your L'Oréal Sustainability Challenge 2025 marks";
    const msg = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const fromName = "Sustainability@codelesspages.info";
    await fetch("http://localhost:3000/api/user-register/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject,
        message: msg,
        fromName,
      }),
    });

    return NextResponse.json({
      message: "Account  registered",
      status: 200,
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
}
