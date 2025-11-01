'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IUser } from './AuthContext';

// --- Type Definitions ---
export interface IParticipant extends Omit<IUser, 'password'> {}

export interface ILastMessage {
  _id: string;
  senderId: IParticipant;
  content: string;
  createdAt: string;
}

export interface IChat {
  _id: string;
  isGroup: boolean;
  name?: string;
  participants: IParticipant[];
  lastMessage: ILastMessage | null;
  // This allows it to receive either the Mongoose object or the JS Map
  unreadCounts: Map<string, number> | Record<string, number>; 
  createdAt: string;
  updatedAt: string;
}

interface ChatContextType {
  chats: IChat[];
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>;
  selectedChat: IChat | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<IChat | null>>;
  isChatListVisible: boolean;
  setIsChatListVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

// --- Context and Hook Initialization ---
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// --- Chat Provider Component ---
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  // Default is true to show the list on initial load (desktop/tablet-first)
  const [isChatListVisible, setIsChatListVisible] = useState(true); 

  return (
    <ChatContext.Provider 
      value={{ 
        chats, 
        setChats, 
        selectedChat, 
        setSelectedChat,
        isChatListVisible,
        setIsChatListVisible,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};