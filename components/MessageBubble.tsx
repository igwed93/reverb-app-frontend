import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { IMessage } from '@/types/messages';
import { IParticipant } from '@/context/ChatContext';

// Define custom read color
const READ_BLUE = '#1D72C4';

interface MessageBubbleProps {
  message: IMessage;
  isOwnMessage: boolean;
  isGroupChat: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, isGroupChat }) => {
  const alignmentClass = isOwnMessage ? 'items-end' : 'items-start';

  // ✅ Bubble color logic using your CSS variables
  const bubbleColor = isOwnMessage
    ? 'bg-[var(--color-reverb-teal)] text-white'
    : 'bg-[var(--color-off-white-surface)] dark:bg-[var(--color-deep-slate)] text-[var(--color-deep-slate)] dark:text-[var(--color-echo-white)] border border-[color:var(--color-soft-grey)]/20';

  const time = format(new Date(message.createdAt), 'p'); // e.g., 3:45 PM

  const renderStatusIcon = () => {
    if (!isOwnMessage) return null;

    const baseClass = 'w-3 h-3 ml-1';

    if (message.status === 'read') {
      return <CheckCheck className={`${baseClass}`} style={{ color: READ_BLUE }} />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck className={`${baseClass} text-white/70`} />;
    }
    return <Check className={`${baseClass} text-white/70`} />;
  };

  return (
    <div className={`flex flex-col ${alignmentClass} w-full`}>
      {/* Show sender name for other participants in group chats */}
      {isGroupChat && !isOwnMessage && (
        <div className="text-xs font-semibold mb-1 ml-3 text-[var(--color-soft-grey)] dark:text-[var(--color-soft-grey)]/90">
          {message.senderId.username}
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-md md:max-w-md lg:max-w-lg p-3 rounded-xl ${bubbleColor} shadow-sm`}>
        <p className="text-sm break-words break-all">{message.content}</p>

        <div className="flex justify-end items-center mt-1 space-x-1">
          <span
            className={`text-[10px] ${
              isOwnMessage
                ? 'text-white/80'
                : 'text-[var(--color-soft-grey)] dark:text-[var(--color-soft-grey)]/80'
            }`}
          >
            {time}
          </span>
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
