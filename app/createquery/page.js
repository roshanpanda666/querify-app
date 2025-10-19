"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CreateQueryPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email || !session?.user?.username) {
      setStatus("⚠️ Please log in to submit queries.");
      return;
    }

    setStatus("⏳ Submitting...");

    try {
      const res = await fetch("/api/create_query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          username: session.user.username,
          query,
          answers: ["..."], // 🧠 default answer placeholder
        }),
      });

      if (res.ok) {
        setStatus("✅ Query added successfully!");
        setQuery("");
      } else {
        const data = await res.json();
        setStatus(`❌ ${data.error || "Error adding query"}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex justify-center items-center text-white">
      <div className="backdrop-blur-xl bg-white/10 border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          🧠 Create New Query
        </h1>

        {session ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="text-sm text-gray-400 mb-1">Logged in as</p>
              <p className="text-gray-300">
                <span className="font-medium">{session.user.username}</span>{" "}
                ({session.user.email})
              </p>
            </div>

            <textarea
              placeholder="Enter your query..."
              value={query}
              required
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800/60 border border-white/10 placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows="3"
            />

            <div className="rounded-lg border border-white/10 bg-gray-900/30 p-3 text-gray-400 text-sm italic">
              Default answer: <span className="text-white">"..."</span>
            </div>

            <button
              type="submit"
              className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 
                         hover:from-blue-500 hover:to-purple-500 transition-all font-semibold shadow-lg"
            >
              🚀 Submit Query
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-400">Please log in to add a query 🔒</p>
        )}

        {status && (
          <p
            className={`mt-5 text-center font-medium ${
              status.includes("✅")
                ? "text-green-400"
                : status.includes("⚠️")
                ? "text-yellow-400"
                : status.includes("❌")
                ? "text-red-400"
                : "text-blue-400"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
