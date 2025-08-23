import { NextResponse } from "next/server";
import UserSchemasave from "@/modal/user";
import connectdb from "@/config/Db";
// import { useParams } from "next/navigation";

export async function GET(request, { params }) {
  await connectdb();
  try {
    const { userToken } = await params;

    const finduser = await UserSchemasave.findOne({ userToken });
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

export async function PUT(request, { params }) {
  await connectdb();
  try {
    const { userToken } = await params;
    const { name, email, phoneNumber, age } = await request.json();

    const finduser = await UserSchemasave.findOne({ userToken });
    if (finduser) {
      finduser.name = name;
      finduser.email = email;
      finduser.phoneNumber = phoneNumber;
      finduser.age = age;
      await finduser.save();
      return NextResponse.json({
        success: true,
        data: finduser,
      });
    }
    return NextResponse.json({
      message: "went wrong",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      message: "went wrong",
    });
  }
}
