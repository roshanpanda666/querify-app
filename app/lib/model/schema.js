import mongoose from 'mongoose'

const userModel=new mongoose.Schema({
    query:String,
    email:String,
    username:String,
    answer:String,
})

export const USER=mongoose.models.queries || mongoose.model("queries",userModel)