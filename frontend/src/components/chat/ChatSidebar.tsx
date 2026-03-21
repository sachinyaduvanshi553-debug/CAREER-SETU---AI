"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, MessageSquare, ShieldCheck, Fingerprint, X } from "lucide-react";
import IdentityVerification from "../profile/IdentityVerification";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatSidebarProps {
    onSelectUser: (user: any) => void;
    selectedUser: any;
    currentUser: any;
}

export default function ChatSidebar({ onSelectUser, selectedUser, currentUser }: ChatSidebarProps) {
    const [view, setView] = useState<"chats" | "discover">("chats");
    const [users, setUsers] = useState<any[]>([]);
    const [conversations, setConversations] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [showVerifyPortal, setShowVerifyPortal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (view === "discover") {
                    const allUsers = await api.getChatUsers();
                    setUsers(allUsers);
                } else {
                    const convs = await api.getConversations();
                    setConversations(convs);
                }
            } catch (err) {
                console.error("Failed to fetch sidebar data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [view]);

    const filteredList = (view === "chats" ? conversations : users).filter(u => 
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-sm">
            {/* Sidebar Header */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Messages
                    </h1>
                    <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1">
                        <button 
                            onClick={() => setView("chats")}
                            className={`p-1.5 rounded-md transition-all ${view === "chats" ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"}`}
                        >
                            <MessageSquare className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setView("discover")}
                            className={`p-1.5 rounded-md transition-all ${view === "discover" ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"}`}
                        >
                            <Users className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-2">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                        type="text" 
                        placeholder={view === "chats" ? "Search conversations..." : "Discover people..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 bg-zinc-50 dark:bg-zinc-900 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 pl-10 pr-4 text-sm transition-all"
                    />
                </div>
            </div>

            {/* User List */}
            <div className="flex-grow overflow-y-auto px-3 pb-4">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredList.length > 0 ? (
                    <div className="space-y-1">
                        {filteredList.map((user) => (
                            <button
                                key={user.email}
                                onClick={() => onSelectUser(user)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                                    selectedUser?.email === user.email 
                                    ? "bg-blue-50 dark:bg-blue-900/20 shadow-sm" 
                                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                                        user.role === 'worker' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500' :
                                        user.role === 'professional' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                                        'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                                    }`}>
                                        {user.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full"></div>
                                </div>
                                <div className="flex-grow text-left overflow-hidden">
                                    <div className="flex items-center justify-between gap-2 overflow-hidden mb-0.5">
                                        <span className={`font-semibold text-sm truncate transition-colors ${selectedUser?.email === user.email ? "text-blue-900 dark:text-blue-100" : "text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"}`}>
                                            {user.full_name || 'Anonymous User'}
                                        </span>
                                        {(user.is_verified || user.verification_status === 'verified') && (
                                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                        )}
                                    </div>
                                    <p className={`text-[11px] font-medium truncate ${selectedUser?.email === user.email ? "text-blue-600/80 dark:text-blue-400/80" : "text-zinc-500 dark:text-zinc-400"}`}>
                                        {user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Member'}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-zinc-400 dark:text-zinc-600">
                        <Search className="w-8 h-8 mb-3 opacity-30" />
                        <p className="text-sm font-medium">No {view} found</p>
                    </div>
                )}
            </div>

            {/* Current User Footer */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 backdrop-blur-sm">
                {currentUser && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 shadow-sm border border-blue-200 dark:border-blue-800/50">
                                {currentUser.full_name?.[0] || currentUser.email?.[0].toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-zinc-950 dark:text-zinc-50 truncate leading-none mb-1 flex items-center gap-1.5 tracking-tight">
                                    {currentUser.full_name}
                                    {(currentUser.is_verified || currentUser.verification_status === 'verified') && (
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                    )}
                                </p>
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                        <Button 
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowVerifyPortal(true)}
                            className="text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="Verify Identity"
                        >
                            <Fingerprint className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Verification Modal */}
            <AnimatePresence>
                {showVerifyPortal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            className="w-full max-w-lg relative"
                        >
                            <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowVerifyPortal(false)}
                                className="absolute right-4 top-4 z-10 rounded-full text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 bg-white/50 hover:bg-white dark:bg-zinc-900/50 dark:hover:bg-zinc-800 shadow-sm backdrop-blur-md h-8 w-8"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                            <IdentityVerification />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
