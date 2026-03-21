"use client";

import { motion } from "framer-motion";
import { Check, CheckCheck, FileIcon, Play, ExternalLink, MapPin } from "lucide-react";

interface MessageBubbleProps {
    message: any;
    isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Determine backend URL for media
    const baseUrl = "http://localhost:8000";
    const mediaUrl = message.file_url ? (message.file_url.startsWith('http') ? message.file_url : `${baseUrl}${message.file_url}`) : null;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-4`}
        >
            <div className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl relative shadow-sm ${
                isOwn 
                ? 'bg-blue-600 text-white rounded-br-sm border border-transparent' 
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm'
            }`}>
                {/* Location Rendering */}
                {message.type === "location" && (
                    <div className="mb-2 -mx-2 -mt-1 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-black/5 dark:border-white/10 shadow-sm">
                        <div className="h-32 w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center relative group">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={`https://www.google.com/maps?q=${message.latitude},${message.longitude}&output=embed`}
                                allowFullScreen
                            ></iframe>
                            <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-none flex items-center justify-center">
                                <div className="p-2 bg-blue-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-105">
                                    <ExternalLink className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="p-2.5 flex items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900 border-t border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                                <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                <span className={`text-[11px] font-semibold truncate ${isOwn ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-500'}`}>
                                    {message.latitude.toFixed(4)}, {message.longitude.toFixed(4)}
                                </span>
                            </div>
                            <button 
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${message.latitude},${message.longitude}`, '_blank')}
                                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0 uppercase tracking-widest"
                            >
                                Open
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Media Rendering */}
                {message.type === "image" && mediaUrl && (
                    <div className="mb-2 -mx-2 -mt-1 rounded-xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm relative group bg-zinc-100 dark:bg-zinc-900">
                        <img 
                            src={mediaUrl} 
                            alt="Shared" 
                            className="max-h-64 w-full object-cover transition-transform duration-500 cursor-pointer group-hover:scale-[1.02]" 
                            onClick={() => window.open(mediaUrl, '_blank')}
                        />
                    </div>
                )}

                {message.type === "video" && mediaUrl && (
                    <div className="mb-2 -mx-2 -mt-1 rounded-xl overflow-hidden bg-black group relative shadow-sm">
                        <video 
                            src={mediaUrl} 
                            className="max-h-64 w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                            controls
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                <Play className="w-5 h-5 text-white fill-white ml-1" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Text Content */}
                {message.message && (
                    <p className={`text-[15px] whitespace-pre-wrap leading-relaxed ${isOwn ? 'text-white' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {message.message}
                    </p>
                )}

                {/* Metadata */}
                <div className={`flex items-center gap-1.5 mt-2 ${isOwn ? 'justify-end' : 'justify-end'}`}>
                    <span className={`text-[10px] font-medium tracking-wide ${isOwn ? 'text-blue-100/80' : 'text-zinc-400 dark:text-zinc-500'}`}>
                        {time}
                    </span>
                    {isOwn && (
                        <CheckCheck className="w-3.5 h-3.5 text-blue-200" />
                    )}
                </div>
            </div>
            
            {/* Sender Name (Optional) */}
            {!isOwn && (
                <span className="text-[10px] text-zinc-500 mt-1.5 ml-2 font-semibold uppercase tracking-widest">
                    {message.sender_name || 'Sender'}
                </span>
            )}
        </motion.div>
    );
}
