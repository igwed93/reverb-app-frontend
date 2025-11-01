import React, { useState } from 'react';
import { IChat } from '@/context/ChatContext';
import { X, Image, FileText, Users } from 'lucide-react';

interface SharedMediaSidebarProps {
    chat: IChat | null;
    onClose: () => void;
}

const SharedMediaSidebar: React.FC<SharedMediaSidebarProps> = ({ chat, onClose }) => {
    
    const [activeTab, setActiveTab] = useState<'media' | 'docs' | 'participants'>('media');

    if (!chat) return null;

    // Access the chat name safely (handling the Record<string, number> type)
    const chatName = (chat as IChat).name || "Private Chat";

    return (
        // Fixed position sidebar that slides in from the right (Desktop only for now)
        <div className="fixed right-0 top-0 h-full w-80 bg-off-white-surface dark:bg-off-white-surface shadow-2xl z-40 border-l border-gray-200 dark:border-gray-700">
            
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-reverb-teal/10 dark:bg-deep-slate/20">
                <h3 className="text-lg font-bold text-deep-slate dark:text-white">Chat Details</h3>
                <button onClick={onClose} className="text-soft-grey hover:text-deep-slate dark:text-white/80">
                    <X size={20} />
                </button>
            </div>

            {/* General Info / Profile Section */}
            <div className="p-4 text-center border-b border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-300 mb-2">
                    {/* Display avatar/group icon placeholder */}
                </div>
                <p className="font-semibold text-deep-slate dark:text-white">{chatName}</p>
                <p className="text-sm text-soft-grey">View Profile</p>
            </div>

            {/* Tabs for Shared Content */}
            <div className="flex justify-around p-2 border-b border-gray-100 dark:border-gray-700">
                <button onClick={() => setActiveTab('media')} className={`flex items-center text-sm font-medium p-2 transition duration-150 ${activeTab === 'media' ? 'text-reverb-teal border-b-2 border-reverb-teal' : 'text-soft-grey hover:text-deep-slate'}`}>
                    <Image size={16} className="mr-1" /> Media
                </button>
                <button onClick={() => setActiveTab('docs')} className={`flex items-center text-sm font-medium p-2 transition duration-150 ${activeTab === 'docs' ? 'text-reverb-teal border-b-2 border-reverb-teal' : 'text-soft-grey hover:text-deep-slate'}`}>
                    <FileText size={16} className="mr-1" /> Documents
                </button>
                <button onClick={() => setActiveTab('participants')} className={`flex items-center text-sm font-medium p-2 transition duration-150 ${activeTab === 'participants' ? 'text-reverb-teal border-b-2 border-reverb-teal' : 'text-soft-grey hover:text-deep-slate'}`}>
                    <Users size={16} className="mr-1" /> Participants
                </button>
            </div>

            {/* Content Area (Placeholder) */}
            <div className="p-4 text-soft-grey">
                {activeTab === 'media' && <p>Shared Photos & Videos List (Future Integration)...</p>}
                {activeTab === 'docs' && <p>Shared Documents List (Future Integration)...</p>}
                {activeTab === 'participants' && <p>Participant list for the group (Future Integration)...</p>}
            </div>

        </div>
    );
};

export default SharedMediaSidebar;