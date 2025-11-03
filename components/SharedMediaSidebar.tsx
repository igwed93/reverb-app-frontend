import React, { useState } from 'react';
import { IChat } from '@/context/ChatContext';
import { X, Image, FileText, Users } from 'lucide-react';
import AvatarWithInitials from './AvatarWithInitials';

interface SharedMediaSidebarProps {
    chat: IChat | null;
    onClose: () => void;
}

const SharedMediaSidebar: React.FC<SharedMediaSidebarProps> = ({ chat, onClose }) => {
    const [activeTab, setActiveTab] = useState<'media' | 'docs' | 'participants'>('media');

    if (!chat) return null;

    const chatName = (chat as IChat).name || "Private Chat";

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-off-white-surface dark:bg-off-white-surface shadow-2xl z-40 border-l border-gray-200 dark:border-gray-800 transition-colors">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-reverb-teal/10 dark:bg-acoustic-blue/10 transition-colors">
                <h3 className="text-lg font-bold text-deep-slate dark:text-deep-slate">Chat Details</h3>
                <button
                    onClick={onClose}
                    className="text-soft-grey hover:text-deep-slate dark:text-soft-grey dark:hover:text-deep-slate transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Profile Section */}
            <div className="p-4 text-center border-b border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-200 dark:bg-deep-slate/30 mb-2 flex items-center justify-center">
                    <AvatarWithInitials name={chatName} size="16" />
                </div>
                <p className="font-semibold text-deep-slate dark:text-deep-slate">{chatName}</p>
                <p className="text-sm text-soft-grey dark:text-soft-grey/80">View Profile</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-around p-2 border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('media')}
                    className={`flex items-center text-sm font-medium p-2 transition duration-150 ${
                        activeTab === 'media'
                            ? 'text-reverb-teal border-b-2 border-reverb-teal dark:text-acoustic-blue dark:border-acoustic-blue'
                            : 'text-soft-grey dark:text-soft-grey hover:text-deep-slate dark:hover:text-deep-slate'
                    }`}
                >
                    <Image size={16} className="mr-1" /> Media
                </button>
                <button
                    onClick={() => setActiveTab('docs')}
                    className={`flex items-center text-sm font-medium p-2 transition duration-150 ${
                        activeTab === 'docs'
                            ? 'text-reverb-teal border-b-2 border-reverb-teal dark:text-acoustic-blue dark:border-acoustic-blue'
                            : 'text-soft-grey dark:text-soft-grey hover:text-deep-slate dark:hover:text-deep-slate'
                    }`}
                >
                    <FileText size={16} className="mr-1" /> Documents
                </button>
                <button
                    onClick={() => setActiveTab('participants')}
                    className={`flex items-center text-sm font-medium p-2 transition duration-150 ${
                        activeTab === 'participants'
                            ? 'text-reverb-teal border-b-2 border-reverb-teal dark:text-acoustic-blue dark:border-acoustic-blue'
                            : 'text-soft-grey dark:text-soft-grey hover:text-deep-slate dark:hover:text-deep-slate'
                    }`}
                >
                    <Users size={16} className="mr-1" /> Participants
                </button>
            </div>

            {/* Content */}
            <div className="p-4 text-soft-grey dark:text-soft-grey/90">
                {activeTab === 'media' && <p>Shared Photos & Videos List (Future Integration)...</p>}
                {activeTab === 'docs' && <p>Shared Documents List (Future Integration)...</p>}
                {activeTab === 'participants' && <p>Participant list for the group (Future Integration)...</p>}
            </div>
        </div>
    );
};

export default SharedMediaSidebar;
