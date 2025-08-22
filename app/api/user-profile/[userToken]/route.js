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
