import React from 'react';
import { Mail, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  isLogin: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, isLogin }) => {
  return (
    <div className="min-h-screen flex">
      {/* ========================================================
        1. Left Half: Visual Story (50% Width) - Laptop Design
        ========================================================
      */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-1/2 bg-reverb-teal text-white">
        <div className="text-3xl font-bold">Reverb</div>
        
        <div className="my-auto text-center">
          {/* Placeholder for the custom SVG illustration */}
          <UserPlus size={96} className="text-acoustic-blue opacity-50 mx-auto" />
          <h1 className="text-5xl font-extrabold mt-8 tracking-tight">
            For meaningful chats that "bounce back"
          </h1>
          <p className="mt-4 text-xl text-white/80">
            Connect, Communicate, Create.
          </p>
        </div>
        
        <div className="text-sm text-white/50">
          © {new Date().getFullYear()} Reverb, Inc. All rights reserved.
        </div>
      </div>

      {/* ========================================================
        2. Right Half: Action Area (50% Width) - Adaptive
        ========================================================
      */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-off-white-surface dark:bg-off-white-surface p-8 sm:p-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <h2 className="text-4xl font-bold text-deep-slate dark:text-white mb-2">
            {isLogin ? "Welcome Back." : "Join Reverb."}
          </h2>
          <p className="text-soft-grey mb-8">
            {isLogin ? "Sign in to continue your conversation." : "Create your account in seconds."}
          </p>

          {/* Form Content */}
          {children}

          {/* Social Login / Separator */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-soft-grey text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          
          <div className="flex justify-center space-x-4">
            {/* Google Login - Links to Express Backend */}
            <Link href="https://reverb-chat-app-backend.onrender.com/api/auth/google" 
               className="p-3 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-deep-slate/20 transition"
            >
              {/* Image must be in /public */}
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
            </Link>
            {/* GitHub Login - Links to Express Backend */}
            <Link href="https://reverb-chat-app-backend.onrender.com/api/auth/github" 
               className="p-3 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-deep-slate/20 transition"
            >
              <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
            </Link>
          </div>

          {/* Footer Link: Toggle between Login and Sign-up */}
          <p className="mt-8 text-center text-sm text-deep-slate dark:text-soft-grey">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <Link href="/register" className="text-reverb-teal font-medium hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/login" className="text-reverb-teal font-medium hover:underline">
                  Log in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
