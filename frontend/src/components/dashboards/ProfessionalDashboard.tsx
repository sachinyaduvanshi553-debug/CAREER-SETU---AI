"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, BookOpen, Briefcase, FileText, MessageSquare, ChevronRight, Sparkles, Zap, ArrowUpRight, Award } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

function CircularProgress({ value, size = 120, stroke = 8 }: { value: number; size?: number; stroke?: number }) {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(99,102,241,0.1)" strokeWidth={stroke} fill="none" />
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
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute text-center">
                <div className="text-3xl font-bold font-display text-white">{value}</div>
                <div className="text-xs text-dark-400">/ 100</div>
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Hello, {user?.name}</h1>
                <p className="text-dark-400 mt-2">Track your professional growth and upcoming opportunities.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                            <CircularProgress value={stats.careerScore} />
                            <h3 className="mt-4 text-xl font-bold text-white">Career Score</h3>
                            <div className="mt-4 flex items-center gap-1 text-accent-emerald text-sm font-medium">
                                <TrendingUp className="w-4 h-4" /> Improving Daily
                            </div>
                        </div>

                        <div className="glass-card p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-accent-cyan" />
                                    AI Insight
                                </h3>
                                <p className="text-dark-300 italic font-medium">
                                    "Your profile shows strong alignment with **{stats.recommendations[0]?.title || 'Emerging'}** roles. We recommend focusing on **{stats.recommendations[0]?.missing_skills?.[0] || 'advanced certifications'}** to boost your score to 90+."
                                </p>
                            </div>
                            <button className="btn-secondary w-full mt-6 group">
                                Learn More <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                             <Target className="w-6 h-6 text-primary-400" /> Matches
                        </h2>
                        <div className="space-y-4">
                            {stats.recommendations.map((career, i) => (
                                <div key={i} className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 font-bold">
                                            {Math.round(career.match_score)}%
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{career.title}</h4>
                                            <p className="text-xs text-dark-400">{career.category}</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-dark-600" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                     <section className="glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-accent-amber" /> Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <Link href="/resume" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
                                <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary-400" />
                                </div>
                                <span className="text-sm font-medium">Analyze Resume</span>
                            </Link>
                            <Link href="/roadmap" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
                                <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-accent-purple" />
                                </div>
                                <span className="text-sm font-medium">Learning Roadmap</span>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
