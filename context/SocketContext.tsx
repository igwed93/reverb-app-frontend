'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

// Define SocketInstance type using ReturnType for maximum compatibility
type SocketInstance = ReturnType<typeof io>;

// --- Constants ---
const SOCKET_ENDPOINT = 'https://reverb-chat-app-backend.onrender.com'; // Matches our Express server URL

// --- Type Definitions
interface SocketContextType {
  socket: SocketInstance | null;
  onlineUsers: string[];
}

// --- Context and Hook Initialization ---
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// --- Socket Provider Component ---
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, isLoggedIn, token } = useAuth();
  const [socket, setSocket] = useState<SocketInstance | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    let newSocket: SocketInstance | null = null;

    // 1. Connection Logic: Only connect if the user is logged in
    if (isLoggedIn && user) {
      newSocket = io(SOCKET_ENDPOINT, {
        transports: ['websocket'],
        auth: { token: token },
      });

      // Event: Connection Success
      newSocket.on('connect', () => {
        console.log('Socket Connected:', newSocket?.id);
        
        // Emit 'setup' event: crucial step for joining user's personal room
        newSocket?.emit('setup', user._id);
      });

      // Event: Receive the updated list of online users
      newSocket.on('get-online-users', (users: string[]) => {
        setOnlineUsers(users);
      });
      
      // Cleanup: Set the socket instance
      setSocket(newSocket);

      return () => {
        newSocket?.disconnect();
        newSocket?.off('get-online-users');
      };
      
    } else if (!isLoggedIn && socket) {
      // If user logs out, disconnect the socket
      socket.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    }
  }, [isLoggedIn, user, token]); // Dependencies track login status

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};