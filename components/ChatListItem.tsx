'use client';

import React from 'react';
import { IChat, IParticipant } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { User } from 'lucide-react';
import AvatarWithInitials from './AvatarWithInitials'; // Assuming this component is created

interface ChatListItemProps {
    chat: IChat;
    currentUserId: string | undefined;
    isSelected: boolean;
    onSelect: (chat: IChat) => void;
}

// Utility function to safely get the unread count (fixes the runtime error)
const getUnreadCount = (chat: IChat, currentUserId: string): number => {
    const counts = chat.unreadCounts as Record<string, number> | Map<string, number>;
    if (counts instanceof Map) {
        return counts.get(currentUserId) || 0;
    }
    return (counts as Record<string, number>)[currentUserId] || 0;
};


const ChatListItem: React.FC<ChatListItemProps> = ({ chat, currentUserId, isSelected, onSelect }) => {
    if (!currentUserId) return null;
    
    const { onlineUsers } = useSocket();

    // Logic to determine chat name, avatar, and online status for 1-on-1 chats
    const otherParticipant = chat.participants.find(p => p._id !== currentUserId) as IParticipant;

    const chatName = chat.isGroup ? chat.name : otherParticipant?.username || 'Unknown User';
    const chatAvatar = chat.isGroup ? '/group_avatar.png' : otherParticipant?.avatarUrl; // Avatar URL or undefined
    
    // Check the real-time list first for online status
    const isOnline = onlineUsers.includes(otherParticipant?._id || '');
    
    const unreadCount = getUnreadCount(chat, currentUserId.toString());
    
    // Format the last message time
    const lastMsgTime = chat.lastMessage?.createdAt 
        ? formatDistanceToNow(parseISO(chat.lastMessage.createdAt), { addSuffix: true })
        : '';

    // Get the last message content
    const lastMessageContent = chat.lastMessage?.content || 'Start a conversation';

    return (
        <div
            onClick={() => onSelect(chat)}
            className={`flex items-center p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition 
                ${isSelected ? 'bg-echo-white dark:bg-deep-slate/50 border-l-4 border-l-reverb-teal' : 'hover:bg-gray-50 dark:hover:bg-deep-slate/10'}`}
        >
            
            {/* Avatar with Online Indicator */}
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
                        <AvatarWithInitials name={chatName} size="12" /> 
                    )}
                </div>
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-reverb-teal rounded-full border-2 border-white dark:border-deep-slate"></div>
                )}
            </div>

            {/* Chat Info */}
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-deep-slate dark:text-white truncate mr-1">{chatName}</h3>
                    <span className="text-xs text-soft-grey flex-shrink-0">{lastMsgTime}</span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                    <p className="text-sm text-soft-grey truncate" style={{ maxWidth: '85%' }}>
                        {lastMessageContent}
                    </p>
                    {unreadCount > 0 && (
                        <span className="flex-shrink-0 ml-2 text-xs font-bold text-white bg-acoustic-blue w-5 h-5 flex items-center justify-center rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;