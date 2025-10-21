// /app/api/get_user_data/route.js
import { getServerSession } from "next-auth/next";
import { AuthProvider } from "@/app/provider"; // your NextAuth options
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionSRT } from "@/app/lib/db";
import { USER } from "@/app/lib/model/schema";

export async function GET(req) {
  try {
    // Get session
    const session = await getServerSession(AuthProvider);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Connect to DB
    await mongoose.connect(connectionSRT);

    // Find the user
    const user = await USER.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return all user data
    return NextResponse.json({
      username: user.username,
      email: user.email,
      role: user.role,
      skills: user.skills,
      queries: user.queries,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("❌ Error fetching user data:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
