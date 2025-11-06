'use client';

import React, { useState } from 'react';
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form'; // Assuming RHF is used here too
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schema for validation
const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;


export default function LoginPage() {
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const LoginForm = (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <div>
        <input 
          type="email" 
          placeholder="Email Address" 
          {...register("email")}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reverb-teal focus:border-reverb-teal transition bg-white text-deep-slate"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <input 
          type="password" 
          placeholder="Password" 
          {...register("password")}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reverb-teal focus:border-reverb-teal transition bg-white text-deep-slate"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full p-3 bg-reverb-teal text-white font-semibold rounded-lg hover:bg-opacity-90 transition shadow-md disabled:opacity-50"
      >
        {isLoading ? 'Signing In...' : 'Log In'}
      </button>
    </form>
  );

  return (
    <AuthLayout isLogin={true}>
      {LoginForm}
    </AuthLayout>
  );
}
