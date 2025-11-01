import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatLayout from '@/components/ChatLayout';
import { ChatProvider } from '@/context/ChatContext';
import { SocketProvider } from '@/context/SocketContext';

/**
 * This is the main protected page where the user interacts with the app.
 */
export default function AppPage() {
  return (
    <ProtectedRoute>
      <ChatProvider>
        <SocketProvider>
          <ChatLayout />
        </SocketProvider>
      </ChatProvider>
    </ProtectedRoute>
  );
}