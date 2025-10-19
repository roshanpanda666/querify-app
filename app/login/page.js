"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react"; // 👈 NextAuth magic

export default function LoginForm() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill all the fields ⚠️");
      return;
    }

    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, // 👈 so we can handle redirect manually
    });

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/profile"); // redirect to home/dashboard
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="w-[40rem] border-2 border-white h-[24rem] rounded-2xl p-6 flex flex-col justify-center">
        <h1 className="text-center text-2xl font-semibold mb-8">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="user name"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            className="border-2 border-white p-2 w-64 rounded bg-gray-800 placeholder-gray-400 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-white p-2 w-64 rounded bg-gray-800 placeholder-gray-400 text-white"
          />

          <button
            type="submit"
            className="mt-4 w-32 p-2 rounded bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Login
          </button>
        </form>

        {error && (
          <div className="bg-red-500 text-white text-center p-2 mt-4 w-64 mx-auto rounded">
            {error}
          </div>
        )}

        <p className="text-center mt-6 text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register">
            <span className="text-blue-400 border-b border-gray-500 cursor-pointer">
              Register
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
