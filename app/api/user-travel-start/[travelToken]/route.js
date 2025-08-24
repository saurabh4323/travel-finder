import { NextResponse } from "next/server";
import connectdb from "@/config/Db";
import travelSchemaSave from "@/modal/travel";

export async function PUT(request, { params }) {
  await connectdb();
  try {
    const { travelToken } = await params;
    const { vehicleNumber, driverReview, completed } = await request.json();
    const findtravel = await travelSchemaSave.findOne({ travelToken });
    if (findtravel) {
      findtravel.completed = completed;
      findtravel.vehicleNumber = vehicleNumber;
      findtravel.driverReview = driverReview;

      return NextResponse.json({
        message: "ride hogya ",
      });
    }
    return NextResponse.json({
      message: "ride nhi hua ",
    });
  } catch (err) {
    console.log(err);
  }
}

export async function GET(request, { params }) {
  await connectdb();
  try {
    const { travelToken } = await params;

    const findtravel = await travelSchemaSave.findOne({ travelToken });
    if (findtravel) {
      return NextResponse.json({
        findtravel,
      });
    }
    return NextResponse.json({
      message: "ride nhi hua ",
    });
  } catch (err) {
    console.log(err);
  }
}
