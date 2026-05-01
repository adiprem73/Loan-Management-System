// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

import Navbar from '@/components/Navbar';
import Hero from '@/components/HeroSection';
import Image from 'next/image';
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/50 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/60 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-pulse delay-1000"></div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6">
        <Hero />
      </div>
    </div>
  );
}