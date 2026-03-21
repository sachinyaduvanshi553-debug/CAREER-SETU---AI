"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { JOB_LISTINGS } from "@/lib/data";
import {
    Briefcase, Search, MapPin, Clock, Users, ChevronDown, ExternalLink,
    Building2, Filter, X, TrendingUp, Sparkles, AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { Skeleton } from "@/components/ui/skeleton";

const STATES = Array.from(new Set(JOB_LISTINGS.map(j => j.state)));
const TYPES = ["Full-time", "Part-time", "Remote", "Internship"];

export default function JobsPage() {
    const [search, setSearch] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadJobs() {
            setLoading(true);
            try {
                const data = await api.getJobs(stateFilter || undefined);
                setJobs(data);
            } catch (error) {
                console.error("Failed to load jobs:", error);
            } finally {
                setLoading(false);
            }
        }
        loadJobs();
    }, [stateFilter]);

    const filtered = useMemo(() => {
        return jobs.filter(job => {
            const matchSearch = !search || 
                job.title.toLowerCase().includes(search.toLowerCase()) || 
                job.company.toLowerCase().includes(search.toLowerCase()) || 
                job.skills.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
            const matchType = !typeFilter || job.type === typeFilter;
            return matchSearch && matchType;
        });
    }, [search, typeFilter, jobs]);

    const clearFilters = () => { setSearch(""); setStateFilter(""); setTypeFilter(""); };

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <StaggerContainer className="space-y-10" staggerChildren={0.1}>
                    <StaggerItem>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-500 shadow-sm border border-emerald-200 dark:border-emerald-800">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    Job <span className="text-emerald-600 dark:text-emerald-500">Explorer</span>
                                </h1>
                                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg font-medium">Discover top-tier opportunities precision-matched for your profile</p>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                                <Users className="w-4 h-4 text-emerald-500" />
                                <span>{filtered.length} Opportunities</span>
                            </div>
                        </div>
                    </StaggerItem>

                    {/* Search & Filters Section */}
                    <StaggerItem>
                        <Card className="shadow-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 overflow-visible">
                            <div className="flex flex-col md:flex-row items-center gap-2">
                                <div className="relative flex-1 w-full group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <Input 
                                        type="text" 
                                        placeholder="Search by title, company, or expertise..." 
                                        className="h-14 pl-11 bg-transparent border-0 focus-visible:ring-0 shadow-none text-base placeholder:text-zinc-500 font-medium"
                                        value={search} 
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="h-0 md:h-8 w-full md:w-px bg-zinc-200 dark:bg-zinc-800 flex-shrink-0" />
                                <div className="flex gap-2 p-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                                    <button 
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-bold transition-all whitespace-nowrap ${showFilters ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800 shadow-sm' : 'bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                                    >
                                        <Filter className="w-4 h-4" /> Filters
                                        {(stateFilter || typeFilter) && (
                                            <Badge className="bg-emerald-500 text-white border-0 h-5 min-w-5 flex items-center justify-center p-0 text-[10px]">
                                                {(stateFilter ? 1 : 0) + (typeFilter ? 1 : 0)}
                                            </Badge>
                                        )}
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <select 
                                                value={stateFilter} 
                                                onChange={(e) => setStateFilter(e.target.value)}
                                                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 outline-none h-11 min-w-[140px] appearance-none cursor-pointer focus:border-emerald-500 transition-all font-display"
                                            >
                                                <option value="">All States</option>
                                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                                        </div>
                                        <div className="relative">
                                            <select 
                                                value={typeFilter} 
                                                onChange={(e) => setTypeFilter(e.target.value)}
                                                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 outline-none h-11 min-w-[140px] appearance-none cursor-pointer focus:border-emerald-500 transition-all font-display"
                                            >
                                                <option value="">Job Types</option>
                                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    {(stateFilter || typeFilter || search) && (
                                        <Button variant="ghost" onClick={clearFilters} className="h-11 px-4 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold text-xs uppercase tracking-widest">
                                            Clear <X className="ml-1 w-3.5 h-3.5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </StaggerItem>

                    {/* Job Listings Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <Card key={i} className="p-6 shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                    <div className="flex gap-4">
                                        <Skeleton className="w-14 h-14 rounded-2xl" />
                                        <div className="space-y-2 flex-1 pt-1">
                                            <Skeleton className="h-5 w-1/3" />
                                            <Skeleton className="h-4 w-1/4" />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                </Card>
                            ))
                        ) : filtered.length > 0 ? (
                            filtered.map((job, i) => (
                                <StaggerItem key={job.id}>
                                    <motion.div 
                                        whileHover={{ y: -4 }}
                                        className="group"
                                    >
                                        <Card className="shadow-lg hover:shadow-xl border-zinc-200 dark:border-zinc-800 transition-all duration-300 overflow-hidden relative cursor-pointer group bg-white dark:bg-zinc-900">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <CardContent className="p-6 sm:p-8">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                                    <div className="flex flex-1 gap-6">
                                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-3 shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                                            <Building2 className="w-full h-full text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">
                                                                    {job.title}
                                                                </h3>
                                                                {job.applicants > 50 && (
                                                                    <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 border-0 h-5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                                                        <TrendingUp className="w-3 h-3" /> Trending
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                                                                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-zinc-400" /> {job.company}</span>
                                                                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                                                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-zinc-400" /> {job.location}, {job.state}</span>
                                                            </div>
                                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mt-4 max-w-2xl line-clamp-2">
                                                                {job.description}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2 pt-4">
                                                                {job.skills.map(s => (
                                                                    <Badge key={s} variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-0 font-bold px-3 py-1 text-[11px] uppercase tracking-wider">
                                                                        {s}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 h-full pt-1">
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 tracking-tight">{job.salary}</div>
                                                            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center sm:justify-end gap-1.5 mt-1">
                                                                <Clock className="w-3 h-3" /> {job.posted}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button className="bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 h-11 px-6 font-bold shadow-sm hover:scale-105 active:scale-95 transition-all">
                                                                Apply <ExternalLink className="ml-2 w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </StaggerItem>
                            ))
                        ) : (
                            <StaggerItem>
                                <div className="text-center py-20 bg-white dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
                                    <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <AlertCircle className="w-10 h-10 text-zinc-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No jobs matched your hunt</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mb-8 font-medium">Try broadening your filters or keyword search to find more opportunities.</p>
                                    <Button onClick={clearFilters} variant="outline" className="font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl">Reset Explorer</Button>
                                </div>
                            </StaggerItem>
                        )}
                    </div>
                </StaggerContainer>
            </div>
        </main>
    );
}

