import UserSchemasave from "@/modal/user";
import connectdb from "@/config/Db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(req) {
  await connectdb();
  try {
    const { email, password } = await req.json();

    const finduser = await UserSchemasave.findOne({ email });
    if (finduser) {
      const res = bcrypt.compareSync(password, finduser.password);

      if (res) {
        return NextResponse.json({
          message: "Login success",
          data: finduser,
        });
      }
    }
    return NextResponse.json({
      message: "Login unsuccessefull",
    });
  } catch (err) {
    console.log(err);
  }
}
