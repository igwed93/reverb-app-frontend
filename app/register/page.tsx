'use client';

import React, { useState } from 'react';
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schema for validation
const registerSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters long"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type RegisterFormData = z.infer<typeof registerSchema>;


export default function RegisterPage() {
  const [error, setError] = useState('');
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.username, data.email, data.password);
    } catch (error: any) {
      console.error("❌ Registration error:", error.message);
      setError(error.message || 'Registration failed.');
    }
  };

  return (
    <AuthLayout isLogin={false}>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Username */}
        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-acoustic-blue focus:border-acoustic-blue transition bg-white text-deep-slate"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email Address"
            {...register("email")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-acoustic-blue focus:border-acoustic-blue transition bg-white text-deep-slate"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-acoustic-blue focus:border-acoustic-blue transition bg-white text-deep-slate"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 bg-acoustic-blue text-white font-semibold rounded-lg hover:bg-opacity-90 transition shadow-md disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
}