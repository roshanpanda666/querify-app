"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!username || !email || !password) {
      setError("Please fill all the fields");
      return;
    } else {
      setError("");
    }
  
    try {
      // Add default answers array here
      const defaultAnswers = [""]; // or ["Welcome!"] or any default value
  
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          queries: [
            {
              query: "Initial query",
              answers: defaultAnswers
            }
          ]
        })
      });
  
      if (res.ok) {
        setName("");
        setEmail("");
        setPassword("");
        router.push("/login"); // redirect to login or home
      } else {
        const data = await res.json();
        setError(data.error || "User registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="w-[40rem] border-2 border-white h-[28rem] rounded-2xl p-6 flex flex-col justify-center">
        <h1 className="text-center text-2xl font-semibold mb-8">Register Your Account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <input
            value={username}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="User Name"
            className="border-2 border-white text-white p-2 w-64 rounded bg-gray-800 placeholder-gray-400"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="border-2 border-white text-white p-2 w-64 rounded bg-gray-800 placeholder-gray-400"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="border-2 border-white text-white p-2 w-64 rounded bg-gray-800 placeholder-gray-400"
          />

          <button
            type="submit"
            className="mt-4 w-32 p-2 rounded bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Register
          </button>
        </form>

        {error && (
          <div className="bg-red-500 text-white text-center p-2 mt-4 w-64 mx-auto rounded">
            {error}
          </div>
        )}

        <p className="text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <Link href="/">
            <span className="text-blue-400 border-b border-gray-500 cursor-pointer">Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
