'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useChat, IChat, IParticipant } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageBubble from './MessageBubble';
import { IMessage } from '@/types/messages';
import SharedMediaSidebar from './SharedMediaSidebar';
import { MessageSquare } from 'lucide-react';


// Define SocketInstance type locally for safety
type SocketInstance = ReturnType<typeof import('socket.io-client').default>;


const ChatWindow: React.FC = () => {
    const { token, user } = useAuth();
    const { selectedChat, setChats } = useChat();
    const { socket } = useSocket();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showInfoSidebar, setShowInfoSidebar] = useState(false); // Sidebar state
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Data Fetching & Read Receipt Trigger ---
    const fetchMessages = async (chat: IChat) => {
        if (!token || !chat?._id || !user) return;

        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // 1. Fetch messages
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/messages/${chat._id}`, config);
            setMessages(data);

            // 2. Mark messages as read
            const updateReadConfig = {
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
            };
            await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/messages/read`, { chatId: chat._id }, updateReadConfig);
            
            // 3. Manually update the ChatList context to clear the unread count (UI only)
            setChats(prevChats => 
                prevChats.map(c => 
                    c._id === chat._id 
                        ? { 
                            ...c, 
                            unreadCounts: new Map(Object.entries(c.unreadCounts as Record<string, number>)).set(user._id, 0) 
                        } 
                        : c
                )
            );

        } catch (err) {
            console.error('Failed to fetch messages or mark read:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat);
        }
    }, [selectedChat, token]); 

    // --- Scroll to Bottom ---
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // --- Real-Time Listeners (Message, Typing, Read Status) ---
    useEffect(() => {
        if (!socket || !selectedChat || !user) return;

        // Join the specific chat room for typing indicators
        socket.emit('join chat', selectedChat._id);
        
        // Listener for incoming messages
        const messageListener = (newMessageReceived: IMessage) => {
            // Only update state if the message is for the currently open chat
            if (newMessageReceived.chatId === selectedChat._id) {
                setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
            }
        };

        // NEW LISTENER: Handle messages being marked as read by the receiver
        const readListener = (receivedChatId: string) => {
            if (receivedChatId === selectedChat._id) {
                // Update ALL messages sent by the current user in this chat to 'read'
                setMessages(prevMessages => 
                    prevMessages.map(msg => 
                        msg.senderId._id === user._id 
                            ? { ...msg, status: 'read' } 
                            : msg
                    )
                );
            }
        };

        // Typing Indicator Listeners
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));

        socket.on('message received', messageListener);
        socket.on('messages read', readListener); 
        
        return () => {
            socket.off('message received', messageListener);
            socket.off('messages read', readListener);
            socket.off('typing');
            socket.off('stop typing');
        };
    }, [socket, selectedChat, setMessages, user, setChats]); 


    if (!selectedChat) {
        return null;
    }
    
    // Determine if the currently selected chat is a group chat
    const isGroup = selectedChat.isGroup;

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            
            {/* 1. Header (Dynamic) - Pass setter for sidebar control */}
            <ChatHeader 
                chat={selectedChat} 
                currentUserId={user?._id} 
                isTyping={isTyping} 
                onInfoClick={() => setShowInfoSidebar(!showInfoSidebar)} 
            />

            {/* 2. Message Area (Scrollable) */}
            <div className={`flex-grow overflow-y-auto p-4 space-y-3 bg-echo-white dark:bg-echo-white transition-all duration-300 
                ${showInfoSidebar ? 'mr-80' : ''}`}
            >
                {loading && <p className="text-center text-soft-grey">Loading chat history...</p>}

                {!loading && messages.map((message) => (
                    <MessageBubble
                        key={message._id}
                        message={message}
                        isOwnMessage={message.senderId._id === user?._id}
                        isGroupChat={isGroup} 
                    />
                ))}

                {/* Typing Indicator in the message area */}
                {isTyping && (
                    <div className="text-sm text-soft-grey italic ml-1 mb-2">
                        {selectedChat.isGroup ? 'A member is typing...' : 'is typing...'}
                    </div>
                )}

                {/* Scroll Anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* 3. Input Area (Responsive Bottom Bar) */}
            <div
            className={`mt-auto bg-off-white-surface dark:bg-off-white-surface
                        border-t border-gray-200 dark:border-gray-700
                        p-3 sm:p-4 transition-all duration-300
                        ${showInfoSidebar ? 'mr-80' : ''}`}
            >
            <MessageInput
                selectedChatId={selectedChat._id}
                setMessages={setMessages as React.Dispatch<React.SetStateAction<IMessage[]>>}
                socket={socket}
            />
            </div>
            
            {/* 4. Info/Shared Media Sidebar */}
            {showInfoSidebar && (
                // Assuming SharedMediaSidebar is built to handle the state we passed from ChatWindow
                <SharedMediaSidebar 
                    chat={selectedChat}
                    onClose={() => setShowInfoSidebar(false)} 
                />
            )}
        </div>
    );
};

export default ChatWindow;
