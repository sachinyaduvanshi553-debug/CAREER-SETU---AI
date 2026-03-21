"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { JOB_ROLES } from "@/lib/data";
import {
    Target, ArrowRight, CheckCircle2, AlertTriangle, XCircle, ChevronDown,
    BarChart3, TrendingUp, BookOpen
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import Link from "next/link";

interface SkillGap {
    skill: string;
    current: number;
    required: number;
    status: "strong" | "improve" | "missing";
    priority: "High" | "Medium" | "Low";
}

export default function SkillsPage() {
    const [selectedRole, setSelectedRole] = useState("");
    const [gaps, setGaps] = useState<SkillGap[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userSkills, setUserSkills] = useState<string[]>([]);

    useEffect(() => {
        api.getProfile().then(p => setUserSkills(p.skills)).catch(console.error);
    }, []);

    const handleAnalyze = async () => {
        if (!selectedRole) return;
        setLoading(true);
        try {
            const report = await api.getSkillGap(userSkills, selectedRole);
            const role = JOB_ROLES.find(r => r.id === selectedRole);

            const gapData: SkillGap[] = role?.requiredSkills.map(skill => {
                const isMatching = report.matching_skills.includes(skill);
                const current = isMatching ? 80 : 20; 
                const required = 75;
                return {
                    skill,
                    current,
                    required,
                    status: isMatching ? "strong" : "missing",
                    priority: isMatching ? "Low" : "High"
                };
            }) || [];

            setGaps(gapData);
            setShowResult(true);
        } catch (error) {
            console.error("Gap analysis failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const role = JOB_ROLES.find(r => r.id === selectedRole);
    const strongCount = gaps.filter(g => g.status === "strong").length;
    const improveCount = gaps.filter(g => g.status === "improve").length;
    const missingCount = gaps.filter(g => g.status === "missing").length;
    const overallScore = gaps.length > 0 ? Math.round(gaps.reduce((sum, g) => sum + Math.min(g.current / g.required * 100, 100), 0) / gaps.length) : 0;

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <FadeIn className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6 shadow-sm">
                        <Target className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                        Skill Gap <span className="text-purple-600 dark:text-purple-400">Analysis</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl mx-auto text-lg hover:text-zinc-700 transition">
                        Select your target career role and discover exactly what skills you need to build to get hired.
                    </p>
                </FadeIn>

                {/* Role Selector */}
                <FadeIn delay={0.1}>
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle className="text-lg">Select Target Career Role</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <select 
                                    value={selectedRole} 
                                    onChange={(e) => { setSelectedRole(e.target.value); setShowResult(false); }}
                                    className="w-full h-12 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Choose a career role...</option>
                                    {JOB_ROLES.map(r => (
                                        <option key={r.id} value={r.id}>{r.title} — {r.avgSalary}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            </div>
                            <Button 
                                size="lg" 
                                onClick={handleAnalyze} 
                                disabled={!selectedRole || loading}
                                className="h-12 px-8 shrink-0 bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0"></div>
                                ) : (
                                    <>
                                        <Target className="w-4 h-4 mr-2" /> Analyze Gaps
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* Results */}
                {showResult && gaps.length > 0 && (
                    <StaggerContainer className="space-y-6 mt-12" staggerChildren={0.1}>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Readiness Score", value: `${overallScore}%`, color: "text-purple-600 dark:text-purple-400" },
                                { label: "Strong Skills", value: strongCount, color: "text-emerald-600 dark:text-emerald-400" },
                                { label: "Need Improvement", value: improveCount, color: "text-amber-600 dark:text-amber-400" },
                                { label: "Missing Skills", value: missingCount, color: "text-red-600 dark:text-red-400" },
                            ].map((stat, i) => (
                                <StaggerItem key={stat.label}>
                                    <Card className="text-center py-6 h-full flex flex-col items-center justify-center">
                                        <div className={`text-3xl font-bold tracking-tight mb-1 ${stat.color}`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</div>
                                    </Card>
                                </StaggerItem>
                            ))}
                        </div>

                        {/* Target Role Info */}
                        {role && (
                            <StaggerItem>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">{role.title}</h3>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{role.description}</p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <Badge variant="secondary" className="px-3 py-1 font-medium">{role.avgSalary}</Badge>
                                                <Badge variant="success" className="px-3 py-1 font-medium flex items-center gap-1">
                                                    <TrendingUp className="w-3.5 h-3.5" /> {role.growth}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </StaggerItem>
                        )}

                        {/* Skill Bars */}
                        <StaggerItem>
                            <Card>
                                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-500" /> 
                                        Skill-by-Skill Breakdown
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    {gaps.sort((a, b) => a.current - b.current).map((gap, i) => (
                                        <motion.div key={gap.skill} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="group">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                                <div className="flex items-center gap-2.5">
                                                    {gap.status === "strong" ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> :
                                                        gap.status === "improve" ? <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" /> :
                                                            <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                                                    <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{gap.skill}</span>
                                                </div>
                                                <div className="flex items-center gap-3 ml-7 sm:ml-0">
                                                    <Badge 
                                                        variant="outline"
                                                        className={`border-transparent ${
                                                            gap.priority === "High" ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" :
                                                            gap.priority === "Medium" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" :
                                                            "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                                                        }`}
                                                    >
                                                        {gap.priority} Priority
                                                    </Badge>
                                                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 min-w-[3ch] text-right">{gap.current}%</span>
                                                </div>
                                            </div>
                                            
                                            {/* Progress Bar Container */}
                                            <div className="relative w-full h-3 rounded-full bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden box-border">
                                                {/* Target Marker */}
                                                <div className="absolute top-0 bottom-0 border-r-2 border-zinc-400 dark:border-zinc-500 z-20"
                                                    style={{ width: `${gap.required}%` }} 
                                                />
                                                {/* Fill */}
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${gap.current}%` }}
                                                    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.05 }}
                                                    className={`absolute top-0 left-0 h-full rounded-r-full z-10 ${
                                                        gap.status === "strong" ? "bg-emerald-500" :
                                                        gap.status === "improve" ? "bg-amber-500" :
                                                        "bg-red-500"
                                                    }`}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1.5 ml-1">
                                                <span className="text-[10px] text-zinc-400 font-medium">Novice</span>
                                                <span className="text-[10px] text-zinc-400 font-medium mr-[20%]">Target ({gap.required}%)</span>
                                                <span className="text-[10px] text-zinc-400 font-medium">Expert</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </CardContent>
                            </Card>
                        </StaggerItem>

                        {/* CTA */}
                        <StaggerItem>
                            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-100 dark:border-purple-900/50">
                                <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-sm transition-shadow">
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2 mb-1">
                                            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Ready to fill these gaps?
                                        </h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Get a personalized 30-60-90 day learning roadmap tailored to your target score.</p>
                                    </div>
                                    <Link href="/roadmap">
                                        <Button size="lg" className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shrink-0 group">
                                            Generate Roadmap <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    </StaggerContainer>
                )}
            </div>
        </main>
    );
}
