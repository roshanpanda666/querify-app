import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionSRT } from "@/app/lib/db";
import { USER } from "@/app/lib/model/schema";

export async function PUT(req) {
  try {
    await mongoose.connect(connectionSRT);
    const { modEmail, queryId, response } = await req.json();

    if (!modEmail || !queryId || !response) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ Step 1: Update moderator’s queryGot inline
    const modUpdate = await USER.findOneAndUpdate(
      { email: modEmail, "queriesGot.queryId": queryId },
      {
        $set: {
          "queriesGot.$.answered": true,
          "queriesGot.$.response": response,
        },
      },
      { new: true }
    );

    if (!modUpdate) {
      return NextResponse.json({ error: "Moderator or query not found" }, { status: 404 });
    }

    // ✅ Step 2: Fetch the queryGot item to locate the original user
    const queryGotItem = modUpdate.queriesGot.find((q) => q.queryId === queryId);
    if (!queryGotItem) {
      return NextResponse.json({ error: "Query item missing in moderator" }, { status: 404 });
    }

    // ✅ Step 3: Update original user's query.answers array
    const userUpdate = await USER.findOneAndUpdate(
      { _id: queryGotItem.userId, "queries._id": queryId },
      { $push: { "queries.$.answers": response } },
      { new: true }
    );

    if (!userUpdate) {
      return NextResponse.json({ error: "Original user or query not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Response successfully updated and synced 🔥",
    });
  } catch (err) {
    console.error("❌ Error in respond_to_query:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
