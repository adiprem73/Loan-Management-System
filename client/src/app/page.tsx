// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

import Navbar from '@/components/Navbar';
import Hero from '@/components/HeroSection';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'borrower') router.push('/my-loans');
      else router.push(`/dashboard/${user.role}`);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6">
        <Hero />
      </div>
    </div>
  );
}