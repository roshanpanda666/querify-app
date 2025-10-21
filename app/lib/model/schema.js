import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }, // "learner" or "moderator"

    // Skills of a moderator (AI will use these to match queries)
    skills: [{ type: String, required: true }],

    // Queries created by this user
    queries: [
      {
        query: { type: String, required: true },
        answers: [{ type: String, required: true }], // multiple answers per query
      },
    ],

    // 🆕 Queries assigned to this user (for moderators)
    queriesGot: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "queries" }, // original user who asked
        queryId: { type: String }, // optional reference id
        queryText: { type: String, required: true },
        answered: { type: Boolean, default: false },
        response: { type: String }, // moderator's response (filled later via PUT)
      },
    ],
  },
  { timestamps: true }
);

// fix the export model name to avoid confusion
export const USER =
  mongoose.models.queries || mongoose.model("queries", userModel);
