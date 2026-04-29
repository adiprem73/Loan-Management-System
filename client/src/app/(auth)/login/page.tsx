'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

const redirectByRole = (role: UserRole): string => {
  if (role === 'borrower') return '/apply';
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">LMS</h1>
          <p className="text-gray-500 mt-1">Loan Management System</p>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">Welcome back</h2>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          New borrower?{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Create account
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-600 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Admin: admin@lms.com / Admin@123</p>
            <p>Sanction: sanction@lms.com / Sanction@123</p>
            <p>Borrower: borrower@lms.com / Borrower@123</p>
          </div>
        </div>

      </div>
    </div>
  );
}