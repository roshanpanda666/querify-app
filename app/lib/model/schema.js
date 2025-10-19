import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    queries: [
      {
        query: { type: String, required: true },
        answers: [{ type: String, required: true }], // multiple answers per query
      },
    ],
  },
  { timestamps: true }
);

export const USER = mongoose.models.queries || mongoose.model("queries", userModel);
