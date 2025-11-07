'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function VerifyOtpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [otp, setOtp] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // Get email from query parameter
    const email = searchParams.get('email') || '';

    // If no email is present, redirect to forgot password page
    useEffect(() => {
        if (!email) {
            router.replace('/forgot-password');
        }
    }, [email, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) return setStatus('Please enter the 6-digit code.');
        
        setStatus('');
        setLoading(true);

        try {
            // POST to backend to verify OTP
            const API_URL = `${BASE_URL}/api/auth`;
            const res = await axios.post(`${API_URL}/verify-otp`, { email, otp });
            
            // On success, redirect to the final password reset form
            router.push(`/reset-password?email=${email}&token=${otp}`);

        } catch (error: any) {
            setStatus(error.response?.data?.message || 'Invalid or expired code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-echo-white dark:bg-deep-slate p-4">
            <div className="w-full max-w-md bg-off-white-surface dark:bg-off-white-surface p-8 rounded-xl shadow-lg">
                
                <p className="text-soft-grey mb-2 flex items-center">
                    <ArrowLeft size={16} className="mr-2" /> 
                    <Link href="/forgot-password" className="hover:underline">Back</Link>
                </p>

                <h2 className="text-2xl font-bold text-deep-slate dark:text-white mb-2">Verify Code</h2>
                <p className="text-soft-grey mb-6">Enter the code sent to **{email}**.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="6-Digit Code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={6}
                            className="w-full p-3 text-center text-xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-reverb-teal transition bg-white text-deep-slate"
                        />
                    </div>
                    
                    {status && <p className={`text-sm ${status.includes('Invalid') ? 'text-red-500' : 'text-green-600'}`}>{status}</p>}

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full p-3 bg-reverb-teal text-white font-semibold rounded-lg hover:bg-opacity-90 transition shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>
            </div>
        </div>
    );
}