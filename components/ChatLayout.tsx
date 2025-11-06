'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Settings, LogOut, MessageSquare, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ContactSearchList from './ContactSearchList';
import { useSocket } from '@/context/SocketContext';
import { useChat } from '@/context/ChatContext';
import ThemeToggle from './ThemeToggle';
import AvatarWithInitials from './AvatarWithInitials';
import UserProfileSidebar from './UserProfileSidebar';
import MobileUtilitySidebar from './MobileUtilitySidebar';
import axios from 'axios';
import SidebarNav from './SidebarNav';

const ChatLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const { setChats, selectedChat, isChatListVisible, setIsChatListVisible, chats } = useChat();
    const currentPath = usePathname();
    const { socket } = useSocket();

    const [showProfileModal, setShowProfileModal] = useState(false);
    const profileFileInputRef = useRef<HTMLInputElement>(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // new states
    //const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    //const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

    const listVisibilityClass = `
        ${isChatListVisible ? 'block' : 'hidden'}
        md:block
        md:w-[30%]
        lg:w-[35%]
        h-full
        md:relative
        absolute inset-y-0 left-0 z-50 w-full
        bg-echo-white dark:bg-deep-slate
    `;

    const windowVisibilityClass = `
        ${(!isChatListVisible && selectedChat) ? 'block' : 'hidden'}
        md:block
        md:flex-1
        h-full
    `;

    useEffect(() => {
        if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (!socket || !user) return;

        const globalMessageReceiver = (newMessageReceived: any) => {
            if (selectedChat?._id === newMessageReceived.chatId) return;

            if (selectedChat?._id !== newMessageReceived.chatId && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                const incomingChat = chats.find(c => c._id === newMessageReceived.chatId);
                const title = incomingChat?.name || 'New Reverb Message';
                new Notification(title, { body: newMessageReceived.content, icon: '/reverb-logo-small.png' });
            }

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

    //--- Reset visibility when navigating to main tabs ---
    useEffect(() => {
        // Check if the current path is the base (e.g., /app, /app/messages, or /app/contacts)
        // If we are on one of the main list views, the list should be visible by default.
        if (currentPath === '/app' || currentPath.startsWith('/app/messages') || currentPath.startsWith('/app/contacts')) {
            setIsChatListVisible(true);
        }
    }, [currentPath, setIsChatListVisible]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        alert(`Uploading ${file.name}. Placeholder for file storage.`);
        const mockNewAvatarUrl = 'https://picsum.photos/60/60?' + Date.now();

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('reverbToken')}`,
                    'Content-Type': 'application/json',
                }
            };
            await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/avatar`, { avatarUrl: mockNewAvatarUrl }, config);
            alert("Avatar updated! Restart app to see changes.");
        } catch (error) {
            console.error("Avatar upload failed:", error);
            alert("Failed to update avatar. Check console.");
        }
    };

    const handleAvatarClick = () => profileFileInputRef.current?.click();

    const renderMiddleColumnContent = () => {
        if (currentPath.startsWith('/app/contacts')) {
            return <ContactSearchList onMenuClick={() => setIsSidebarOpen(true)} />;
        }
        return <ChatList
            setIsMobileOpen={setIsChatListVisible}
            setShowProfileModal={setShowProfileModal}
            onOpenUtilitySidebar={() => setIsSidebarOpen(true)}
        />;
    };

    return (
        <div className="flex h-screen overflow-hidden bg-echo-white dark:bg-deep-slate text-deep-slate dark:text-echo-white">

            {/* LEFT SIDEBAR */}
            <aside className="hidden lg:flex flex-col w-[15%] min-w-[150px] max-w-[200px] 
                bg-deep-slate dark:bg-off-white-surface 
                text-white dark:text-deep-slate 
                p-4 border-r border-gray-200 dark:border-gray-700">
                
                <div className="flex-grow flex flex-col items-center space-y-8 mt-4">
                    {/* Branding */}
                    <div className="flex items-center space-x-2 p-2 mb-6">
                        <img src="/reverb-logo-small.png" alt="Reverb Logo" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-bold text-echo-white dark:text-deep-slate">Reverb</span>
                    </div>

                    <SidebarNav />
                </div>

                {/* Utilities */}
                <div className="mt-auto flex flex-col items-center space-y-4">
                    <Settings 
                        onClick={() => setShowProfileModal(true)}
                        className="w-6 h-6 p-1 stroke-deep-slate dark:stroke-deep-slate rounded hover:bg-white/10 dark:hover:bg-deep-slate/10 transition cursor-pointer"
                        style={{ stroke: 'currentColor' }}
                    />

                    <ThemeToggle />

                    <button onClick={logout} className="p-1 rounded hover:bg-white/10 dark:hover:bg-deep-slate/10 transition">
                        <LogOut className="w-6 h-6 text-soft-grey" />
                    </button>

                    <input 
                        type="file" 
                        ref={profileFileInputRef} 
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }} 
                    />

                    {/* Avatar */}
                    <div 
                        onClick={() => setShowProfileModal(true)} 
                        className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 border-2 border-reverb-teal relative cursor-pointer"
                    >
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

            {/* CHAT LIST SECTION */}
            <section className={`${listVisibilityClass} border-r border-gray-200 dark:border-gray-700`}>
                {renderMiddleColumnContent()}
            </section>

            {/* CHAT WINDOW */}
            <main className={`flex-grow ${windowVisibilityClass} bg-echo-white dark:bg-deep-slate`}>
                {selectedChat ? (
                    <ChatWindow />
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center text-soft-grey">
                            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-reverb-teal" />
                            <p className="text-xl text-deep-slate dark:text-echo-white">Welcome to Reverb.</p>
                            <p className="text-lg text-deep-slate dark:text-soft-grey">Select a conversation to start chatting.</p>
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

            {/* MOBILE UTILITY SIDEBAR */}
            {isSidebarOpen && (
            <div className="fixed inset-0 z-[9999] bg-black/50">
                <MobileUtilitySidebar
                onOpenProfile={() => {
                    setShowProfileModal(true);   // opens your profile sidebar
                    setIsSidebarOpen(false);     // closes the mobile menu immediately
                }}
                onClose={() => setIsSidebarOpen(false)}
                />
            </div>
            )}

        </div>
    );
};

export default ChatLayout;
