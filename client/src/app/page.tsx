'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, user, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'borrower') router.push('/apply');
      else router.push(`/dashboard/${user.role}`);
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting...</p>
    </div>
  );
}