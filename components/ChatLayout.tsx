'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Home, Users, Settings, LogOut, MessageSquare, User, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { useSocket } from '@/context/SocketContext';
import { useChat } from '@/context/ChatContext';
import ThemeToggle from './ThemeToggle';
import AvatarWithInitials from './AvatarWithInitials'; // Assuming this component is created
import UserProfileSidebar from './UserProfileSidebar'; // Assuming this component is created
import axios from 'axios';

const ChatLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const { setChats, selectedChat, isChatListVisible, setIsChatListVisible, chats } = useChat();
    const { socket } = useSocket();

    const [showProfileModal, setShowProfileModal] = useState(false); 
    const profileFileInputRef = useRef<HTMLInputElement>(null);

    // ChatList visibility
    const listVisibilityClass = `
    ${isChatListVisible ? 'block' : 'hidden'}
    md:block
    md:w-[30%]
    lg:w-[35%]
    h-full
    md:relative
    absolute inset-y-0 left-0 z-20 w-full bg-white
    `;

    // ChatWindow visibility
    const windowVisibilityClass = `
    ${(!isChatListVisible && selectedChat) ? 'block' : 'hidden'}
    md:block
    md:flex-1
    h-full
    `;


    // --- Global Message Receiver for Chat List Updates ---
    useEffect(() => {
        if (!socket || !user) return;

        const globalMessageReceiver = (newMessageReceived: any) => {
            // Request Notification Permission (Issue 7 fix)
            if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
                 Notification.requestPermission();
            }
            
            // Notification Logic (Issue 7 fix)
            if (selectedChat?._id !== newMessageReceived.chatId && Notification.permission === 'granted') {
                 // Logic to determine chat name and send notification...
                 const incomingChat = chats.find(c => c._id === newMessageReceived.chatId);
                 const title = incomingChat?.name || 'New Reverb Message';
                 new Notification(title, { body: newMessageReceived.content, icon: '/reverb-logo-small.png' });
            }
            
            // If the message is for the currently selected chat, skip.
            if (selectedChat?._id === newMessageReceived.chatId) {
                return; 
            }

            // Logic for messages arriving for inactive chats (Unread Count Sync)
            setChats(prevChats => {
                return prevChats.map(chat => {
                    if (chat._id === newMessageReceived.chatId) {
                        const currentCount = (chat.unreadCounts as Record<string, number>)[user._id] || 0;

                        const newUnreadCounts = new Map(Object.entries(chat.unreadCounts as Record<string, number>));
                        newUnreadCounts.set(user._id, currentCount + 1);

                        return {
                            ...chat,
                            lastMessage: newMessageReceived,
                            unreadCounts: newUnreadCounts
                        };
                    }
                    return chat;
                });
            });
        };

        socket.on('message received', globalMessageReceiver);
        
        return () => {
            socket.off('message received', globalMessageReceiver);
        };
    }, [socket, selectedChat, setChats, user, chats]); 

    // REQUEST NOTIFICATION PERMISSION
    useEffect(() => {
        if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []); 

    // File Upload Handler (for Avatar Update)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // --- PHASE 1: Upload (Placeholder) ---
        alert(`Uploading ${file.name}. This is a placeholder for file storage (S3/Cloudinary).`);
        const mockNewAvatarUrl = 'https://picsum.photos/60/60?' + Date.now(); // Mock URL

        // --- PHASE 2: Update Database and Context ---
        try {
            const config = { 
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('reverbToken')}`, 
                    'Content-Type': 'application/json',
                } 
            };
            
            await axios.put(`http://localhost:5000/api/users/avatar`, { avatarUrl: mockNewAvatarUrl }, config);
            alert("Avatar updated! Restart app to see changes."); 

        } catch (error) {
            console.error("Avatar upload failed:", error);
            alert("Failed to update avatar. Check console.");
        }
    };

    const handleAvatarClick = () => { profileFileInputRef.current?.click(); };


    return (
        <div className='flex h-screen overflow-hidden bg-echo-white dark:bg-echo-white text-deep-slate dark:text-deep-slate'>
            
            {/* Left Column: Navigation - Remains hidden on mobile */}
            <aside className='hidden lg:flex flex-col w-[10%] min-w-[80px] max-w-[120px] bg-deep-slate dark:bg-off-white-surface text-white dark:text-deep-slate p-4'>
                <div className='flex-grow flex flex-col items-center space-y-8 mt-4'>
                    <div className="w-10 h-10">
                        {/* Final Logo */}
                        <img src="/reverb-logo-small.png" alt="Reverb Logo" className="w-full h-full object-contain rounded" />
                    </div>

                    <nav className='flex flex-col space-y-8'>
                        <Home className="w-6 h-6 p-1 rounded hover:bg-white/10 dark:hover:bg-deep-slate/10 transition cursor-pointer text-acoustic-blue" />
                        <MessageSquare className="w-6 h-6 p-1 rounded hover:bg-white/10 dark:hover:bg-deep-slate/10 transition cursor-pointer bg-acoustic-blue text-white" />
                        <Users className="w-6 h-6 p-1 rounded hover:bg-white/10 dark:hover:bg-deep-slate/10 transition cursor-pointer" />
                    </nav>
                </div>

                <div className='flex flex-col items-center space-y-4'>
                    <ThemeToggle />
                    <Settings 
                        onClick={() => setShowProfileModal(true)} 
                        className="w-6 h-6 p-1 rounded hover:bg-white/10 dark:hover:bg-deep-slate/10 transition cursor-pointer" 
                    />

                    <button onClick={logout} className='p-1 rounded hover:bg-white/10 dark:hover:bg-deep-slate/10 transition'>
                        <LogOut className='w-6 h-6 text-soft-grey' />
                    </button>
                    
                    {/* Hidden File Input for Avatar Upload */}
                    <input 
                        type="file" 
                        ref={profileFileInputRef} 
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }} 
                    />

                    {/* AVATAR AREA: Button to open the profile sidebar */}
                    <div 
                        onClick={() => setShowProfileModal(true)} 
                        className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 border-2 border-reverb-teal relative cursor-pointer"
                    >
                        {/* Avatar content */}
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover"/>
                        ) : (
                            <AvatarWithInitials name={user?.username || 'You'} size="8" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                            <Camera size={14} className="text-white/90" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Middle Column: Conversations List (The mobile overlay) */}
            <section className={`${listVisibilityClass} border-r border-gray-200 dark:border-gray-700 bg-off-white-surface dark:bg-off-white-surface`}>
                <ChatList setIsMobileOpen={setIsChatListVisible} />
            </section>


            {/* Right Column: Chat Window (Adaptive visibility) */}
            <main className={`flex-grow bg-echo-white dark:bg-echo-white ${windowVisibilityClass}`}>
                {selectedChat ? (
                    <ChatWindow />
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center text-soft-grey">
                            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-reverb-teal" />
                             <p className='text-xl text-deep-slate'>Welcome to Reverb.</p>
                            <p className="text-lg text-deep-slate">Select a conversation to start chatting.</p>
                        </div>
                    </div>
                )}
            </main>
            
            {/* USER PROFILE SIDEBAR */}
            {showProfileModal && (
                <UserProfileSidebar 
                    user={user}
                    onClose={() => setShowProfileModal(false)}
                    onAvatarChange={handleAvatarClick} 
                />
            )}
        </div>
    );
};


export default ChatLayout;