"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Learner");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !role) {
      setError("Please fill all the fields");
      return;
    }

    if (role === "Moderator" && !skills.trim()) {
      setError("Please enter your skills");
      return;
    }

    setError("");

    try {
      const defaultAnswers = [""]; // initial query default

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
          skills: role === "Moderator" ? skills.split(",").map(s => s.trim()) : [],
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
        setSkills("");
        setRole("Learner");
        router.push("/login");
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
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-lg border-2 border-white rounded-2xl p-6 flex flex-col justify-center bg-gray-900/90 backdrop-blur-md">
        <h1 className="text-center text-2xl font-semibold mb-6">Register Your Account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            value={username}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="User Name"
            className="border-2 border-white text-white p-2 rounded bg-gray-800 placeholder-gray-400"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="border-2 border-white text-white p-2 rounded bg-gray-800 placeholder-gray-400"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="border-2 border-white text-white p-2 rounded bg-gray-800 placeholder-gray-400"
          />

          {/* Role Selection */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="Learner"
                checked={role === "Learner"}
                onChange={() => { setRole("Learner"); setShowPopup(false); }}
                className="accent-blue-500"
              />
              <span>Learner</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="Moderator"
                checked={role === "Moderator"}
                onChange={() => { setRole("Moderator"); setShowPopup(true); }}
                className="accent-blue-500"
              />
              <span>Moderator</span>
            </label>
          </div>

          {/* Moderator popup */}
          {showPopup && (
            <div className="bg-blue-900/80 border border-blue-500 p-4 rounded-md text-sm text-gray-200">
              Moderator responsibilities: Answer queries assigned by AI according to your skills.
            </div>
          )}

          {/* Skills input for moderators */}
          {role === "Moderator" && (
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              type="text"
              placeholder="Enter your skills (comma separated)"
              className="border-2 border-white text-white p-2 rounded bg-gray-800 placeholder-gray-400"
            />
          )}

          <button
            type="submit"
            className="mt-4 w-32 p-2 rounded bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Register
          </button>
        </form>

        {error && (
          <div className="bg-red-500 text-white text-center p-2 mt-4 w-full rounded">
            {error}
          </div>
        )}

        <p className="text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-blue-400 border-b border-gray-500 cursor-pointer">Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
