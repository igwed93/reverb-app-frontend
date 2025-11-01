import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { IMessage } from '@/types/messages';
import { IParticipant } from '@/context/ChatContext';

// Define a darker blue for read status (Custom Hex)
const READ_BLUE = '#1D72C4'; 

interface MessageBubbleProps {
  message: IMessage;
  isOwnMessage: boolean;
  isGroupChat: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, isGroupChat }) => {
  const alignmentClass = isOwnMessage ? 'items-end' : 'items-start';
  const bubbleColor = isOwnMessage 
    ? 'bg-reverb-teal text-white' 
    : 'bg-white dark:bg-deep-slate/30 text-deep-slate dark:text-white border border-gray-200 dark:border-gray-600';
  
  const time = format(new Date(message.createdAt), 'p'); // e.g., 3:45 PM

  const renderStatusIcon = () => {
    if (!isOwnMessage) return null;

    // The read status icon uses a conditional class for color
    const baseClass = `w-3 h-3 ml-1`;

    if (message.status === 'read') {
        // Darker blue color for high visibility read receipt
        return <CheckCheck className={`${baseClass} text-[${READ_BLUE}]`} />; 
    }
    if (message.status === 'delivered') {
      return <CheckCheck className={`${baseClass} text-white/70`} />;
    }
    // Default: sent
    return <Check className={`${baseClass} text-white/70`} />; 
  };

  return (
    <div className={`flex flex-col ${alignmentClass} w-full`}>
      {/* Sender Name in Group Chat (Only for messages that are NOT your own) */}
      {isGroupChat && !isOwnMessage && (
          <div className="text-xs font-semibold mb-1 ml-3 text-soft-grey dark:text-white/70">
              {message.senderId.username}
          </div>
      )}

      <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl ${bubbleColor} shadow-sm`}>
        
        <p className="text-sm break-words">{message.content}</p>
        
        <div className="flex justify-end items-center mt-1 space-x-1">
          {/* Timestamp color adapts to bubble color */}
          <span className={`text-[10px] ${isOwnMessage ? 'text-white/80' : 'text-soft-grey'}`}>
            {time}
          </span>
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;