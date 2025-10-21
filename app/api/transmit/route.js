import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionSRT } from "@/app/lib/db";
import { USER } from "@/app/lib/model/schema";

export async function POST(req) {
  try {
    await mongoose.connect(connectionSRT);

    const { queryId, modEmail } = await req.json();
    if (!queryId || !modEmail)
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    // 🔍 Fetch the moderator
    const moderator = await USER.findOne({ email: modEmail });
    if (!moderator)
      return NextResponse.json({ error: "Moderator not found" }, { status: 404 });

    // 🔍 Find the original user and query details
    const allUsers = await USER.find();
    let foundUser = null;
    let foundQuery = null;

    for (const user of allUsers) {
      const match = user.queries.find((q) => q._id.toString() === queryId);
      if (match) {
        foundUser = user;
        foundQuery = match;
        break;
      }
    }

    if (!foundUser || !foundQuery)
      return NextResponse.json({ error: "Query not found" }, { status: 404 });

    // 🧠 Check if moderator already has this query
    const alreadyExists = moderator.queriesGot?.some(
      (q) => q.queryId === queryId
    );

    if (!alreadyExists) {
      moderator.queriesGot.push({
        userId: foundUser._id,
        queryId,
        queryText: foundQuery.query,
        answered: false,
        response: "",
      });

      await moderator.save();
    }

    return NextResponse.json({
      success: true,
      message: `🚀 Query transmitted to ${modEmail}`,
    });
  } catch (err) {
    console.error("❌ Error transmitting query:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
