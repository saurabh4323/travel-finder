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
    const { userToken, fromLocation, toLocation, time } = await req.json();
    const usertokenuuid = uuidv4();

    const findtraveler = await SecduleSchemaSave.findOne({
      source: fromLocation,
      destination: toLocation,
    });
    console.log(findtraveler);
    if (findtraveler) {
      return NextResponse.json({
        message: "congo",
        data: findtraveler.userToken,
        traveltoken: findtraveler.traveltoken,
      });
    }
    const sechduleit = new SecduleSchemaSave({
      userToken,
      source: fromLocation,
      destination: toLocation,
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
