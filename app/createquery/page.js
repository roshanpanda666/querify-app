"use client"; // frontend form
import { useState } from "react";

export default function CreateQueryPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const[answer,setanswer]=useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");
    alert(email)
    alert(username)
    alert(query)
    alert(answer)

    const res = await fetch("/api/create_query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, query,answer })
    });

    if (res.ok) {
      setStatus("Query added successfully ✅");
      setQuery("");
    } else {
      setStatus("Error adding query ❌");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Add a Query</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Your query..."
          value={query}
          required
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Your answer..."
          value={answer}
          required
          onChange={(e) => setanswer(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          Add Query
        </button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
