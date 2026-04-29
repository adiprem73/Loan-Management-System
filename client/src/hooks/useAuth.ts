import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';

export const useAuth = (allowedRoles?: UserRole[]) => {
  const { user, isAuthenticated, loadFromStorage } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to their correct page
      if (user.role === 'borrower') router.push('/apply');
      else router.push(`/dashboard/${user.role}`);
    }
  }, [isAuthenticated, user]);

  return { user, isAuthenticated };
};