"use client";
import { useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/50 via-gray-800/40 to-gray-900/50 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                Querify
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/createquery"
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Create Query
            </Link>
            <Link
              href="/allqueries"
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              All Queries
            </Link>
            <Link
              href="/profile"
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Profile
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800/50 backdrop-blur-xl border-t border-white/10 px-2 pt-2 pb-4 space-y-1 rounded-b-xl shadow-lg">
          <Link
            href="/"
            className="block px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/createquery"
            className="block px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Create Query
          </Link>
          <Link
            href="/allqueries"
            className="block px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            All Queries
          </Link>
          <Link
            href="/profile"
            className="block px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
}
