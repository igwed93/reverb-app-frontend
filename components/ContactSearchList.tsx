'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Menu } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import AvatarWithInitials from './AvatarWithInitials';
import { useIsMobile } from '@/hooks/useIsMobile';

const API_BASE_URL = 'http://localhost:5000/api';
//const { setIsMobileSidebarOpen } = useUI();

interface UserSearchResult {
  _id: string;
  username: string;
  email: string;
  avatarUrl: string;
}

interface ContactSearchListProps {
  onMenuClick?: () => void;
}

const ContactSearchList: React.FC<ContactSearchListProps> = ({ onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const { setChats, setSelectedChat, setIsChatListVisible } = useChat();
  const isMobile = useIsMobile();

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_BASE_URL}/users?search=`, config);
      setAllUsers(data);
    } catch (error) {
      console.error('Failed to fetch all users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleAccessChat = async (userId: string) => {
    if (!token) return;
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(`${API_BASE_URL}/chats`, { userId }, config);
      const newChat = data as any;
      setChats((prevChats) => {
        if (!prevChats.some((c) => c._id === newChat._id)) return [newChat, ...prevChats];
        return prevChats;
      });
      setSelectedChat(newChat);

      // Switch to chat view on mobile after selecting/creating a chat
      if (window.innerWidth < 1024) {
        setIsChatListVisible(false);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const filteredUsers = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-off-white-surface dark:bg-deep-slate">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-off-white-surface dark:bg-echo-white/10 sticky top-0 backdrop-blur-md">
        <div className="flex justify-between items-center mb-3">
          {/* Left: Mobile Menu Icon */}
          {isMobile && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          )}

          {/* Center: App Title */}
          <h2 className="text-xl font-bold text-deep-slate dark:text-white text-center flex-grow">
            All Contacts
          </h2>

          {/* Right: Settings/Profile Icon */}
          <div className="lg:hidden">
            <button
              onClick={() => alert('Open Settings or Profile Modal here')}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-deep-slate/30 transition"
            >
              <Plus size={20} className="text-reverb-teal dark:text-reverb-teal" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Filter contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-deep-slate 
                      focus:ring-1 focus:ring-reverb-teal focus:border-reverb-teal 
                      dark:bg-echo-white/20 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-soft-grey dark:text-gray-400" />
        </div>
      </header>

      {/* Body */}
      <div className="flex-grow overflow-y-auto">
        {loading && <p className="p-4 text-soft-grey dark:text-gray-400">Loading contacts...</p>}

        {!loading &&
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between p-3 my-1 transition cursor-pointer 
                         hover:bg-gray-50 dark:hover:bg-echo-white/10 rounded-lg"
              onClick={() => handleAccessChat(u._id)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 dark:bg-echo-white/20 mr-3 flex items-center justify-center">
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt={u.username} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarWithInitials name={u.username} size="10" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-deep-slate dark:text-white">{u.username}</p>
                  <p className="text-xs text-soft-grey dark:text-gray-400">{u.email}</p>
                </div>
              </div>
              <Plus size={20} className="text-reverb-teal dark:text-reverb-teal" />
            </div>
          ))}

        {!loading && allUsers.length > 0 && filteredUsers.length === 0 && (
          <p className="p-4 text-soft-grey dark:text-gray-400">No contacts found matching filter.</p>
        )}

        {!loading && allUsers.length === 0 && (
          <p className="p-4 text-soft-grey dark:text-gray-400">It seems there are no other users on Reverb yet!</p>
        )}
      </div>
    </div>
  );
};

export default ContactSearchList;