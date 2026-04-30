// components/Navbar.tsx
'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-md border-b border-white/10">

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
        <Link href="/login" className="text-gray-300 text-sm">
          Login
        </Link>

        <Link
          href="/apply"
          className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg text-white text-sm font-medium"
        >
          Apply for Loan →
        </Link>
      </div>
    </nav>
  );
}