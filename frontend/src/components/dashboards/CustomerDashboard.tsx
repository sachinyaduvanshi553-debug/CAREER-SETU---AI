"use client";
import React, { useState, useEffect } from "react";
import { Search, MapPin, Star, Plus, Clock, CheckCircle2, ChevronRight, Sparkles, MessageSquare, Briefcase, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { Input } from "@/components/ui/input";

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
        <StaggerContainer className="space-y-8 max-w-6xl mx-auto" staggerChildren={0.1}>
            <StaggerItem>
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            Customer Portal
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Find trusted professionals for all your home and business needs.</p>
                    </div>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 shadow-sm">
                        <Plus className="w-5 h-5 mr-2" /> New Request
                    </Button>
                </header>
            </StaggerItem>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Search Section */}
                    <StaggerItem>
                        <Card className="border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10 shadow-sm">
                            <CardContent className="p-6 md:p-8">
                                <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-6 flex items-center gap-2 tracking-tight">
                                     <Sparkles className="w-5 h-5 text-blue-500" /> Discover Services
                                </h3>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                        <Input 
                                            type="text" 
                                            placeholder="Search for Electricians, Plumbers, Tech Support..." 
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full h-14 pl-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-blue-500 text-base shadow-sm font-medium"
                                        />
                                    </div>
                                    <Button 
                                        size="lg" 
                                        onClick={handleSearch} 
                                        disabled={loading}
                                        className="h-14 px-8 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shrink-0 shadow-sm"
                                    >
                                        {loading ? "Searching..." : "Search"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    {/* Results / Workers */}
                    {workers.length > 0 && (
                        <StaggerItem>
                            <section>
                                <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-6 tracking-tight">Top Matches for You</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {workers.map((w, i) => (
                                        <Card key={i} className="group hover:border-blue-500/30 hover:shadow-md transition-all cursor-pointer">
                                            <CardContent className="p-5 flex flex-col h-full justify-between">
                                                <div>
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 text-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                                                            {w.name[0]}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-zinc-950 dark:text-zinc-50 font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{w.name}</h4>
                                                            <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{w.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {w.skills.map((s: string) => (
                                                            <Badge key={s} variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-medium">
                                                                {s}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                                        Starting from <span className="text-zinc-950 dark:text-zinc-50 font-bold text-sm ml-1">₹{w.charges}</span>
                                                    </span>
                                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                                        Hire <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        </StaggerItem>
                    )}

                    {/* My Requests */}
                    <StaggerItem>
                        <section>
                            <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-6 flex items-center gap-2">
                                 <Clock className="w-5 h-5 text-blue-500" /> Active Requests
                            </h2>
                            <div className="space-y-4">
                                {requests.length === 0 ? (
                                    <Card className="border-dashed border-2 text-center p-12 bg-transparent shadow-none">
                                        <Briefcase className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No active requests</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Post a new request to find professionals for your tasks.</p>
                                    </Card>
                                ) : (
                                    requests.map((req, i) => (
                                        <Card key={i} className="overflow-hidden group hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                            <div className="flex items-stretch">
                                                <div className="w-1.5 bg-blue-500 shrink-0" />
                                                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                                                    <div>
                                                        <h4 className="text-zinc-950 dark:text-zinc-50 font-bold tracking-tight mb-1">{req.work_type}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                                            <MapPin className="w-3.5 h-3.5" /> {req.location} 
                                                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                                            <Badge variant="outline" className={`border-0 px-2 py-0.5 ${req.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                                                {req.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 self-end sm:self-auto">
                                                        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400">
                                                            <MessageSquare className="w-5 h-5" />
                                                        </Button>
                                                        <Button variant="outline" className="text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors">
                                                            Details
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </section>
                    </StaggerItem>
                </div>

                <div className="space-y-8">
                     <StaggerItem>
                        <Card className="overflow-hidden border-t-4 border-t-blue-500">
                            <CardContent className="p-6 md:p-8">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 mx-auto flex items-center justify-center text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 shadow-sm">
                                        {user.name?.[0]}
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">{user.name}</h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                                        <MapPin className="w-3 h-3" /> {user.location}
                                    </p>
                                </div>
                                
                                <div className="mt-8 space-y-3">
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                                        <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium flex items-center gap-2">
                                            <Briefcase className="w-4 h-4" /> Active Requests
                                        </span>
                                        <span className="text-zinc-950 dark:text-zinc-50 font-bold">{stats?.pending_requests || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3">
                                        <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" /> Total Spent
                                        </span>
                                        <span className="text-zinc-950 dark:text-zinc-50 font-bold">₹0</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                                        <span className="text-blue-700 dark:text-blue-400 text-sm font-medium flex items-center gap-2">
                                            <Wallet className="w-4 h-4" /> Wallet Balance
                                        </span>
                                        <span className="text-blue-700 dark:text-blue-400 font-bold text-lg tracking-tight">₹{stats?.balance || 0}</span>
                                    </div>
                                </div>
                                
                                <Button className="w-full mt-6 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                                    Manage Wallet
                                </Button>
                            </CardContent>
                        </Card>
                    </StaggerItem>
                </div>
            </div>
        </StaggerContainer>
    );
}
