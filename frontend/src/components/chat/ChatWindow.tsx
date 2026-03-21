"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import MessageBubble from "./MessageBubble";
import { Send, Paperclip, Image as ImageIcon, Video, Phone, Video as VideoCall, MoreVertical, MapPin, MessageSquare, ShieldCheck, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
    user: any;
    currentUser: any;
}

export default function ChatWindow({ user, currentUser }: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const ws = useRef<WebSocket | null>(null);

    // Fetch history and connect WebSocket
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const history = await api.getChatHistory(user.email);
                setMessages(history);
            } catch (err) {
                console.error("Failed to load chat history", err);
            }
        };

        loadHistory();

        // Connect WebSocket
        const token = localStorage.getItem("token");
        const wsUrl = `ws://localhost:8000/api/chat/ws/${token}`;
        ws.current = new WebSocket(wsUrl);

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Only add if it's from current chat partner or to them
            if (data.sender === user.email || data.sender === currentUser.email) {
                setMessages(prev => [...prev, data]);
            }
        };

        ws.current.onerror = (err) => console.error("WS Error", err);
        ws.current.onclose = () => console.log("WS Closed");

        return () => {
            ws.current?.close();
        };
    }, [user.email, currentUser?.email]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!input.trim() || !ws.current) return;

        const data = {
            receiver: user.email,
            message: input,
            type: "text",
            file_url: null
        };

        ws.current.send(JSON.stringify(data));
        
        // Optimistically add to local messages
        const localMsg = {
            sender: currentUser.email,
            message: input,
            type: "text",
            file_url: null,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, localMsg]);
        setInput("");
    };

    const handleShareLocation = () => {
        if (!navigator.geolocation || !ws.current) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsSharingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const data = {
                    receiver: user.email,
                    message: "Shared a location",
                    type: "location",
                    latitude,
                    longitude
                };
                ws.current?.send(JSON.stringify(data));

                // Optimistically add
                const localMsg = {
                    sender: currentUser.email,
                    message: "Shared a location",
                    type: "location",
                    latitude,
                    longitude,
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, localMsg]);
                setIsSharingLocation(false);
            },
            (err) => {
                console.error("Location error", err);
                setIsSharingLocation(false);
                alert("Failed to get location. Please ensure location permissions are enabled.");
            }
        );
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
        const file = e.target.files?.[0];
        if (!file || !ws.current) return;

        setIsUploading(true);
        try {
            const res = await api.uploadChatMedia(file);
            if (res.url) {
                const data = {
                    receiver: user.email,
                    message: "",
                    type: type,
                    file_url: res.url
                };
                ws.current.send(JSON.stringify(data));
                
                // Optimistically add
                const localMsg = {
                    sender: currentUser.email,
                    message: "",
                    type: type,
                    file_url: res.url,
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, localMsg]);
            }
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-sm">
                            {user.full_name?.[0] || user.email?.[0].toUpperCase()}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full"></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-none">
                                {user.full_name || 'Anonymous User'}
                            </h3>
                            {(user.is_verified || user.verification_status === 'verified') && (
                                <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            )}
                        </div>
                        <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mt-1">Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                    <Button variant="ghost" size="icon" className="hover:text-blue-600 dark:hover:text-blue-400 rounded-full h-9 w-9"><Phone className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="hover:text-blue-600 dark:hover:text-blue-400 rounded-full h-9 w-9"><VideoCall className="w-5 h-5" /></Button>
                    <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
                    <Button variant="ghost" size="icon" className="hover:text-zinc-900 dark:hover:text-zinc-100 rounded-full h-9 w-9"><MoreVertical className="w-5 h-5" /></Button>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-6 space-y-4"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 text-sm">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800">
                            <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-1">Start a conversation</h3>
                        <p className="font-medium text-zinc-500">Say hi to {user.full_name || 'this user'}!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <MessageBubble 
                            key={idx} 
                            message={msg} 
                            isOwn={msg.sender === currentUser?.email} 
                        />
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                    <div className="flex items-center gap-1.5 pb-2">
                        <Button 
                            variant="ghost" size="icon"
                            onClick={handleShareLocation}
                            disabled={isSharingLocation}
                            className={`rounded-full h-9 w-9 ${isSharingLocation ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20 animate-pulse border border-blue-200 dark:border-blue-800" : "text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400"}`}
                            title="Share Location"
                        >
                            <MapPin className="w-4 h-4" />
                        </Button>
                        <label className="cursor-pointer text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-9 w-9 flex items-center justify-center rounded-full transition-colors">
                            <ImageIcon className="w-4 h-4" />
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                        </label>
                        <label className="cursor-pointer text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-9 w-9 flex items-center justify-center rounded-full transition-colors">
                            <Video className="w-4 h-4" />
                            <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
                        </label>
                    </div>

                    <div className="flex-grow relative group">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type a message..."
                            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl py-3 px-4 pr-10 text-[15px] font-medium transition-all resize-none min-h-[44px] max-h-32 text-zinc-900 dark:text-zinc-100 shadow-inner"
                            rows={1}
                        />
                        <button className="absolute right-3 bottom-0 top-0 text-zinc-400 hover:text-amber-500 transition-colors flex items-center justify-center">
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    <Button 
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isUploading || isSharingLocation}
                        className={`h-[44px] w-[44px] shrink-0 rounded-2xl p-0 transition-transform ${
                            input.trim() && !isUploading && !isSharingLocation
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:scale-105 active:scale-95" 
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                        }`}
                    >
                        {isUploading ? (
                            <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300 rounded-full animate-spin"></div>
                        ) : (
                            <Send className="w-4 h-4 mt-0.5 ml-0.5" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
