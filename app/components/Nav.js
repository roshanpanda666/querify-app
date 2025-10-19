"use client";
import { useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="font-bold text-xl">Querify</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-400">Home</Link>
            <Link href="/createquery" className="hover:text-blue-400">Create Query</Link>
            <Link href="/allqueries" className="hover:text-blue-400">All Queries</Link>
            <Link href="/about" className="hover:text-blue-400">About</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-2 pt-2 pb-4 space-y-1">
          <Link href="/" className="block px-3 py-2 rounded hover:bg-gray-700">Home</Link>
          <Link href="/createquery" className="block px-3 py-2 rounded hover:bg-gray-700">Create Query</Link>
          <Link href="/allqueries" className="block px-3 py-2 rounded hover:bg-gray-700">All Queries</Link>
          <Link href="/about" className="block px-3 py-2 rounded hover:bg-gray-700">About</Link>
        </div>
      )}
    </nav>
  );
}
