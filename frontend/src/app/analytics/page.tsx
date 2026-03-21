"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { DISTRICT_ANALYTICS } from "@/lib/data";
import {
    BarChart3, MapPin, Users, GraduationCap, Briefcase, TrendingUp,
    ChevronDown, Building2, Target, Award, ArrowUpRight, PieChart, Activity
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { Skeleton } from "@/components/ui/skeleton";

const OVERVIEW = {
    totalWorkers: 2545000,
    totalTrained: 1004000,
    totalPlaced: 784000,
    trainingCenters: 810,
    placementRate: 78.1,
    avgSkillGap: 34,
};

function BarChartSimple({ data, max }: { data: { label: string; value: number; color: string }[]; max: number }) {
    return (
        <div className="space-y-4">
            {data.map((item, i) => (
                <div key={item.label} className="group">
                    <div className="flex justify-between text-sm mb-2 px-1">
                        <span className="font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 transition-colors uppercase tracking-widest text-[11px]">{item.label}</span>
                        <span className="font-mono text-zinc-500 dark:text-zinc-400 font-bold border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-md text-[10px] bg-zinc-50 dark:bg-zinc-950 shadow-sm transition-all group-hover:shadow-md">{(item.value / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner">
                        <motion.div
                            initial={{ width: 0 }} animate={{ width: `${(item.value / max) * 100}%` }}
                            transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full rounded-full ${item.color} shadow-sm relative overflow-hidden`}
                        >
                             <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                        </motion.div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AnalyticsPage() {
    const [selectedState, setSelectedState] = useState("");
    const [overview, setOverview] = useState(OVERVIEW);
    const [districts, setDistricts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAnalytics() {
            setLoading(true);
            try {
                const ovData = await api.getAnalyticsOverview();
                setOverview(ovData);
                const dData = await api.getAnalyticsDistricts(selectedState || undefined);
                setDistricts(dData);
            } catch (error) {
                console.error("Failed to load analytics:", error);
            } finally {
                setLoading(false);
            }
        }
        loadAnalytics();
    }, [selectedState]);

    const states = Array.from(new Set(DISTRICT_ANALYTICS.map(d => d.state)));

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <StaggerContainer className="space-y-10" staggerChildren={0.1}>
                    <StaggerItem>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 h-6 text-[10px] font-bold uppercase tracking-[0.2em] px-3">
                                        Government Insights
                                    </Badge>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-500 shadow-sm border border-rose-200 dark:border-rose-800">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    Workforce <span className="text-rose-600 dark:text-rose-500">Analytics</span>
                                </h1>
                                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg font-medium">Real-time mapping of skill gaps, training efficiency, and placement rates</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <select 
                                        value={selectedState} 
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 outline-none h-11 min-w-[200px] appearance-none cursor-pointer focus:border-rose-500 transition-all font-display shadow-sm"
                                    >
                                        <option value="">Consolidated India View</option>
                                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-rose-500 transition-colors pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </StaggerItem>

                    {/* Overview Cards */}
                    <StaggerItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { label: "Total Workforce", value: `${(overview.totalWorkers / 1000000).toFixed(1)}M`, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
                                { label: "Trained Workers", value: `${(overview.totalTrained / 1000000).toFixed(1)}M`, icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-100" },
                                { label: "Placed Workers", value: `${(overview.totalPlaced / 1000).toFixed(0)}K`, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-100" },
                                { label: "Placement Rate", value: `${overview.placementRate}%`, icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-100" },
                                { label: "Training Centers", value: `${overview.trainingCenters}`, icon: Building2, color: "text-amber-600", bg: "bg-amber-100" },
                                { label: "Avg Skill Gap", value: `${overview.avgSkillGap}%`, icon: Target, color: "text-orange-600", bg: "bg-orange-100" },
                            ].map((card, i) => (
                                <Card key={card.label} className="shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-md transition-all group overflow-hidden">
                                     <div className={`h-1 w-full ${card.color.replace('text', 'bg')} opacity-40 group-hover:opacity-100 transition-opacity`} />
                                     <CardContent className="p-5 text-center">
                                        <div className={`w-9 h-9 rounded-full ${card.bg} dark:${card.bg.replace('bg-', 'bg-')}/30 flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                                            <card.icon className={`w-4 h-4 ${card.color} dark:${card.color.replace('text-', 'text-')}-400`} />
                                        </div>
                                        <div className="text-xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">{card.value}</div>
                                        <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{card.label}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </StaggerItem>

                    {/* Main Analytics Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <StaggerItem className="lg:col-span-2">
                            <Card className="shadow-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-full overflow-hidden">
                                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Workforce Density by District</CardTitle>
                                            <CardDescription className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Comparing total active workforce against state averages.</CardDescription>
                                        </div>
                                        <BarChart3 className="w-5 h-5 text-rose-500" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    {loading ? (
                                        <div className="space-y-6">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={i} className="space-y-2">
                                                    <Skeleton className="h-4 w-1/4" />
                                                    <Skeleton className="h-3 w-full" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <BarChartSimple
                                            max={Math.max(...districts.map(d => d.totalWorkers), 100000)}
                                            data={districts.map(d => ({
                                                label: `${d.district}`,
                                                value: d.totalWorkers,
                                                color: "bg-gradient-to-r from-rose-500 to-rose-600",
                                            }))}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </StaggerItem>

                        <StaggerItem>
                            <Card className="shadow-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-full overflow-hidden">
                                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Placement Rates</CardTitle>
                                            <CardDescription className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Successful job placement post-training.</CardDescription>
                                        </div>
                                        <PieChart className="w-5 h-5 text-emerald-500" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {loading ? (
                                        <div className="space-y-6">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Skeleton key={i} className="h-8 w-full rounded-lg" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-5">
                                            {districts.slice(0, 6).map((d, i) => {
                                                const rate = Math.round((d.placedWorkers / d.trainedWorkers) * 100);
                                                return (
                                                    <div key={d.district} className="group relative">
                                                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-1.5 px-1 py-1 rounded-md transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-950">
                                                            <span className="text-zinc-500 dark:text-zinc-400">{d.district}</span>
                                                            <span className={rate >= 75 ? "text-emerald-600" : rate >= 50 ? "text-amber-600" : "text-rose-600"}>{rate}% Success</span>
                                                        </div>
                                                        <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-inner">
                                                            <motion.div
                                                                initial={{ width: 0 }} animate={{ width: `${rate}%` }}
                                                                transition={{ duration: 1.2, delay: i * 0.1, ease: "circOut" }}
                                                                className={`h-full rounded-full ${
                                                                    rate >= 75 ? "bg-gradient-to-r from-emerald-500 to-green-600" :
                                                                    rate >= 50 ? "bg-gradient-to-r from-amber-500 to-orange-600" :
                                                                    "bg-gradient-to-r from-rose-500 to-red-600"
                                                                } shadow-sm`}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <Button variant="ghost" className="w-full mt-8 h-10 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-rose-500 group">
                                        View Detailed Report <ArrowUpRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    </div>

                    {/* District Map Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-72 w-full rounded-2xl" />
                            ))
                        ) : (
                            districts.map((d, i) => (
                                <StaggerItem key={d.district}>
                                    <Card className="shadow-md hover:shadow-xl border-zinc-200 dark:border-zinc-800 transition-all duration-300 overflow-hidden group bg-white dark:bg-zinc-900 h-full flex flex-col">
                                        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-950/50 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-base font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2 group-hover:text-rose-600 transition-colors">
                                                        <MapPin className="w-4 h-4 text-rose-500" /> {d.district}
                                                    </CardTitle>
                                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">{d.state}</p>
                                                </div>
                                                <Badge className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 h-7 text-[10px] font-bold uppercase tracking-widest px-3 shadow-sm">
                                                    {d.trainingCenters} Centers
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 flex-grow flex flex-col">
                                            <div className="grid grid-cols-3 gap-2 mb-6 p-1 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/50 shadow-inner">
                                                <div className="text-center py-2 px-1">
                                                    <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] mb-1">Total</div>
                                                    <div className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">{(d.totalWorkers / 1000).toFixed(0)}K</div>
                                                </div>
                                                <div className="text-center py-2 px-1 border-x border-zinc-200 dark:border-zinc-800">
                                                    <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] mb-1">Trained</div>
                                                    <div className="text-base font-bold text-blue-600 dark:text-blue-400 tracking-tight">{(d.trainedWorkers / 1000).toFixed(0)}K</div>
                                                </div>
                                                <div className="text-center py-2 px-1">
                                                    <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] mb-1">Placed</div>
                                                    <div className="text-base font-bold text-emerald-600 dark:text-emerald-500 tracking-tight">{(d.placedWorkers / 1000).toFixed(0)}K</div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 flex-grow">
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                        <Activity className="w-3 h-3" /> Critical Skill Gaps
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {d.topSkillGaps.map((s: string) => (
                                                            <Badge key={s} className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50 font-bold px-2 py-0.5 text-[9px] uppercase tracking-wider">
                                                                {s}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="pt-2">
                                                    <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                        <TrendingUp className="w-3 h-3" /> In-Demand Roles
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {d.demandRoles.map((r: string) => (
                                                            <Badge key={r} className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 font-bold px-2 py-0.5 text-[9px] uppercase tracking-wider">
                                                                {r}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </StaggerItem>
                            ))
                        )}
                    </div>
                </StaggerContainer>
            </div>
        </main>
    );
}

