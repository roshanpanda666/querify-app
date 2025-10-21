"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function QueryDetailsPage() {
  const { id } = useParams();
  const [query, setQuery] = useState(null);
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transmitting, setTransmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchQueryAndMods() {
      try {
        const [queryRes, modRes] = await Promise.all([
          fetch(`/api/query/${id}`),
          fetch(`/api/moderators`), // ⬅️ this new API route will return all moderators
        ]);

        if (!queryRes.ok) throw new Error("Failed to fetch query");
        if (!modRes.ok) throw new Error("Failed to fetch moderators");

        const queryData = await queryRes.json();
        const modData = await modRes.json();

        setQuery(queryData);
        setModerators(modData.moderators || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQueryAndMods();
  }, [id]);

  async function handleTransmit(modEmail) {
    try {
      setTransmitting(true);
      const res = await fetch("/api/transmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryId: id, modEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transmission failed");
      alert(`🚀 Query transmitted to ${modEmail}!`);
    } catch (err) {
      alert(`⚠️ ${err.message}`);
    } finally {
      setTransmitting(false);
    }
  }

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading query...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!query) return <p className="text-center mt-10 text-gray-400">Query not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          🧩 Query Details
        </h1>

        <p className="text-gray-200 text-lg mb-2">{query.query}</p>

        <h2 className="text-xl mt-6 mb-2 font-semibold text-blue-400">💬 Answers:</h2>
        {query.answers && query.answers.length > 0 ? (
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            {query.answers.map((ans, i) => (
              <li key={i}>{ans}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No answers yet.</p>
        )}

        {/* Moderators Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">
            🚀 Transmit this query to a Moderator
          </h2>

          {moderators.length === 0 ? (
            <p className="text-gray-500">No moderators available.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {moderators.map((mod, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className="p-4 bg-white/10 rounded-lg border border-white/10 flex flex-col gap-2"
                >
                  <p className="font-semibold text-white">{mod.username}</p>
                  <p className="text-gray-400 text-sm">{mod.email}</p>
                  <button
                    disabled={transmitting}
                    onClick={() => handleTransmit(mod.email)}
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {transmitting ? "Transmitting..." : "Transmit"}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
