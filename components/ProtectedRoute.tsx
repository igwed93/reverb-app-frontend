'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the initial loading (checking localStorage) is complete
    if (!isLoading) {
      // If the user is NOT logged in, redirect them to the login page
      if (!isLoggedIn) {
        router.push('/login');
      }
    }
  }, [isLoggedIn, isLoading, router]);

  // While loading or redirecting, show a simple spinner/message
  if (isLoading || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-echo-white dark:bg-deep-slate text-deep-slate dark:text-white">
        <p>Loading Reverb...</p>
      </div>
    );
  }

  // If logged in, render the child components (the main chat layout)
  return <>{children}</>;
};

export default ProtectedRoute;