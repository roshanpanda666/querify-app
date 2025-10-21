import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionSRT } from "@/app/lib/db";
import { USER } from "@/app/lib/model/schema";

export async function GET() {
  try {
    await mongoose.connect(connectionSRT);
    const moderators = await USER.find({ role: "Moderator" }).select("username email skills");
    return NextResponse.json({ moderators });
  } catch (err) {
    console.error("❌ Error fetching moderators:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
