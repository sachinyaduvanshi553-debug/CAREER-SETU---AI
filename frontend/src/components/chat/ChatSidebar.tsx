"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, MessageSquare, MoreVertical, ShieldCheck, Fingerprint, X, User, Activity, Check, X as XIcon } from "lucide-react";
import IdentityVerification from "../profile/IdentityVerification";
import { useSocket } from "@/components/SocketProvider";

interface ChatSidebarProps {
    onSelectUser: (user: any) => void;
    selectedUser: any;
    currentUser: any;
}

export default function ChatSidebar({ onSelectUser, selectedUser, currentUser }: ChatSidebarProps) {
    const [view, setView] = useState<"chats" | "discover" | "active">("active");
    const [users, setUsers] = useState<any[]>([]);
    const [conversations, setConversations] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [showVerifyPortal, setShowVerifyPortal] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [incomingRequest, setIncomingRequest] = useState<any | null>(null);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;
        const handleActiveUsers = (users: any[]) => {
            setOnlineUsers(users.filter(u => u.email !== currentUser?.email));
        };
        const handleRequestReceived = (data: any) => {
            setIncomingRequest(data);
        };
        socket.on("active_users", handleActiveUsers);
        socket.on("chat_request_received", handleRequestReceived);
        return () => {
            socket.off("active_users", handleActiveUsers);
            socket.off("chat_request_received", handleRequestReceived);
        };
    }, [socket, currentUser]);

    const handleSendRequest = (receiver_email: string) => {
        if (!socket) return;
        socket.emit("chat_request", { receiver_email });
    };

    const handleAcceptRequest = () => {
        if (!socket || !incomingRequest) return;
        socket.emit("chat_request_response", { requester_email: incomingRequest.requester_email, status: "accepted" });
        setIncomingRequest(null);
    };

    const handleDeclineRequest = () => {
        if (!socket || !incomingRequest) return;
        socket.emit("chat_request_response", { requester_email: incomingRequest.requester_email, status: "declined" });
        setIncomingRequest(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (view === "discover") {
                    const allUsers = await api.getChatUsers(searchQuery);
                    setUsers(Array.isArray(allUsers) ? allUsers : (allUsers?.users || []));
                } else {
                    const convs = await api.getConversations();
                    setConversations(Array.isArray(convs) ? convs : (convs?.conversations || []));
                }
            } catch (err) {
                console.error("Failed to fetch sidebar data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [view, searchQuery]); // Added searchQuery to dependencies for real-time search

    const activeList = view === "chats" ? conversations : view === "discover" ? users : onlineUsers;
    const filteredList = activeList.filter(u => 
        (u.full_name || u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-dark-900 border-r border-white/5 shadow-2xl">
            {/* Sidebar Header */}
            <div className="p-6 pb-2">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Messages
                    </h1>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setView("active")}
                            className={`p-2 rounded-xl transition-all ${view === "active" ? "bg-green-500/20 text-green-400" : "text-dark-400 hover:text-white hover:bg-white/5"}`}
                            title="Active Users"
                        >
                            <div className="relative">
                                <Activity className="w-5 h-5" />
                                {onlineUsers.length > 0 && (
                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark-900 animate-pulse"></div>
                                )}
                            </div>
                        </button>
                        <button 
                            onClick={() => setView("chats")}
                            className={`p-2 rounded-xl transition-all ${view === "chats" ? "bg-primary-500/20 text-primary-400" : "text-dark-400 hover:text-white hover:bg-white/5"}`}
                            title="Conversations"
                        >
                            <MessageSquare className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setView("discover")}
                            className={`p-2 rounded-xl transition-all ${view === "discover" ? "bg-primary-500/20 text-primary-400" : "text-dark-400 hover:text-white hover:bg-white/5"}`}
                            title="Discover"
                        >
                            <Users className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input 
                        type="text" 
                        placeholder={view === "chats" ? "Search conversations..." : "Discover people..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-dark-800/50 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary-500/50 transition-all"
                    />
                </div>
            </div>

            {/* User List */}
            <div className="flex-grow overflow-y-auto px-3 pb-6">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredList.length > 0 ? (
                    <div className="space-y-1">
                        {filteredList.map((user) => {
                            const isOnline = onlineUsers.some(u => u.email === user.email);
                            return (
                                <div key={user.email} className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${
                                    selectedUser?.email === user.email 
                                    ? "bg-primary-500/10 border border-primary-500/20" 
                                    : "hover:bg-white/5 border border-transparent"
                                }`}>
                                    <button
                                        onClick={() => onSelectUser(user)}
                                        className="flex-grow flex items-center gap-4 text-left overflow-hidden"
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                                                user.role === 'worker' ? 'bg-orange-500/20 text-orange-400' :
                                                user.role === 'professional' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-purple-500/20 text-purple-400'
                                            }`}>
                                                {user.name?.[0] || user.email?.[0]?.toUpperCase()}
                                            </div>
                                            {isOnline && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-dark-900 rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-grow text-left overflow-hidden">
                                            <div className="flex items-center justify-between gap-2 overflow-hidden">
                                                <span className="font-semibold truncate group-hover:text-primary-400 transition-colors">
                                                    {user.name || 'Anonymous User'}
                                                </span>
                                                {(user.is_verified || user.verification_status === 'verified') && (
                                                    <ShieldCheck className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-dark-500 truncate mt-0.5">
                                                {user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Member'}
                                            </p>
                                        </div>
                                    </button>
                                    
                                    {/* Action button: optionally hide Request button if view is 'chats', but user requested it next to active users */}
                                    {isOnline && selectedUser?.email !== user.email && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleSendRequest(user.email); }}
                                            className="ml-2 px-3 py-1.5 bg-primary-500/10 text-primary-400 hover:bg-primary-500 hover:text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                                        >
                                            Request
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-dark-500">
                        {view === "active" ? <Activity className="w-8 h-8 mb-2 opacity-20" /> : <Search className="w-8 h-8 mb-2 opacity-20" />}
                        <p className="text-xs italic">No {view} found</p>
                    </div>
                )}
            </div>

            {/* Incoming Request Notification Overlay */}
            <AnimatePresence>
                {incomingRequest && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-4 left-4 right-4 z-50 pointer-events-auto"
                    >
                        <div className="bg-dark-800 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
                            <h3 className="text-sm font-bold text-white mb-1">New Chat Request</h3>
                            <p className="text-xs text-dark-400 mb-4">{incomingRequest.requester_name || incomingRequest.requester_email} wants to chat.</p>
                            
                            <div className="flex gap-2">
                                <button onClick={handleDeclineRequest} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-semibold transition-colors">
                                    <XIcon className="w-3.5 h-3.5" /> Decline
                                </button>
                                <button onClick={handleAcceptRequest} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl text-xs font-semibold transition-colors">
                                    <Check className="w-3.5 h-3.5" /> Accept
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Current User Footer */}
            <div className="p-4 border-t border-white/5 bg-dark-900/80 backdrop-blur-md">
                {currentUser && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center font-bold text-primary-400 flex-shrink-0">
                                {currentUser.name?.[0] || currentUser.email?.[0].toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold truncate leading-none mb-1 flex items-center gap-1.5">
                                    {currentUser.name}
                                    {(currentUser.is_verified || currentUser.verification_status === 'verified') && (
                                        <ShieldCheck className="w-3 h-3 text-primary-400" />
                                    )}
                                </p>
                                <p className="text-[10px] text-dark-500 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowVerifyPortal(true)}
                            className="p-2 hover:bg-white/5 rounded-xl text-dark-400 hover:text-primary-400 transition-all border border-transparent hover:border-primary-500/20"
                            title="Verify Identity"
                        >
                            <Fingerprint className="w-5 h-5" />
                        </button>
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-lg relative"
                        >
                            <button 
                                onClick={() => setShowVerifyPortal(false)}
                                className="absolute right-4 top-4 z-10 p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all shadow-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <IdentityVerification />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
