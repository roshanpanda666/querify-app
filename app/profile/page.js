"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQueries = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch("/api/get_user_queries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        const data = await res.json();
        if (res.ok) setQueries(data.queries);
        else setError(data.error || "Failed to load queries");
      } catch (err) {
        console.error(err);
        setError("Something went wrong 😢");
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [session]);

  if (!session)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <h2 className="text-xl">Please log in to view your profile 🔒</h2>
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p className="text-gray-400 animate-pulse">Loading your data...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6 text-white">
      <div className="max-w-3xl mx-auto backdrop-blur-xl bg-white/10 border border-white/10 p-8 rounded-3xl shadow-2xl">
        {/* Logout button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          👤 {session.user.username}'s Profile
        </h1>
        <p className="text-center text-gray-400 mb-8">
          {session.user.email} · {queries.length} Queries
        </p>

        {error && (
          <p className="text-red-400 text-center mb-4 font-semibold">{error}</p>
        )}

        {queries.length === 0 ? (
          <p className="text-center text-gray-400">No queries yet 💤</p>
        ) : (
          <div className="grid gap-5">
            {queries.map((q, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-gray-800/60 border border-white/10 shadow-md hover:shadow-lg hover:bg-gray-800/80 transition-all"
              >
                <h2 className="text-lg font-semibold text-blue-400 mb-2">
                  🧩 {q.query}
                </h2>

                {q.answers && q.answers.length > 0 ? (
                  <div className="space-y-2">
                    {q.answers.map((a, j) => (
                      <p
                        key={j}
                        className="text-gray-300 border-l-2 border-purple-500 pl-3"
                      >
                        💬 {a}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No answers yet...</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
