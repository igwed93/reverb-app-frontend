'use client';

import React, { useState } from 'react';
import { Search, X, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { IChat, useChat } from '@/context/ChatContext';
import AvatarWithInitials from './AvatarWithInitials';

const API_BASE_URL = 'http://localhost:5000/api';

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserSearchResult {
    _id: string;
    username: string;
    email: string;
    avatarUrl: string;
    status: 'Online' | 'Offline' | 'Busy';
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const { setChats, setSelectedChat } = useChat();

    if (!isOpen) return null;

    // Search Logic: Calls the /api/users?search=... endpoint
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim() || !token) return;

        try { 
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            
            // GET /api/users?search=<searchTerm>
            const { data } = await axios.get(
                `${API_BASE_URL}/users?search=${searchTerm}`,
                config
            );
            setSearchResults(data);
        } catch (error) {
            console.error('User search failed:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Chat Access Logic: Calls the /api/chats endpoint (Access/Create Chat)
    const handleAccessChat = async (userId: string) => {
        if (!token) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            // POST /api/chats (Calls the Access/Create Private Chat endpoint)
            const { data } = await axios.post(
                `${API_BASE_URL}/chats`,
                { userId },
                config
            );

            const newChat = data as IChat;

            // Update global chat list (if it's a new chat, add it to the top)
            setChats((prevChats) => {
                if(!prevChats.some((c) => c._id === newChat._id)) {
                    return [newChat, ...prevChats];
                }

                return prevChats.map(c => (c._id === newChat._id ? newChat : c));
            });

            // Select the new/existing chat and close the modal
            setSelectedChat(newChat);
            onClose();

        } catch (error) {
            console.error('Failed to access/create chat:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-deep-slate/50 backdrop-blur-sm dark:bg-deep-slate/70'>
            <div className='bg-off-white-surface dark:bg-off-white-surface rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 dark:border dark:border-gray-700'>
                
                {/* Modal Header */}
                <div className='flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700'>
                    <h2 className='text-xl font-bold text-deep-slate dark:text-white'>Start Private Chat</h2>
                    <button onClick={onClose} className='p-1 rounded-full text-soft-grey hover:bg-gray-100 dark:hover:bg-deep-slate/30'>
                        <X size={20} />
                    </button>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className='flex space-x-2 mb-4'>
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='flex-grow p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-reverb-teal text-deep-slate dark:bg-echo-white dark:text-white'
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className='p-2 bg-acoustic-blue text-white rounded-lg hover:bg-reverb-teal transition disabled:opacity-50'
                    >
                        <Search size={20} />
                    </button>
                </form>

                {/* Search Results */}
                <div className='max-h-80 overflow-y-auto'>
                    { loading && <p className='text-center text-soft-grey py-4'>Searching...</p>}

                    {!loading && searchResults.length === 0 && searchTerm.length > 0 && (
                        <p className='text-center text-soft-grey py-4'>No users found matching "{searchTerm}".</p>
                    )}

                    {searchResults.map((user) => (
                        <div
                          key={user._id}
                          className='flex items-center justify-between p-3 my-2 bg-echo-white dark:bg-deep-slate/10 rounded-lg hover:bg-gray-100 dark:hover:bg-deep-slate/30 transition'
                        >
                            <div className='flex items-center'>
                                <div className='w-10 h-10 rounded-full overflow-hidden bg-gray-300 mr-3 flex items-center justify-center'>
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.username} className='w-full h-full object-cover' />
                                    ) : (
                                        <AvatarWithInitials name={user.username} size="10" />
                                    )}
                                </div>
                                <div>
                                    <p className='font-medium text-deep-slate dark:text-white'>{user.username}</p>
                                    <p className='text-xs text-soft-grey'>{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleAccessChat(user._id)}
                                className='py-1 px-3 bg-reverb-teal text-white text-sm rounded-full hover:bg-acoustic-blue transition'
                            >
                                Chat
                            </button>  
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;