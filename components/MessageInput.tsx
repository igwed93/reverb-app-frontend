'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import { IMessage } from '@/types/messages';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000/api';

type SocketInstance = ReturnType<typeof io>;

interface MessageInputProps {
  selectedChatId: string;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  socket: SocketInstance | null; 
}

// Global flag to manage the typing timeout (Must be outside component scope)
let typingTimeout: NodeJS.Timeout | null = null; 


const MessageInput = ({ selectedChatId, setMessages, socket }: MessageInputProps) => {
    const [inputContent, setInputContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { token, user } = useAuth();
    
    // NEW STATES:
    const [isRecording, setIsRecording] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    // --- Typing Handler ---
    const handleTyping = (content: string) => {
        setInputContent(content);
        if (!socket) return;

        // Emit 'typing' event
        socket.emit('typing', selectedChatId);

        // Clear previous timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set new timeout to send 'stop typing' after 1.5 seconds of no input
        typingTimeout = setTimeout(() => {
            socket.emit('stop typing', selectedChatId);
            typingTimeout = null;
        }, 1500);
    };

    // --- Cleanup Effect ---
    useEffect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [selectedChatId]); 
    
    // --- Document Pin Logic ---
    const handleDocumentClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`Selected file: ${file.name}. Requires file upload API.`);
            e.target.value = ''; // Clear input field after selection
        }
    };
    
    // --- Voice Note Logic ---
    const handleVoiceNoteToggle = () => {
        if (!isRecording) {
            console.log("🎙️ Starting Voice Note Recording...");
            setIsRecording(true);
        } else {
            console.log("🛑 Stopping Voice Note Recording & Sending.");
            setIsRecording(false);
            // TODO: Trigger API send function for voice note
        }
    };


    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let contentToSend = inputContent.trim(); 

        if (!contentToSend || !token || isSending || !socket) return; 

        // CRUCIAL: Clear typing status immediately upon message submission
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
        }
        socket.emit('stop typing', selectedChatId);
        
        try {
            setIsSending(true);
            setInputContent(''); // Clear input state for better UX immediately
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            // 1. POST the message to the backend API for persistence
            const { data } = await axios.post(`${API_BASE_URL}/messages`, {
                chatId: selectedChatId,
                content: contentToSend,
            }, config);

            // 2. Optimistic UI Update (using IMessage type)
            const newMessage: IMessage = {
                ...data,
                senderId: { 
                    _id: user?._id || '',
                    username: user?.username || 'You',
                    avatarUrl: user?.avatarUrl || '',
                } as IMessage['senderId'],
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // 3. SOCKET.IO BROADCAST
            socket.emit('new message', newMessage);

        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Could not send message.'); 
            setInputContent(contentToSend); // Restore content if API failed
        } finally {
            setIsSending(false);
        }
    };

    return (
        <form onSubmit={handleSend} className='flex items-center space-x-3'>
            
            {/* Hidden File Input for the Document Pin */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                style={{ display: 'none' }} 
            />

            {/* Attachment Icon (Document Pin) */}
            <button type='button' onClick={handleDocumentClick} className='p-2 text-soft-grey hover:text-reverb-teal transition'>
                <Paperclip size={20} />
            </button>

            {/* Emoji Icon (Placeholder) */}
            <button type='button' onClick={() => setShowEmojiPicker(!showEmojiPicker)} className='p-2 text-soft-grey hover:text-reverb-teal transition'>
                <Smile size={20} />
            </button>
            {showEmojiPicker && <div className='absolute bottom-full right-20 mb-2 p-3 bg-white border rounded shadow dark:bg-deep-slate'>Emoji Picker Placeholder</div>}


            {/* Text Input */}
            <input
                type='text'
                placeholder={isRecording ? "Recording Voice Note..." : "Type a message..."}
                value={inputContent}
                onChange={(e) => handleTyping(e.target.value)}
                disabled={isSending || isRecording}
                className='flex-grow p-3 border border-gray-300 rounded-full focus:ring-1 focus::ring-acoustic-blue focus:border-acoustic-blue transition text-deep-slate bg-white dark:bg-echo-white dark:border-gray-600 dark:text-white'
            />

            {/* Send / Voice Note Toggle Button */}
            <button
                type={inputContent.trim() ? 'submit' : 'button'} 
                onClick={inputContent.trim() ? undefined : handleVoiceNoteToggle} 
                disabled={isSending} 
                className={`p-3 text-white rounded-full transition disabled:bg-soft-grey disabled:cursor-not-allowed ${
                    isRecording ? 'bg-red-500 animate-pulse' : 'bg-reverb-teal hover:bg-acoustic-blue'
                }`}
            >
                {inputContent.trim() ? (
                    <Send size={20} fill='white'/>
                ) : (
                    <Mic size={20} fill='white'/>
                )}
            </button>
        </form>
    );
};

export default MessageInput;