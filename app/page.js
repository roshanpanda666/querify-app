"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();

  // animation variants for steps
  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.4, duration: 0.6, ease: "easeOut" },
    }),
  };

  const steps = [
    { title: "Login", desc: "Use your credentials to log in to your account." },
    {
      title: "Generate a Query",
      desc: "Create your query in the dashboard, and a default answer will be attached automatically.",
    },
    {
      title: "Wait for AI Moderator",
      desc: "Our AI system will assign a moderator to review or answer your query.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col items-center p-6">
      <h1 className="text-5xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center">
        QUERIFY
      </h1>

      {session ? (
        <p className="mb-8 text-lg text-center">
          Logged in as:{" "}
          <span className="font-semibold text-blue-400">{session.user.email}</span>
        </p>
      ) : (
        <p className="mb-8 text-lg text-gray-400 text-center">
          You are not logged in 🔒
        </p>
      )}

      {/* Steps */}
      <div className="flex flex-col w-full max-w-md gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-full text-center shadow-lg"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={stepVariants}
          >
            <div className="text-2xl font-bold mb-2 text-blue-400">{i + 1}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-300">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Button */}
      <div className="mt-10">
        {session ? (
          <Link href="/createquery">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-lg font-semibold transition-all">
              🚀 Generate a Query
            </button>
          </Link>
        ) : (
          <Link href="/">
            <button className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-xl shadow-lg font-semibold transition-all">
              🔒 Log In to Generate Query
            </button>
          </Link>
        )}
      </div>

      {session && (
        <p className="mt-6 text-sm text-gray-400 italic text-center">
          Welcome back, {session.user.username}! Ready to create a new query? 🚀
        </p>
      )}
    </div>
  );
}
