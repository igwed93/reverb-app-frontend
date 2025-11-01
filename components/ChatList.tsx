'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useChat, IChat, IParticipant } from '@/context/ChatContext';
import { Search, Plus, Users } from 'lucide-react';
import ChatListItem from './ChatListItem';
import NewChatModal from './NewChatModal';
import NewGroupModal from './NewGroupModal';

const API_BASE_URL = 'http://localhost:5000/api';

interface ChatListProps {
    setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatList: React.FC<ChatListProps> = ({ setIsMobileOpen }) => {
    const { token, user } = useAuth();
    const { chats, setChats, selectedChat, setSelectedChat } = useChat();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // States for controlling the two modals
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    // 1. Function to fetch the list of chats
    const fetchChats = async () => {
        if (!token) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            
            const { data } = await axios.get(`${API_BASE_URL}/chats`, config);
            setChats(data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch chats:', err);
            setError('Could not load conversations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, [token]);

    // Handle click on a chat item
    const handleChatSelect = (chat: IChat) => {
        setSelectedChat(chat);
        // Close the list/sidebar on mobile after selection
        if (window.innerWidth < 1024) { // 1024px is the 'lg' breakpoint
            setIsMobileOpen(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header: Search and New Chat Buttons */}
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-off-white-surface dark:bg-off-white-surface sticky top-0">
                <h2 className="text-2xl font-bold text-deep-slate dark:text-white mb-3">Chats</h2>
                
                {/* Search Input */}
                <div className="flex-grow relative mb-2">
                    <input
                        type="text"
                        placeholder="Search chats or users..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-deep-slate focus:ring-1 focus:ring-reverb-teal focus:border-reverb-teal dark:bg-echo-white dark:border-gray-600 dark:text-deep-slate"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-soft-grey" />
                </div>

                {/* Buttons for Modals */}
                <div className="flex justify-end space-x-2">
                    {/* Button 1: Open New Group Modal */}
                    <button 
                        onClick={() => setIsGroupModalOpen(true)}
                        className="p-2 bg-acoustic-blue text-white rounded-lg hover:bg-opacity-90 transition"
                        title="New Group Chat"
                    >
                        <Users className="h-6 w-6" />
                    </button>

                    {/* Button 2: Open New 1-on-1 Chat Modal */}
                    <button 
                        onClick={() => setIsChatModalOpen(true)}
                        className="p-2 bg-reverb-teal text-white rounded-lg hover:bg-opacity-90 transition"
                        title="Start Private Chat"
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                </div>
            </header>

            {/* Chat List Body */}
            <div className="flex-grow overflow-y-auto">
                {loading && <p className="p-4 text-soft-grey">Loading chats...</p>}
                {error && <p className="p-4 text-red-500">{error}</p>}
                
                {!loading && chats.length === 0 && (
                    <p className="p-4 text-soft-grey">No conversations yet. Tap the buttons above to start a new chat!</p>
                )}

                {chats.map((chat) => (
                    <ChatListItem
                        key={chat._id}
                        chat={chat}
                        currentUserId={user?._id}
                        isSelected={selectedChat?._id === chat._id}
                        onSelect={handleChatSelect}
                    />
                ))}
            </div>
            
            {/* Render Modals */}
            <NewChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
            <NewGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
        </div>
    );
};

export default ChatList;