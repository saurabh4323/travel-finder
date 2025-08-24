import { NextResponse } from "next/server";
import travelSchemaSave from "@/modal/travel";
import connectdb from "@/config/Db";

export async function PUT(request, { params }) {
  await connectdb();
  try {
    const { travelToken } = await params;
    const { vehicleNumber } = await request.json();

    const finduser = await travelSchemaSave.findOne({ travelToken });
    console.log(finduser);
    if (finduser) {
      finduser.vehicleNumber = vehicleNumber;

      await finduser.save();
      return NextResponse.json({
        success: true,
        data: finduser,
      });
    }
    return NextResponse.json({
      message: "went swrong",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      message: "went wrong",
    });
  }
}
