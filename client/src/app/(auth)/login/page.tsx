'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import Navbar from '@/components/Navbar';

// const redirectByRole = (role: UserRole): string => {
//   if (role === 'borrower') return '/apply';
//   return `/dashboard/${role}`;
// };

const redirectByRole = (role: UserRole): string => {
  if (role === "borrower") return "/my-loans"; // ✅ changed
  return `/dashboard/${role}`;
};

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', form);
      const { token, user } = res.data;
      setAuth(user, token);
      router.push(redirectByRole(user.role));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="min-h-[90vh] bg-black flex items-center justify-center p-2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617]">
    <div className="w-full max-w-md p-8 rounded-2xl 
  bg-white/10 backdrop-blur-xl border border-white/20 
  shadow-[0_8px_32px_rgba(0,0,0,0.37)] text-white">

  {/* Header */}
  <div className="text-center mb-8">
    <h1 className="text-3xl font-bold tracking-wide">LMS</h1>
    <p className="text-gray-300 mt-1 text-sm">Loan Management System</p>
    <h2 className="text-xl font-semibold mt-4">Welcome back 👋</h2>
  </div>

  {/* Error */}
  {error && (
    <div className="bg-red-500/10 border border-red-400/30 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm backdrop-blur-md">
      {error}
    </div>
  )}

  {/* Form */}
  <form onSubmit={handleSubmit} className="space-y-5">

    <div>
      <label className="block text-sm text-gray-300 mb-1">
        Email
      </label>
      <input
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full bg-white/10 border border-white/20 text-white 
        placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-400 
        backdrop-blur-md"
        placeholder="you@example.com"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-1">
        Password
      </label>
      <input
        type="password"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full bg-white/10 border border-white/20 text-white 
        placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-400 
        backdrop-blur-md"
        placeholder="••••••••"
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-500/80 hover:bg-blue-600 
      disabled:bg-blue-400 text-white font-medium py-2.5 
      rounded-lg transition-all duration-200 text-sm 
      backdrop-blur-md shadow-md hover:shadow-lg"
    >
      {loading ? 'Signing in...' : 'Sign In'}
    </button>

  </form>

  {/* Register link */}
  <p className="text-center text-sm text-gray-300 mt-6">
    New borrower?{' '}
    <Link href="/register" className="text-blue-400 hover:underline font-medium">
      Create account
    </Link>
  </p>

  {/* Demo credentials */}
  <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
    <p className="text-xs font-medium text-gray-300 mb-2">Demo Credentials:</p>
    <div className="space-y-1 text-xs text-gray-400">
      <p>Admin: admin@lms.com / Admin@123</p>
      <p>Sanction: sanction@lms.com / Sanction@123</p>
      <p>Borrower: borrower@lms.com / Borrower@123</p>
    </div>
  </div>

</div>
    </div>
    </div>
  );
}