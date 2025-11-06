import { IParticipant } from '@/context/ChatContext'; 

export interface IMessage {
    _id: string;
    chatId: string; // The property that was causing the flag
    senderId: IParticipant;
    content: string;
    createdAt: string;
    status: 'sent' | 'delivered' | 'read';
}
