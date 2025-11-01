// frontend/components/UserProfileSidebar.tsx

'use client';

import React from 'react';
import { X, User, Camera, LogOut, Edit2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AvatarWithInitials from './AvatarWithInitials'; // Assuming this component is created

interface UserProfileSidebarProps {
    user: any; // Using 'any' as the User interface is complex, but the data shape is known
    onClose: () => void;
    onAvatarChange: () => void; // Function passed from ChatLayout to open the hidden file input
}

const UserProfileSidebar: React.FC<UserProfileSidebarProps> = ({ user, onClose, onAvatarChange }) => {
    const { logout } = useAuth();
    
    return (
        // Fixed position sidebar that slides in from the right
        <div className="fixed right-0 top-0 h-full w-96 bg-off-white-surface dark:bg-off-white-surface shadow-2xl z-40 border-l border-gray-200 dark:border-gray-700">
            
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-reverb-teal/10 dark:bg-deep-slate/20">
                <h3 className="text-lg font-bold text-deep-slate dark:text-white">Your Profile</h3>
                <button onClick={onClose} className="text-soft-grey hover:text-deep-slate dark:text-white/80">
                    <X size={20} />
                </button>
            </div>

            {/* Profile Picture Section */}
            <div className="p-6 text-center border-b border-gray-100 dark:border-gray-700">
                <div className="relative w-24 h-24 mx-auto mb-4">
                    
                    {/* Current Avatar Display */}
                    {user?.avatarUrl ? (
                        <img 
                            src={user.avatarUrl} 
                            alt={user.username} 
                            className="w-full h-full rounded-full object-cover" 
                        />
                    ) : (
                        <AvatarWithInitials name={user?.username || 'You'} size="24" />
                    )}
                    
                    {/* Change Avatar Button Trigger */}
                    <button 
                        onClick={onAvatarChange} // <-- Triggers the file input in ChatLayout
                        className="absolute bottom-0 right-0 p-2 bg-reverb-teal text-white rounded-full border-2 border-white dark:border-deep-slate hover:bg-acoustic-blue"
                        title="Change Avatar"
                    >
                        <Camera size={14} />
                    </button>
                </div>
                <p className="text-xl font-semibold text-deep-slate dark:text-white">{user?.username}</p>
                <p className="text-sm text-soft-grey">{user?.email}</p>
            </div>

            {/* Account Management Actions */}
            <div className="p-6 space-y-4">
                
                {/* Placeholder: Edit Profile Details */}
                <div className="flex items-center text-deep-slate dark:text-white">
                    <Edit2 size={20} className="mr-3 text-soft-grey" />
                    <p className="flex-grow">Edit Profile Details</p>
                    <span className="text-reverb-teal cursor-pointer hover:underline text-sm">Edit</span>
                </div>
                
                <div className="h-px bg-gray-100 dark:bg-gray-700"></div>

                {/* Logout Button */}
                <button 
                    onClick={logout} 
                    className="flex items-center text-red-500 hover:text-red-600 w-full p-2 rounded transition cursor-pointer"
                >
                    <LogOut size={20} className="mr-3" />
                    Sign Out
                </button>
            </div>
            
            {/* Future Content Area (Shared Media, Documents) - Placeholder */}
            <div className="p-6 text-soft-grey">
                 <p className="text-sm font-semibold mb-2">Account Status</p>
                 <p className="text-xs">Your account is active and protected by our secure JWT system.</p>
            </div>

        </div>
    );
};

export default UserProfileSidebar;