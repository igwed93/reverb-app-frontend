'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// --- Type Definitions ---
interface User {
  _id: string;
  username: string;
  email: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// --- Constants ---
const API_URL = 'https://reverb-chat-app-backend.onrender.com/api/auth';
const API_USERS_URL = 'https://reverb-chat-app-backend.onrender.com/api/users';


// --- Context and Hook Initialization ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Auth Provider Component ---
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Utility to fetch full profile data
  const fetchUserProfile = async (token: string): Promise<User> => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_USERS_URL}/profile`, config); 
      return res.data;
  };

  // Load user/token from local storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('reverbToken');
    const storedUserJson = localStorage.getItem('reverbUser');

    if (storedToken) {
        setToken(storedToken);
        
        if (storedUserJson) {
            // If user object is already present, use it
            setUser(JSON.parse(storedUserJson));
            setIsLoading(false);
        } else {
            // Case where social login saved token but not profile (common failure point)
            fetchUserProfile(storedToken)
                .then(userData => {
                    localStorage.setItem('reverbUser', JSON.stringify(userData));
                    setUser(userData);
                    setIsLoading(false);
                })
                .catch(() => {
                    // Token is invalid/expired, clear session
                    localStorage.removeItem('reverbToken');
                    localStorage.removeItem('reverbUser');
                    setToken(null);
                    setUser(null);
                    setIsLoading(false);
                });
        }
    } else {
        setIsLoading(false);
    }
  }, []);

  // --- API Handlers ---

  const handleAuthSuccess = (res: any) => {
    const { token, ...userData } = res.data;
    
    // Store data
    localStorage.setItem('reverbToken', token);
    localStorage.setItem('reverbUser', JSON.stringify(userData));
    
    // Update state
    setToken(token);
    setUser(userData as User);
    
    // Navigate to the main chat app
    router.push('/app'); 
  };
  
  const getConfig = (token: string | null = null) => ({
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
  });

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, { username, email, password }, getConfig());
      handleAuthSuccess(res);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed.';
      alert(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password }, getConfig());
      handleAuthSuccess(res);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      alert(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const storedToken = localStorage.getItem('reverbToken');
    
    // Hit the API to set status to Offline
    if (storedToken) {
        try {
            await axios.post(`${API_USERS_URL}/logout`, {}, getConfig(storedToken));
        } catch (e) {
            console.error("Failed to update status on logout:", e);
        }
    }
    
    // Clear local storage and state
    localStorage.removeItem('reverbToken');
    localStorage.removeItem('reverbUser');
    setToken(null);
    setUser(null);
    router.push('/login'); 
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoggedIn: !!user, 
        login, 
        register, 
        logout, 
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
