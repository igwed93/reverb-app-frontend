'use client';

import React, { useRef, useState } from 'react';
import { X, Settings, LogOut, Camera, Home, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import AvatarWithInitials from './AvatarWithInitials';
import UserProfileSidebar from './UserProfileSidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileUtilitySidebarProps {
    onClose: () => void;
    onOpenProfile: () => void;
}

const MobileUtilitySidebar: React.FC<MobileUtilitySidebarProps> = ({ onClose, onOpenProfile }) => {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    // state that handles the rendering of the UserProfileSidebar
    const [showUserProfileSidebar, setShowUserProfileSidebar] = useState(false);
    const profileFileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => profileFileInputRef.current?.click();
    
    const handleLogout = () => {
        logout();
        onClose();
    };

    const handleOpenSettings = () => {
        setShowUserProfileSidebar(true);
    }

    return (
        // Overlay container (Fixed, full screen, dark overlay)
        <div className="fixed inset-0 z-50 flex bg-deep-slate/70 backdrop-blur-sm">
            
            {/* Sidebar Content (Slides in from the left) */}
            <div className="w-64 h-full bg-off-white-surface dark:bg-deep-slate/90 shadow-2xl p-4 flex flex-col text-deep-slate dark:text-white">
                
                {/* Header/Close Button */}
                <div className="flex justify-between items-center border-b pb-4 mb-4 dark:border-gray-700">
                    <div className="text-lg font-bold">Menu</div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-deep-slate/50">
                        <X size={20} />
                    </button>
                </div>

                {/* User Profile Info */}
                <div className="flex items-center space-x-3 border-b pb-4 mb-4 dark:border-gray-700">
                    <div className="w-10 h-10 flex-shrink-0">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover"/>
                        ) : (
                            <AvatarWithInitials name={user?.username || 'You'} size="10" />
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-semibold truncate">{user?.username}</p>
                        <p className="text-xs text-soft-grey truncate">{user?.email}</p>
                    </div>
                </div>

                {/* Main Navigation Links (Home, Messages, Contacts) */}
                <nav className="flex flex-col space-y-2 flex-grow">
                    {[
                        { href: '/app', icon: Home, label: 'Home' },
                        { href: '/app/messages', icon: MessageSquare, label: 'Messages' },
                        { href: '/app/contacts', icon: Users, label: 'Contacts' },
                    ].map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center p-3 rounded-lg transition ${
                                pathname.startsWith(item.href)
                                ? 'bg-reverb-teal text-white'
                                : 'hover:bg-gray-100 dark:hover:bg-deep-slate/20'
                            }`}
                            >
                            <item.icon size={20} className="mr-3" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Bottom Utility Actions */}
                <div className="mt-auto space-y-2 pt-4 border-t dark:border-gray-700">
                    
                    {/* Settings & Profile Management (Opens Sidebar Modal) */}
                    <button onClick={handleOpenSettings} className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-deep-slate/20 w-full text-left">
                        <Settings size={20} className="mr-3 text-soft-grey" />
                        <span>Settings & Profile</span>
                    </button>

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-3">
                        <span>Dark Mode</span>
                        <ThemeToggle />
                    </div>

                    {/* Logout */}
                    <button onClick={handleLogout} className="flex items-center p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 w-full text-left text-red-500">
                        <LogOut size={20} className="mr-3" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* User Profile Sidebar Modal */}
            {showUserProfileSidebar && (
                <div className="fixed inset-0 z-60 bg-black/50">
                    <UserProfileSidebar
                    user={user}
                    onClose={() => setShowUserProfileSidebar(false)}
                    onAvatarChange={handleAvatarClick}
                    />
                </div>
            )}
        </div>
    );
};

export default MobileUtilitySidebar;
