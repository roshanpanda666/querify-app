import { connectionSRT } from "@/app/lib/db"
import { USER } from "@/app/lib/model/schema"
import mongoose from "mongoose"
import { NextResponse } from "next/server"
export async function GET(){
    await mongoose.connect(connectionSRT)
    const data=await USER.find()
    console.log(data);
    return NextResponse.json({data})
}