"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FetchDataPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/test");
        if (!res.ok) throw new Error("Failed to fetch data");

        const json = await res.json();
        const usersArray = Array.isArray(json) ? json : json.data ? json.data : [];
        setData(usersArray);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Users & Queries
      </h1>

      <motion.div
        className="w-full max-w-5xl space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {data.length === 0 && <p className="text-center text-gray-400">No users found.</p>}

        {data.map((user, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="p-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg"
          >
            <h2 className="font-semibold text-lg mb-3">
              {user.username} <span className="text-gray-400 text-sm">({user.email})</span>
            </h2>

            {Array.isArray(user.queries) && user.queries.length > 0 ? (
              <div className="space-y-4">
                {user.queries.map((q, i) => (
                  <Link key={i} href={`/query/${q._id}`} passHref>
                    <motion.div
                      className="p-4 border border-white/20 rounded-lg hover:bg-white/10 transition cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="font-medium text-blue-400">Q: {q.query}</p>
                      <p className="text-gray-500 mt-1 text-sm">
                        Tap to view details →
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">No queries yet.</p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
