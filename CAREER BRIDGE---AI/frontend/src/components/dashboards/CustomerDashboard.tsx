"use client";
import React, { useState, useEffect } from "react";
import { Search, MapPin, Star, Plus, Clock, CheckCircle2, ChevronRight, Sparkles, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";

export default function CustomerDashboard({ user }: { user: any }) {
    const [workers, setWorkers] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [reqs, s] = await Promise.all([
                    api.getCustomerRequests(),
                    api.getCustomerStats()
                ]);
                setRequests(reqs);
                setStats(s);
            } catch (err) { console.error(err); }
        }
        loadData();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await api.discoverServices(search);
            setWorkers(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight italic">Customer Portal</h1>
                    <p className="text-dark-400 mt-2 font-medium">Find skilled professionals for all your home and business needs.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20">
                    <Plus className="w-5 h-5" /> New Request
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Search Section */}
                    <section className="glass-card p-6 bg-primary-500/5 border-primary-500/10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                             <Sparkles className="w-5 h-5 text-accent-cyan" /> Discover Services
                        </h3>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search for Electricians, Plumbers, Tech Support..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                                />
                            </div>
                            <button onClick={handleSearch} className="btn-secondary">Search</button>
                        </div>
                    </section>

                    {/* Results / Workers */}
                    {workers.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider underline underline-offset-8 decoration-primary-500/30">Top Matches for You</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {workers.map((w, i) => (
                                    <div key={i} className="glass-card p-4 hover:bg-white/5 transition-all group">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-primary-500 flex items-center justify-center font-bold text-primary-400">
                                                {w.name[0]}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold group-hover:text-primary-400 transition-colors">{w.name}</h4>
                                                <div className="flex items-center gap-1 text-accent-amber">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <span className="text-xs font-bold">{w.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {w.skills.map((s: string) => (
                                                    <span key={s} className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-dark-300 font-bold uppercase tracking-tighter">{s}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                                                <span className="text-dark-400 font-medium">Starting from <span className="text-accent-emerald font-bold">₹{w.charges}</span></span>
                                                <button className="text-primary-400 hover:text-primary-300 font-bold flex items-center gap-1 group/btn">
                                                    Hire <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-all" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* My Requests */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                             <Clock className="w-6 h-6 text-primary-400" /> Active Requests
                        </h2>
                        <div className="space-y-4">
                            {requests.length === 0 ? (
                                <div className="glass-card p-12 text-center text-dark-400 font-medium italic opacity-60">You haven't posted any service requests yet.</div>
                            ) : (
                                requests.map((req, i) => (
                                    <div key={i} className="glass-card p-4 flex items-center justify-between border-l-4 border-primary-500">
                                        <div>
                                            <h4 className="text-white font-bold tracking-tight">{req.work_type}</h4>
                                            <p className="text-xs text-dark-500 mt-1 uppercase font-mono">{req.location} • {req.status}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="p-2 text-dark-400 hover:text-white transition-colors"><MessageSquare className="w-5 h-5" /></button>
                                            <button className="text-xs font-bold text-primary-400 hover:underline">Details</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                     <section className="glass-card p-6 border-b-4 border-primary-500">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-white/10 mx-auto flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-xl">
                                {user.name?.[0]}
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-wide">{user.name}</h3>
                            <p className="text-xs text-dark-400 mt-1 font-mono uppercase tracking-widest">{user.location}</p>
                        </div>
                        <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-dark-400 font-medium tracking-tight">Active Requests</span>
                                <span className="text-white font-bold opacity-80 uppercase text-xs tracking-wider">{stats?.pending_requests || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400 font-medium tracking-tight">Total Spent</span>
                                <span className="text-white font-bold opacity-80 uppercase text-xs tracking-wider">₹0</span>
                            </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-dark-400 font-medium tracking-tight">Wallet Balance</span>
                                <span className="text-accent-cyan font-bold uppercase text-xs tracking-wider">₹{stats?.balance || 0}</span>
                            </div>
                            <button className="btn-secondary w-full text-xs py-2 uppercase tracking-widest font-bold">Manage Wallet</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
