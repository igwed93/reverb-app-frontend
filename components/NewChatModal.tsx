'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { IChat, useChat } from '@/context/ChatContext';
import AvatarWithInitials from './AvatarWithInitials';


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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || !token) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users?search=${searchTerm}`, config);
      setSearchResults(data);
    } catch (error) {
      console.error('User search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

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

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chats`, { userId }, config);
      const newChat = data as IChat;

      setChats((prevChats) => {
        if (!prevChats.some((c) => c._id === newChat._id)) return [newChat, ...prevChats];
        return prevChats.map((c) => (c._id === newChat._id ? newChat : c));
      });

      setSelectedChat(newChat);
      onClose();
    } catch (error) {
      console.error('Failed to access/create chat:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-slate/50 dark:bg-deep-slate/70 backdrop-blur-sm">
      <div className="bg-off-white-surface dark:bg-deep-slate rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 border border-gray-200 dark:border-gray-700 transition">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-xl font-bold text-deep-slate dark:text-white">Start Private Chat</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-soft-grey hover:bg-gray-100 dark:hover:bg-echo-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-lg text-deep-slate 
                       focus:ring-1 focus:ring-reverb-teal focus:border-reverb-teal 
                       dark:bg-echo-white/20 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2 bg-acoustic-blue text-white rounded-lg hover:bg-reverb-teal transition disabled:opacity-50"
          >
            <Search size={20} />
          </button>
        </form>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && <p className="text-center text-soft-grey dark:text-gray-400 py-4">Searching...</p>}

          {!loading && searchResults.length === 0 && searchTerm.length > 0 && (
            <p className="text-center text-soft-grey dark:text-gray-400 py-4">
              No users found matching "{searchTerm}".
            </p>
          )}

          {searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 my-2 bg-echo-white/60 dark:bg-echo-white/10 
                         rounded-lg hover:bg-gray-100 dark:hover:bg-echo-white/20 transition"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 dark:bg-echo-white/20 mr-3 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarWithInitials name={user.username} size="10" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-deep-slate dark:text-white">{user.username}</p>
                  <p className="text-xs text-soft-grey dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleAccessChat(user._id)}
                className="py-1 px-3 bg-reverb-teal text-white text-sm rounded-full hover:bg-acoustic-blue transition"
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
