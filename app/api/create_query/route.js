import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { USER } from "@/app/lib/model/schema";
import { connectionSRT } from "@/app/lib/db";

// Connect to MongoDB (singleton pattern)
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connect() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
      cached.promise = mongoose.connect(connectionSRT).then((m) => m);
    }
    cached.conn = await cached.promise;
    return cached.conn;
  }


  export async function POST(req){
    await connect()

    try {
        const {email,username,query,answer}=await req.json()

        await USER.findOneAndUpdate(
            { email },
            { $setOnInsert: { username }, $push: { queries: { query, answers: answer } } },
            { upsert: true }
          );
          return NextResponse.json({ message: "Query added successfully" });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to add query" }, { status: 500 });
      }
  }