import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";
import { connectionSRT } from "@/app/lib/db";
import { USER } from "@/app/lib/model/schema";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await mongoose.connect(connectionSRT);

    const user = await USER.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ queriesGot: user.queriesGot || [] }, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching mod queries:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
