"use client";

import { useState, useEffect } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Users, Settings, Search, MoreVertical, Send, Paperclip, Image as ImageIcon, Video, X } from "lucide-react";

export default function ChatPage() {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await api.getProfile();
                setCurrentUser(profile);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="flex h-[calc(100vh-64px)] sm:h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden sm:p-4 gap-4">
            {/* Sidebar */}
            <div className={`w-full sm:w-80 lg:w-96 flex-shrink-0 bg-white dark:bg-zinc-950 sm:rounded-2xl border-0 sm:border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col shadow-sm sm:shadow-md ${selectedUser ? 'hidden sm:flex' : 'flex'}`}>
                <ChatSidebar 
                    onSelectUser={setSelectedUser} 
                    selectedUser={selectedUser}
                    currentUser={currentUser}
                />
            </div>

            {/* Main Chat Area */}
            <div className={`flex-grow bg-white dark:bg-zinc-950 sm:rounded-2xl border-0 sm:border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col relative shadow-sm sm:shadow-md ${!selectedUser ? 'hidden sm:flex' : 'flex'}`}>
                <AnimatePresence mode="wait">
                    {selectedUser ? (
                        <>
                            {/* Mobile Back Button Overlay */}
                            <div className="sm:hidden absolute top-4 left-4 z-50">
                                <button 
                                    onClick={() => setSelectedUser(null)}
                                    className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <ChatWindow 
                                key={selectedUser.email}
                                user={selectedUser} 
                                currentUser={currentUser}
                            />
                        </>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-grow flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-zinc-50/50 dark:bg-zinc-950/50"
                        >
                            <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center mb-6 shadow-sm">
                                <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3 tracking-tight text-zinc-950 dark:text-zinc-50">Your Messages</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm text-base leading-relaxed">
                                Select a conversation from the sidebar or find new users to start chatting natively.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
