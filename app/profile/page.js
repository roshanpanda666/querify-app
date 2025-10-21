"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function ProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null); // full user data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;

      try {
        const res = await fetch("/api/getcurrentuser"); // GET request, no body
        const data = await res.json();

        if (!res.ok) setError(data.error || "Failed to load user data");
        else setUserData(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong 😢");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p className="text-red-500">{error}</p>
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
          👤 {userData.username}'s Profile
        </h1>

        <div className="text-center text-gray-400 mb-6 space-y-2">
  <p>Email: {userData.email}</p>
  <p>
    Role: <span className="text-blue-400 font-semibold">{userData.role}</span>
  </p>
  {userData.skills && userData.skills.length > 0 ? (
    <div className="flex flex-wrap justify-center gap-2 mt-1">
      {userData.skills.map((skill, i) => (
        <span
          key={i}
          className="bg-blue-500/30 text-blue-300 px-2 py-1 rounded"
        >
          {skill}
        </span>
      ))}
    </div>
  ) : (
    <p>Learner</p>
  )}

{userData.skills && userData.skills.length > 0 ? (
    <div className="flex flex-wrap justify-center gap-2 mt-1">
      <Link href={"/mod_queries"}>
      <div className="bg-blue-300 text-black rounded-3xl w-60 p-3">see queries you've got</div>
      </Link>
    </div>
  ) : (
    <p>Learner</p>
  )}
</div>

        {userData.queries && userData.queries.length > 0 ? (
          <div className="grid gap-5">
            {userData.queries.map((q, i) => (
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
        ) : (
          <p className="text-center text-gray-400">No queries yet 💤</p>
        )}
      </div>
    </div>
  );
}
