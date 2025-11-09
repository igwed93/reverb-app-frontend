'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme as EmojiTheme } from 'emoji-picker-react';
import { useTheme } from "next-themes";
import { IMessage } from '@/types/messages';
import io from 'socket.io-client';

type SocketInstance = ReturnType<typeof io>;
type Theme = "light" | "dark" | "auto";

interface MessageInputProps {
  selectedChatId: string;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  socket: SocketInstance | null; 
}

let typingTimeout: NodeJS.Timeout | null = null; 

const MessageInput = ({ selectedChatId, setMessages, socket }: MessageInputProps) => {
  const [inputContent, setInputContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { token, user } = useAuth();
  const { theme } = useTheme();

  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputContent((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const handleTyping = (content: string) => {
    setInputContent(content);
    if (!socket) return;

    socket.emit('typing', selectedChatId);

    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit('stop typing', selectedChatId);
      typingTimeout = null;
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [selectedChatId]);

  const handleDocumentClick = () => fileInputRef.current?.click();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Selected file: ${file.name}. Requires file upload API.`);
      e.target.value = '';
    }
  };

  const handleVoiceNoteToggle = () => {
    setIsRecording((prev) => !prev);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    let contentToSend = inputContent.trim();
    if (!contentToSend || !token || isSending || !socket) return;

    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
    socket.emit('stop typing', selectedChatId);

    try {
      setIsSending(true);
      setInputContent('');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/messages`, {
        chatId: selectedChatId,
        content: contentToSend,
      }, config);

      const newMessage: IMessage = {
        ...data,
        senderId: {
          _id: user?._id || '',
          username: user?.username || 'You',
          avatarUrl: user?.avatarUrl || '',
        } as IMessage['senderId'],
      };

      setMessages((prev) => [...prev, newMessage]);
      socket.emit('new message', newMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Could not send message.');
      setInputContent(contentToSend);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="
        flex items-center gap-2 sm:gap-3 w-full
        px-3 sm:px-5 py-2 sm:py-3
        bg-off-white-surface dark:bg-deep-slate
      "
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Document Pin */}
      <button
        type="button"
        onClick={handleDocumentClick}
        className="p-2 flex-shrink-0 text-soft-grey hover:text-reverb-teal transition"
      >
        <Paperclip size={22} />
      </button>

      {/* Emoji Picker */}
      <div className="relative flex-shrink-0" ref={emojiPickerRef}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 transition ${
            showEmojiPicker
              ? 'text-reverb-teal'
              : 'text-soft-grey hover:text-reverb-teal dark:text-soft-grey dark:hover:text-reverb-teal'
          }`}
          title="Open Emoji Picker"
        >
          <Smile size={22} />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 mb-2 z-50 shadow-xl rounded-lg overflow-hidden">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={theme === 'dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT}
              width="280px"
              height="380px"
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>

      {/* Text Input */}
      <input
        type="text"
        placeholder={isRecording ? 'Recording Voice Note...' : 'Type a message...'}
        value={inputContent}
        onChange={(e) => handleTyping(e.target.value)}
        disabled={isSending || isRecording}
        className="
          flex-grow p-3 sm:p-3.5 
          border border-gray-300 dark:border-gray-600
          rounded-full focus:ring-1 focus:ring-reverb-teal focus:border-reverb-teal
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-soft-grey dark:placeholder-gray-400
          text-sm sm:text-base
        "
      />

      {/* Send / Voice Button */}
      <button
        type={inputContent.trim() ? 'submit' : 'button'}
        onClick={inputContent.trim() ? undefined : handleVoiceNoteToggle}
        disabled={isSending}
        className={`
          p-3 flex-shrink-0 rounded-full transition
          ${isRecording
            ? 'bg-red-500 animate-pulse'
            : 'bg-reverb-teal hover:bg-acoustic-blue'}
          text-white disabled:bg-soft-grey disabled:cursor-not-allowed
        `}
      >
        {inputContent.trim() ? <Send size={20} fill="white" /> : <Mic size={20} fill="white" />}
      </button>
    </form>
  );
};


export default MessageInput;
