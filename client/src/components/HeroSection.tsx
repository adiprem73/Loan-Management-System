// components/Hero.tsx
'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-8 py-8">

      {/* LEFT */}
      <div className="max-w-xl">

        <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-purple-300">
          Loan Management, Simplified
        </span>

        <h1 className="text-6xl font-bold mt-6 leading-tight">
          <span className="text-white">Smart Loans.</span><br />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Faster Decisions.
          </span>
        </h1>

        <p className="text-gray-400 mt-6">
          Apply, track, and manage your loans seamlessly. A modern lending stack with role-based dashboards and real-time tracking.
        </p>

        {/* CTA */}
        <div className="flex gap-4 mt-8">
          <Link
            href="/apply"
            className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-lg text-white"
          >
            Get Started →
          </Link>

          <Link
            href="/dashboard/sanction"
            className="border border-white/20 px-6 py-3 rounded-lg text-gray-300"
          >
            View Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-10 text-sm text-gray-400">
          <div>
            <p className="text-white font-semibold">₹ 4.2B+</p>
            <p>Disbursed</p>
          </div>
          <div>
            <p className="text-white font-semibold">120K+</p>
            <p>Borrowers</p>
          </div>
          <div>
            <p className="text-white font-semibold">&lt;2 min</p>
            <p>Approval</p>
          </div>
        </div>

      </div>

      {/* RIGHT (mock dashboard card) */}
      <div className="mt-12 md:mt-0 bg-white/5 border border-white/10 p-6 rounded-2xl w-full max-w-md">

        <div className="flex justify-between mb-4">
          <p className="text-gray-300 text-sm">Dashboard</p>
          <p className="text-green-400 text-xs">+18%</p>
        </div>

        <div className="bg-black/50 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Approved</p>
          <p className="text-white text-xl font-semibold">872</p>
        </div>

        <div className="bg-black/50 p-4 rounded-lg mt-3">
          <p className="text-gray-400 text-sm">Disbursed</p>
          <p className="text-white text-xl font-semibold">₹ 64.2M</p>
        </div>

      </div>

    </section>
  );
}