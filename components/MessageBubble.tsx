import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { IMessage } from '@/types/messages';

const READ_BLUE = '#1D72C4';

interface MessageBubbleProps {
  message: IMessage;
  isOwnMessage: boolean;
  isGroupChat: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, isGroupChat }) => {
  const alignmentClass = isOwnMessage ? 'items-end' : 'items-start';

  // ✅ Bubble colors
  const bubbleColor = isOwnMessage
    ? 'bg-[var(--color-reverb-teal)] text-white'
    : 'bg-[var(--color-off-white-surface)] dark:bg-[var(--color-deep-slate)] text-[var(--color-deep-slate)] dark:text-[var(--color-echo-white)] border border-[color:var(--color-soft-grey)]/20';

  // ✅ Bubble shape styles
  const bubbleShape = isOwnMessage
    ? 'rounded-2xl rounded-br-sm' // sent messages (your own)
    : 'rounded-2xl rounded-bl-sm'; // received messages (others)

  const time = format(new Date(message.createdAt), 'p');

  const renderStatusIcon = () => {
    if (!isOwnMessage) return null;
    const baseClass = 'w-3 h-3 ml-1';
    if (message.status === 'read') {
      return <CheckCheck className={baseClass} style={{ color: READ_BLUE }} />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck className={`${baseClass} text-white/70`} />;
    }
    return <Check className={`${baseClass} text-white/70`} />;
  };

  return (
    <div className={`flex flex-col ${alignmentClass} w-full px-2 sm:px-4`}>
      {/* Sender name for group chats */}
      {isGroupChat && !isOwnMessage && (
        <div className="text-xs font-semibold mb-1 ml-3 text-[var(--color-soft-grey)] dark:text-[var(--color-soft-grey)]/90">
          {message.senderId.username}
        </div>
      )}

      <div
        className={`
          ${bubbleColor} ${bubbleShape}
          p-3 shadow-sm
          max-w-[80%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%]
          ${isOwnMessage ? 'mr-2 sm:mr-4' : 'ml-2 sm:ml-4'}
        `}
      >
        <p className="text-sm break-words">{message.content}</p>

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