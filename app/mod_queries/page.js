"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ModQueriesPage() {
  const { data: session } = useSession();
  const [queriesGot, setQueriesGot] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState({}); // store response inputs per queryId

  useEffect(() => {
    const fetchModQueries = async () => {
      if (!session) return;
      try {
        const res = await fetch("/api/get_mod_queries");
        const data = await res.json();

        if (!res.ok) setError(data.error || "Failed to fetch queries");
        else setQueriesGot(data.queriesGot || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong 😢");
      } finally {
        setLoading(false);
      }
    };

    fetchModQueries();
  }, [session]);

  const handleSubmit = async (queryId) => {
    const responseText = responses[queryId];
    if (!responseText || responseText.trim() === "") return alert("⚠️ Write something first!");

    try {
      const res = await fetch("/api/respond_to_query", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modEmail: session?.user?.email,
          queryId,
          response: responseText,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to submit response");

      // 💫 Optimistically update UI
      setQueriesGot((prev) =>
        prev.map((q) =>
          q.queryId === queryId
            ? { ...q, answered: true, response: responseText }
            : q
        )
      );

      setResponses((prev) => ({ ...prev, [queryId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Something went wrong 💥");
    }
  };

  if (!session)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <h2 className="text-xl">Please log in first 🔒</h2>
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p className="text-gray-400 animate-pulse">Loading moderator queries...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6 text-white">
      <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/10 border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
            🧠 Moderator Panel
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>

        {queriesGot.length === 0 ? (
          <p className="text-center text-gray-400 italic">No queries assigned yet 🔍</p>
        ) : (
          <div className="grid gap-5">
            {queriesGot.map((q, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-gray-800/60 border border-white/10 shadow-md hover:shadow-lg hover:bg-gray-800/80 transition-all"
              >
                <h2 className="text-lg font-semibold text-green-400 mb-2">
                  💬 {q.queryText}
                </h2>

                <p className="text-gray-400 text-sm mb-2">
                  From User ID: <span className="text-gray-300">{q.userId}</span>
                </p>

                {q.answered ? (
                  <div className="bg-green-700/30 border-l-2 border-green-400 pl-3 py-1">
                    <p className="text-green-300 font-semibold">✅ Answered:</p>
                    <p className="text-gray-200">{q.response}</p>
                  </div>
                ) : (
                  <div className="bg-yellow-700/30 border-l-2 border-yellow-400 pl-3 py-2 space-y-3">
                    <p className="text-yellow-300">⏳ Pending response</p>
                    <textarea
                      value={responses[q.queryId] || ""}
                      onChange={(e) =>
                        setResponses((prev) => ({
                          ...prev,
                          [q.queryId]: e.target.value,
                        }))
                      }
                      placeholder="Type your answer here..."
                      className="w-full bg-gray-900/70 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-green-400 outline-none"
                    />
                    <button
                      onClick={() => handleSubmit(q.queryId)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold transition"
                    >
                      🚀 Submit Answer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
