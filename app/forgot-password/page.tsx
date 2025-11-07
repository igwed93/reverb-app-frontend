'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('');
        setLoading(true);

        try {
            const API_URL = `${BASE_URL}/api/auth`;
            const res = await axios.post(`${API_URL}/forgot-password`, { email });
            setStatus(res.data.message || 'If user exists, reset code was sent.');
            
            // Redirect to the OTP verification page
            router.push('/reset-password?email=' + email);
        } catch (error: any) {
            setStatus('Error processing request.');
            console.error('Frontend Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-echo-white dark:bg-deep-slate p-4">
            <div className="w-full max-w-md bg-off-white-surface dark:bg-off-white-surface p-8 rounded-xl shadow-lg">
                <Link href="/login" className="flex items-center text-soft-grey hover:text-deep-slate dark:text-soft-grey mb-4">
                    <ArrowLeft size={18} className="mr-2" /> Back to Login
                </Link>

                <h2 className="text-2xl font-bold text-deep-slate dark:text-white mb-2">Password Reset</h2>
                <p className="text-soft-grey mb-6">Enter your email to receive a six-digit verification code.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reverb-teal transition bg-white text-deep-slate"
                        />
                    </div>
                    
                    {status && <p className={`text-sm ${status.includes('sent') || status.includes('exists') ? 'text-green-600' : 'text-red-500'}`}>{status}</p>}

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full p-3 bg-reverb-teal text-white font-semibold rounded-lg hover:bg-opacity-90 transition shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Sending Code...' : 'Send Reset Code'}
                    </button>
                </form>
            </div>
        </div>
    );
}