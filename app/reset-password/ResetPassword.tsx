'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // Get required query parameters
    const email = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';

    // Ensure parameters are present before proceeding
    useEffect(() => {
        if (!email || !token) {
            router.replace('/forgot-password');
        }
    }, [email, token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('');

        if (password.length < 6) return setStatus('Password must be at least 6 characters.');
        if (password !== confirmPassword) return setStatus('Passwords do not match.');

        setLoading(true);

        try {
            // POST to backend to set new password
            const API_URL = `${BASE_URL}/api/auth`;
            const res = await axios.post(`${API_URL}/reset-password`, { email, token, newPassword: password });
            
            setStatus('Password successfully reset! Please log in.');
            // On success, redirect to login page
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error: any) {
            setStatus(error.response?.data?.message || 'Error resetting password. Token may be expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-echo-white dark:bg-deep-slate p-4">
            <div className="w-full max-w-md bg-off-white-surface dark:bg-off-white-surface p-8 rounded-xl shadow-lg">
                
                <h2 className="text-2xl font-bold text-deep-slate dark:text-white mb-2 flex items-center"><Lock size={24} className="mr-2" /> Reset Password</h2>
                <p className="text-soft-grey mb-6">Enter your new secure password.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reverb-teal transition bg-white text-deep-slate"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reverb-teal transition bg-white text-deep-slate"
                        />
                    </div>
                    
                    {status && <p className={`text-sm ${status.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{status}</p>}

                    <button
                        type="submit"
                        disabled={loading || password.length < 6 || password !== confirmPassword}
                        className="w-full p-3 bg-reverb-teal text-white font-semibold rounded-lg hover:bg-opacity-90 transition shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}