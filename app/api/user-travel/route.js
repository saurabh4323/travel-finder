//jo travel chl rha hai uski mtlb bu se pc tk ka booking

// travel time - user tokens ,source ,destination ,time, driver review
//Map = user token first, second,souce,destination,,fare, time, drive name ,vechicle no

import { NextResponse } from "next/server";
import SecduleSchemaSave from "@/modal/Sechdule";
import connectdb from "@/config/Db";
import { v4 as uuidv4 } from "uuid";
export async function POST(req) {
  await connectdb();
  try {
    const { userToken, source, destination, time } = await req.json();
    const usertokenuuid = uuidv4();
    const sechduleit = new SecduleSchemaSave({
      userToken,
      source,
      destination,
      time,
      traveltoken: usertokenuuid,
    });
    const sechdule = sechduleit.save();

    return NextResponse.json({
      success: true,
      message: "Travel sechdule",
      status: 200,
      data: sechduleit,
    });
  } catch (err) {
    console.log(err);
  }
}
