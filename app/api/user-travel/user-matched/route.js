import { NextResponse } from "next/server";
import travelSchemaSave from "@/modal/travel";
import connectdb from "@/config/Db";

export async function POST(request) {
  await connectdb();
  try {
    const {
      travelToken,
      userToken,
      source,
      destination,
      completed,
      time,
      vehicleNumber,
      driverReview,
    } = await request.json();
    if (!travelToken) {
      return NextResponse.json({
        msg: "chla ja",
      });
    }
    const matched = await travelSchemaSave.create({
      travelToken,
      userToken,
      source,
      destination,
      completed,
      time,
      vehicleNumber,
      driverReview,
    });
    const savematched = await matched.save();
    return NextResponse.json({
      msg: "chl aaja",
      data: savematched,
    });
  } catch (err) {
    console.log(err);
  }
}
