'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useChat, IChat } from '@/context/ChatContext';
import { Search, Plus, Users, Menu } from 'lucide-react';
import ChatListItem from './ChatListItem';
import NewChatModal from './NewChatModal';
import NewGroupModal from './NewGroupModal';


const API_BASE_URL = 'http://localhost:5000/api';

interface ChatListProps {
    setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
    onOpenUtilitySidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatList: React.FC<ChatListProps> = ({ setIsMobileOpen, setShowProfileModal, onOpenUtilitySidebar }) => {
    const { token, user } = useAuth();
    const { chats, setChats, selectedChat, setSelectedChat } = useChat();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    //const [showUtilitySidebar, setShowUtilitySidebar] = useState(false);

    // Fetch chats
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

    const handleChatSelect = (chat: IChat) => {
        setSelectedChat(chat);
        if (window.innerWidth < 1024) {
            setIsMobileOpen(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-off-white-surface dark:bg-off-white-surface text-deep-slate dark:text-deep-slate transition-colors duration-200">
            
            {/* HEADER */}
            <header className="p-4 border-b border-gray-200 dark:border-gray-800 bg-off-white-surface dark:bg-echo-white sticky top-0 z-10">
                <div className="flex justify-between items-center mb-3">
                    <Menu 
                        className="w-6 h-6 text-deep-slate dark:text-white lg:hidden cursor-pointer"
                        onClick={() => {
                             onOpenUtilitySidebar?.((prev: boolean) => !prev);
                        }} // Open the menu
                    />
                    
                    <h2 className="text-2xl font-bold text-deep-slate dark:text-white flex-grow text-center lg:text-left ml-4">Chats</h2>
                </div>
                
                {/* Search Bar */}
                <div className="relative mb-2">
                    <input
                        type="text"
                        placeholder="Search chats or users..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                   text-deep-slate dark:text-deep-slate bg-white dark:bg-deep-slate/10
                                   focus:ring-1 focus:ring-reverb-teal dark:focus:ring-acoustic-blue focus:border-reverb-teal 
                                   placeholder-soft-grey dark:placeholder-soft-grey/80 transition-colors"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-soft-grey dark:text-soft-grey/80" />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                    <button 
                        onClick={() => setIsGroupModalOpen(true)}
                        className="p-2 bg-acoustic-blue text-white rounded-lg hover:bg-acoustic-blue/90 dark:hover:bg-acoustic-blue/80 transition"
                        title="New Group Chat"
                    >
                        <Users className="h-6 w-6" />
                    </button>

                    <button 
                        onClick={() => setIsChatModalOpen(true)}
                        className="p-2 bg-reverb-teal text-white rounded-lg hover:bg-reverb-teal/90 dark:hover:bg-reverb-teal/80 transition"
                        title="Start Private Chat"
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                </div>
            </header>

            {/* CHAT LIST BODY */}
            <div className="flex-grow overflow-y-auto">
                {loading && (
                    <p className="p-4 text-soft-grey dark:text-soft-grey/80">Loading chats...</p>
                )}
                {error && (
                    <p className="p-4 text-red-500 dark:text-red-400">{error}</p>
                )}
                
                {!loading && chats.length === 0 && (
                    <p className="p-4 text-soft-grey dark:text-soft-grey/80">
                        No conversations yet. Tap the buttons above to start a new chat!
                    </p>
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

            {/* MODALS */}
            <NewChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
            <NewGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
        </div>
    );
};

export default ChatList;
