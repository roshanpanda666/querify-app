import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionSRT } from "@/app/lib/db";
import { USER } from "@/app/lib/model/schema";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    await mongoose.connect(connectionSRT);

    const user = await USER.findOne({ "queries._id": id }, { "queries.$": 1 });
    if (!user || !user.queries[0]) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    return NextResponse.json(user.queries[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
