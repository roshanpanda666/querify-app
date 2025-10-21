import { connectionSRT } from "@/app/lib/db";
import { USER } from "@/app/lib/model/schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { username, email, password, role, skills } = await req.json();

    // Basic validation
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: "Please fill all the required fields" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await mongoose.connect(connectionSRT);

    // Check if email or username already exists
    const existingUser = await USER.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email or username already registered" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default query/answers
    const defaultQueries = [
      {
        query: "Welcome query",
        answers: ["_"],
      },
    ];

    // Create new user
    const newUser = await USER.create({
      username,
      email,
      password: hashedPassword,
      role, // store role
      skills: role === "Moderator" ? skills || [] : [], // only moderators have skills
      queries: defaultQueries,
    });

    console.log("User Created ->", newUser);

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in registration:", error);

    // Catch duplicate key error from MongoDB
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
