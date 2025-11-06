'use client';

import React, { useState } from 'react';
import { Search, X, UserCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { IChat, useChat } from '@/context/ChatContext';
import AvatarWithInitials from './AvatarWithInitials';


interface NewGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserSearchResult {
    _id: string;
    username: string;
    email: string;
    avatarUrl: string;
}

const NewGroupModal: React.FC<NewGroupModalProps> = ({ isOpen, onClose }) => {
    const { user, token } = useAuth();
    const { setChats, setSelectedChat } = useChat();

    // Group-specific states
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]); 
    
    // Search states
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    // --- Search Logic ---
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim() || !token) return;

        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // GET /api/users?search=<searchTerm>
            const { data } = await axios.get(
                `${process.env.API_BASE_URL}/api/users?search=${searchTerm}`,
                config
            );
            // Filter out already selected users and the current user
            setSearchResults(data.filter((u: UserSearchResult) => 
                !selectedUsers.some(su => su._id === u._id) && u._id !== user?._id
            ));
        } catch (error) {
            console.error('User search failed:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };
    
    // --- Member Selection Logic ---
    const handleToggleUser = (user: UserSearchResult) => {
        if (selectedUsers.some(u => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
        // Clear search to encourage a new search or selection from the list
        setSearchResults([]);
        setSearchTerm('');
    };

    // --- Final Group Creation Logic ---
    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedUsers.length < 1) {
            return alert('Group must have a name and at least one other member!');
        }
        if (!token || !user) return;

        try {
            setLoading(true);
            
            // Collect IDs of external users
            const userIds = selectedUsers.map(u => u._id);
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            // POST /api/chats/group (Calls the dedicated group endpoint)
            const { data } = await axios.post(
                `${process.env.API_BASE_URL}/api/chats/group`,
                { name: groupName.trim(), users: userIds },
                config
            );

            const newGroupChat = data as IChat;

            // Update global chat list
            setChats((prevChats) => [newGroupChat, ...prevChats]);
            setSelectedChat(newGroupChat);
            
            // Close the modal and reset state
            onClose();
            setGroupName('');
            setSelectedUsers([]);

        } catch (error) {
            console.error('Failed to create group chat:', error);
            alert('Failed to create group. Try again.');
        } finally {
            setLoading(false);
        }
    };


    // --- RENDERING ---
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-deep-slate/50 backdrop-blur-sm dark:bg-deep-slate/70'>
            <div className='bg-off-white-surface dark:bg-off-white-surface rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 dark:border dark:border-gray-700'>
                
                {/* Modal Header */}
                <div className='flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700'>
                    <h2 className='text-xl font-bold text-deep-slate dark:text-white'>Create New Group ({selectedUsers.length + 1} members)</h2>
                    <button onClick={onClose} className='p-1 rounded-full text-soft-grey hover:bg-gray-100 dark:hover:bg-deep-slate/30'>
                        <X size={20} />
                    </button>
                </div>

                {/* 1. Group Name Input */}
                <div className='mb-4'>
                    <input
                        type="text"
                        placeholder="Choose a group name (e.g., Reverb Team)"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className='w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-reverb-teal text-deep-slate dark:bg-echo-white dark:text-white'
                        required
                    />
                </div>

                {/* 2. Selected Users Tags */}
                {selectedUsers.length > 0 && (
                    <div className='flex flex-wrap gap-2 mb-4 p-2 border-b border-gray-200 dark:border-gray-700'>
                        <span className='text-xs font-semibold px-2 py-1 bg-reverb-teal text-white rounded-full'>
                            {user?.username} (Owner)
                        </span>
                        {selectedUsers.map(u => (
                            <span 
                                key={u._id}
                                className='text-xs px-2 py-1 bg-acoustic-blue text-white rounded-full cursor-pointer flex items-center'
                                onClick={() => handleToggleUser(u)}
                            >
                                {u.username} <X size={12} className='ml-1' />
                            </span>
                        ))}
                    </div>
                )}
                
                {/* 3. Search Form */}
                <form onSubmit={handleSearch} className='flex space-x-2 mb-4'>
                    <input
                        type="text"
                        placeholder="Search users to add..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='flex-grow p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-reverb-teal text-deep-slate dark:bg-echo-white dark:text-white'
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading || !searchTerm.trim()}
                        className='p-2 bg-acoustic-blue text-white rounded-lg hover:bg-reverb-teal transition disabled:opacity-50'
                    >
                        <Search size={20} />
                    </button>
                </form>

                {/* 4. Search Results */}
                <div className='max-h-52 overflow-y-auto'>
                    { loading && <p className='text-center text-soft-grey py-4'>Searching...</p>}

                    {searchResults.map((u) => (
                        <div
                          key={u._id}
                          className='flex items-center justify-between p-3 my-2 bg-echo-white dark:bg-deep-slate/10 rounded-lg hover:bg-gray-100 dark:hover:bg-deep-slate/30 transition'
                        >
                            <div className='flex items-center'>
                                <div className='w-10 h-10 rounded-full overflow-hidden bg-gray-300 mr-3 flex items-center justify-center'>
                                    {u.avatarUrl ? (
                                        <img src={u.avatarUrl} alt={u.username} className='w-full h-full object-cover' />
                                    ) : (
                                        <AvatarWithInitials name={u.username} size="10" />
                                    )}
                                </div>
                                <div>
                                    <p className='font-medium text-deep-slate dark:text-white'>{u.username}</p>
                                    <p className='text-xs text-soft-grey'>{u.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggleUser(u)}
                                className='py-1 px-3 bg-reverb-teal text-white text-sm rounded-full hover:bg-acoustic-blue transition flex items-center'
                            >
                                <UserCheck size={16} className='mr-1' /> Add
                            </button>  
                        </div>
                    ))}
                </div>
                
                {/* 5. Final Creation Button */}
                <button
                    onClick={handleCreateGroup}
                    disabled={loading || !groupName.trim() || selectedUsers.length < 1}
                    className='mt-6 w-full p-3 bg-reverb-teal text-white font-semibold rounded-lg hover:bg-acoustic-blue transition disabled:bg-soft-grey'
                >
                    {loading ? 'Creating...' : `Create Group Chat`}
                </button>
            </div>
        </div>
    );
};

export default NewGroupModal;