"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, BookOpen, Briefcase, FileText, MessageSquare, ChevronRight, Sparkles, Zap, ArrowUpRight, Award } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { Badge } from "@/components/ui/badge";

function CircularProgress({ value, size = 120, stroke = 8 }: { value: number; size?: number; stroke?: number }) {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth={stroke} fill="none" />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke="url(#scoreGrad)" strokeWidth={stroke} fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeDasharray={circumference}
                />
                <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563eb" /> {/* blue-600 */}
                        <stop offset="100%" stopColor="#4f46e5" /> {/* indigo-600 */}
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute text-center">
                <div className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">{value}</div>
                <div className="text-xs text-zinc-500 font-medium">/ 100</div>
            </div>
        </div>
    );
}

export default function ProfessionalDashboard({ user }: { user: any }) {
    const [stats, setStats] = useState<{
        careerScore: number;
        recommendations: any[];
        skills: any[];
    }>({
        careerScore: 72,
        recommendations: [],
        skills: []
    });

    useEffect(() => {
        async function loadData() {
            try {
                const recommendations = await api.getRecommendations(user.skills || []);
                setStats({
                    careerScore: recommendations[0]?.match_score || 72,
                    recommendations: recommendations,
                    skills: (user.skills || []).map((s: string) => ({ name: s, level: 85 }))
                });
            } catch (err) {
                console.error(err);
            }
        }
        loadData();
    }, [user]);

    return (
        <StaggerContainer className="space-y-8 max-w-6xl mx-auto" staggerChildren={0.1}>
            <StaggerItem>
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Hello, {user?.name || "Professional"}</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track your professional growth and upcoming opportunities.</p>
                </header>
            </StaggerItem>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerChildren={0.1}>
                        <StaggerItem>
                            <Card className="h-full flex flex-col items-center justify-center text-center py-8">
                                <CircularProgress value={stats.careerScore} />
                                <h3 className="mt-6 text-xl font-bold text-zinc-950 dark:text-zinc-50">Career Score</h3>
                                <Badge variant="success" className="mt-4 flex items-center gap-1">
                                    <TrendingUp className="w-3.5 h-3.5" /> Improving Daily
                                </Badge>
                            </Card>
                        </StaggerItem>

                        <StaggerItem>
                            <Card className="h-full flex flex-col justify-between bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-100 dark:border-blue-900/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                                        AI Insight
                                    </CardTitle>
                                    <CardDescription className="text-zinc-700 dark:text-zinc-300 leading-relaxed mt-3">
                                        "Your profile shows strong alignment with <span className="font-semibold text-zinc-950 dark:text-zinc-50">{stats.recommendations[0]?.title || 'Emerging'}</span> roles. We recommend focusing on <span className="font-semibold text-zinc-950 dark:text-zinc-50">{stats.recommendations[0]?.missing_skills?.[0] || 'advanced certifications'}</span> to boost your score to 90+."
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="w-full group bg-white dark:bg-zinc-950">
                                        Learn More <ChevronRight className="ml-2 w-4 h-4 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    </StaggerContainer>

                    <StaggerItem>
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-500" /> Top Job Matches
                                </h2>
                                <Link href="/jobs" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                    View all
                                </Link>
                            </div>
                            
                            <div className="space-y-4">
                                {stats.recommendations.map((career, i) => (
                                    <Card key={i} className="group cursor-pointer hover:border-blue-500/30 transition-all hover:shadow-md">
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold shadow-sm">
                                                    {Math.round(career.match_score)}%
                                                </div>
                                                <div>
                                                    <h4 className="text-zinc-950 dark:text-zinc-50 font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{career.title}</h4>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{career.category}</p>
                                                </div>
                                            </div>
                                            <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                        </div>
                                    </Card>
                                ))}
                                {stats.recommendations.length === 0 && (
                                    <Card className="p-8 text-center text-zinc-500 dark:text-zinc-400 border-dashed">
                                        Loading amazing job matches...
                                    </Card>
                                )}
                            </div>
                        </section>
                    </StaggerItem>
                </div>

                <div className="space-y-8">
                     <StaggerItem>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Zap className="w-5 h-5 text-amber-500" /> Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href="/resume" className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center shadow-sm">
                                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-zinc-50">Analyze Resume</span>
                                    <ChevronRight className="ml-auto w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <Link href="/roadmap" className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
                                    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/40 flex items-center justify-center shadow-sm">
                                        <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-zinc-50">Learning Roadmap</span>
                                    <ChevronRight className="ml-auto w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <Link href="/interview" className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
                                    <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/40 flex items-center justify-center shadow-sm">
                                        <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-zinc-50">Mock Interview</span>
                                    <ChevronRight className="ml-auto w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 overflow-hidden relative border-0">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-zinc-800 dark:bg-zinc-200 rounded-full blur-3xl opacity-50" />
                            <CardHeader className="relative z-10">
                                <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
                                <CardDescription className="text-zinc-400 dark:text-zinc-500">
                                    Get unlimited resume reviews and personalized mentorship.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 border0">
                                    Upgrade Now
                                </Button>
                            </CardContent>
                        </Card>
                    </StaggerItem>
                </div>
            </div>
        </StaggerContainer>
    );
}
