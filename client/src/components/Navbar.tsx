// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const { isAuthenticated, user, logout, loadFromStorage } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadFromStorage();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="w-full flex items-center justify-between py-4 bg-black/40 backdrop-blur-md border-b border-white/10 max-w-6xl mx-auto px-2">
      {/* Logo */}
      <div className="flex items-center gap-2 text-white font-semibold text-lg">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          ✨
        </div>
        LoanFlow
      </div>

      {/* Links */}
      <div className="hidden md:flex gap-8 text-gray-300 text-sm">
        <Link href="#">Home</Link>
        <Link href="#">Features</Link>
        <Link href="#">How it Works</Link>
        <Link href="/dashboard/sanction">Dashboard</Link>
        <Link href="/my-loans">Borrower</Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {isAuthenticated && user && (
          <span className="text-sm text-gray-400">Hi, {user.name}</span>
        )}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="text-gray-300 hover:text-white text-sm bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg font-medium"
          >
            Login
          </Link>
        )}

        {/* <Link
          href="/apply"
          className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg text-white text-sm font-medium"
        >
          Apply for Loan →
        </Link> */}
      </div>
    </nav>
  );
}
