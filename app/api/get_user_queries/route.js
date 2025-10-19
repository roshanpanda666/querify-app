import { NextResponse } from "next/server";


import mongoose from "mongoose";
import { connectionSRT } from "@/app/lib/db";
import { USER } from "@/app/lib/model/schema";

export async function POST(req) {
  try {
    await mongoose.connect(connectionSRT);
    const { email } = await req.json();

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await USER.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ queries: user.queries || [] }, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching user queries:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
