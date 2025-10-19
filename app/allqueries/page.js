"use client";
import { useEffect, useState } from "react";

export default function FetchDataPage() {
  const [data, setData] = useState([]); // always default to empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/test");
        if (!res.ok) throw new Error("Failed to fetch data");

        const json = await res.json();

        // Ensure data is always an array
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">All Users & Queries</h1>
      {data.length === 0 && <p>No users found.</p>}
      {data.map((user, idx) => (
        <div key={idx} className="p-4 border rounded shadow">
          <h2 className="font-semibold">{user.username} ({user.email})</h2>
          {Array.isArray(user.queries) && user.queries.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {user.queries.map((q, i) => (
                <li key={i} className="border p-2 rounded">
                  <p className="font-medium">Q: {q.query}</p>
                  {Array.isArray(q.answers) && q.answers.length > 0 ? (
                    <ul className="ml-4 list-disc">
                      {q.answers.map((ans, j) => (
                        <li key={j}>{ans}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-4 text-gray-500">No answers yet.</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No queries yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}
