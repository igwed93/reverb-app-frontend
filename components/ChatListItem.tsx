'use client';

import React from 'react';
import { IChat, IParticipant } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import AvatarWithInitials from './AvatarWithInitials';

interface ChatListItemProps {
    chat: IChat;
    currentUserId: string | undefined;
    isSelected: boolean;
    onSelect: (chat: IChat) => void;
}

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

    const otherParticipant = chat.participants.find(p => p._id !== currentUserId) as IParticipant;
    const chatName = chat.isGroup ? chat.name : otherParticipant?.username || 'Unknown User';
    const chatAvatar = chat.isGroup ? '/group_avatar.png' : otherParticipant?.avatarUrl;

    const isOnline = onlineUsers.includes(otherParticipant?._id || '');
    const unreadCount = getUnreadCount(chat, currentUserId.toString());
    const lastMsgTime = chat.lastMessage?.createdAt
        ? formatDistanceToNow(parseISO(chat.lastMessage.createdAt), { addSuffix: true })
        : '';
    const lastMessageContent = chat.lastMessage?.content || 'Start a conversation';

    return (
        <div
            onClick={() => onSelect(chat)}
            className={`flex items-center p-4 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors duration-150 
                ${
                    isSelected
                        ? 'bg-reverb-teal/10 dark:bg-acoustic-blue/10 border-l-4 border-l-reverb-teal dark:border-l-acoustic-blue'
                        : 'hover:bg-gray-700 dark:hover:bg-deep-slate/50'
                }`}
        >
            {/* Avatar */}
            <div className="relative mr-3 flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-deep-slate/30 flex items-center justify-center">
                    {chatAvatar ? (
                        <img
                            src={chatAvatar}
                            alt={chatName}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <AvatarWithInitials name={chatName} size="12" />
                    )}
                </div>

                {/* Online Dot */}
                {isOnline && (
                    <div className="absolute bottom-[-1px] right-[-1px] w-3.5 h-3.5 bg-reverb-teal dark:bg-acoustic-blue rounded-full border-2 border-off-white-surface dark:border-off-white-surface"></div>
                )}
            </div>

            {/* Chat Info */}
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-deep-slate dark:text-deep-slate truncate mr-1">
                        {chatName}
                    </h3>
                    <span className="text-xs text-soft-grey dark:text-soft-grey/80 flex-shrink-0">
                        {lastMsgTime}
                    </span>
                </div>

                <div className="flex justify-between items-center mt-0.5">
                    <p
                        className="text-sm text-soft-grey dark:text-soft-grey/90 truncate"
                        style={{ maxWidth: '85%' }}
                    >
                        {lastMessageContent}
                    </p>
                    {unreadCount > 0 && (
                        <span className="flex-shrink-0 ml-2 text-xs font-bold text-white bg-acoustic-blue dark:bg-reverb-teal w-5 h-5 flex items-center justify-center rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;
