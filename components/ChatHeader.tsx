'use client';

import { IChat, IParticipant, useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { Phone, Video, Info, ArrowLeft } from 'lucide-react';
import AvatarWithInitials from './AvatarWithInitials';

// Helper function placeholder for complex modals
const openModal = (title: string, content: string) => {
    alert(`${title}: ${content}`);
}

interface ChatHeaderProps {
    chat: IChat;
    currentUserId: string | undefined;
    isTyping: boolean;
    onInfoClick: () => void; // Function to open the info sidebar
}


const ChatHeader = ({ chat, currentUserId, isTyping, onInfoClick }: ChatHeaderProps) => {
    if (!currentUserId) return null;

    const { setIsChatListVisible } = useChat();
    const { onlineUsers } = useSocket(); // Access real-time online list

    // Determine the primary contact for 1-on-1 chats
    const otherParticipant = chat.participants.find(p => p._id !== currentUserId) as IParticipant;

    const chatName = chat.isGroup ? chat.name : otherParticipant?.username || 'User';
    const chatAvatar = chat.isGroup ? '/group_avatar.png' : otherParticipant?.avatarUrl; 
    
    // FIX: Check the real-time list for online status
    const isOnlineRealTime = onlineUsers.includes(otherParticipant?._id || ''); 

    // Determine which status to display (prioritizing typing, then real-time status)
    const statusText = chat.isGroup
        ? `${chat.participants.length} members`
        : isOnlineRealTime
            ? 'Online' // Use real-time status
            : otherParticipant?.status || 'Offline'; // Fallback to stale status

    const displayStatus = isTyping
        ? (chat.isGroup ? 'typing...' : 'typing...')
        : statusText; 
    
    const statusColor = isTyping || isOnlineRealTime ? 'text-reverb-teal' : 'text-soft-grey';

    // --- Action Handlers (using placeholder alerts) ---
    const handleCall = (type: 'Voice' | 'Video') => {
        openModal(`${type} Call Feature`, `Initiating ${type} call with ${chatName}. Requires WebRTC signaling.`)
    };

    return (
        <header className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-off-white-surface dark:bg-off-white-surface sticky top-0'>

            {/* Left Side: Back Button (Mobile) & Info */}
            <div className='flex items-center'>
                {/* Mobile Back button */}
                <button
                    className='lg:hidden p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-deep-slate/30 text-deep-slate dark:text-white/90'
                    onClick={() => setIsChatListVisible(true)} // Toggle the list visibility
                >
                    <ArrowLeft size={20} />
                </button>

                {/* Avatar and Name with online indicator*/}
                <div className="relative mr-3 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                        {chatAvatar ? ( // If avatar URL exists
                            <img 
                                src={chatAvatar} 
                                alt={chatName} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            // If no avatar URL, use Initials Component
                            <AvatarWithInitials name={chatName ?? 'User'} size="12" />
                        )}
                    </div>
                    {isOnlineRealTime && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-reverb-teal rounded-full border-2 border-white dark:border-deep-slate"></div>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-deep-slate dark:text-white">{chatName}</h3>
                    <p className={`text-xs ${statusColor} italic`}>{displayStatus}</p>
                </div>
            </div>

            {/* Right Side: Action Icons */}
            <div className="flex space-x-2 text-soft-grey dark:text-soft-grey">
                {/* Voice Calling Logic */}
                <button onClick={() => handleCall('Voice')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-deep-slate/30 transition">
                    <Phone size={20} />
                </button>
                {/* Video Calling Logic */}
                <button onClick={() => handleCall('Video')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-deep-slate/30 transition">
                    <Video size={20} />
                </button>
                {/* Info Logic - Triggers the sidebar via the prop */}
                <button onClick={onInfoClick} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-deep-slate/30 transition">
                    <Info size={20} />
                </button>
            </div>
        </header>
    );
};

export default ChatHeader;