import { connectionSRT } from "@/app/lib/db";
import { USER } from "@/app/lib/model/schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { exists: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await mongoose.connect(connectionSRT);

    // Check if user exists
    const user = await USER.findOne({ email });

    if (user) {
      return NextResponse.json({ exists: true, message: "User exists" });
    } else {
      return NextResponse.json({ exists: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { exists: false, error: error.message },
      { status: 500 }
    );
  }
}
