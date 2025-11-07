'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// used a standalone fetch and rely on AuthProvider's useEffect to pick up the token.

const fetchUserProfile = async (token: string) => {
    const config = { 
        headers: { 
            Authorization: `Bearer ${token}` 
        },
        withCredentials: true 
    };
    const API_URL = `${BASE_URL}/api/users/profile`;
    const res = await axios.get(API_URL, config);
    return res.data;
};

export default function SocialAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
        // 1. Save Token immediately
        localStorage.setItem('reverbToken', token);
        
        // 2. Fetch the full user profile using the new token
        fetchUserProfile(token)
            .then(userData => {
                // 3. Save the complete user object needed by AuthContext
                localStorage.setItem('reverbUser', JSON.stringify(userData));
                
                // 4. Redirect to the main app
                router.push('/app'); 
            })
            .catch(error => {
                console.error("Failed to fetch profile after social login:", error);
                // Clear the token since the session failed the profile check
                localStorage.removeItem('reverbToken'); 
                router.push('/login?error=profile_fetch_failed');
            });

    } else {
      // Failed login or missing token
      router.push('/login?error=social_auth_failed');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-echo-white text-reverb-teal">
      <p>Completing social login. Please wait...</p>
    </div>
  );
}
