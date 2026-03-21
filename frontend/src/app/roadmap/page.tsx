"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { COURSES, JOB_ROLES } from "@/lib/data";
import {
    Map, ChevronDown, BookOpen, ExternalLink, Star, Clock, Globe, CheckCircle2,
    ChevronRight, Sparkles, Check
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import Link from "next/link";

interface Phase {
    title: string;
    duration: string;
    skills: string[];
    courses: typeof COURSES;
    goals: string[];
}

export default function RoadmapPage() {
    const [selectedRole, setSelectedRole] = useState("");
    const [roadmap, setRoadmap] = useState<Phase[]>([]);
    const [activePhase, setActivePhase] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!selectedRole) return;
        setLoading(true);
        try {
            const data = await api.getRoadmap(selectedRole);
            setRoadmap(data);
            setActivePhase(0);
        } catch (error) {
            console.error("Failed to generate roadmap:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <FadeIn className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 mb-6 shadow-sm">
                        <Map className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                        Learning <span className="text-cyan-600 dark:text-cyan-400">Roadmap</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl mx-auto text-lg hover:text-zinc-700 transition">
                        Get a personalized 30-60-90 day step-by-step upskilling plan crafted specifically for your target career.
                    </p>
                </FadeIn>

                {/* Role Selector */}
                <FadeIn delay={0.1}>
                    <Card className="max-w-2xl mx-auto border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-center">
                            <div className="relative w-full flex-1">
                                <select 
                                    value={selectedRole} 
                                    onChange={(e) => { setSelectedRole(e.target.value); setRoadmap([]); }}
                                    className="w-full h-12 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer text-zinc-950 dark:text-zinc-50 font-medium"
                                >
                                    <option value="" disabled>Choose your target career...</option>
                                    {JOB_ROLES.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            </div>
                            <Button 
                                size="lg" 
                                onClick={handleGenerate} 
                                disabled={!selectedRole || loading}
                                className="w-full sm:w-auto h-12 px-8 bg-cyan-600 hover:bg-cyan-700 text-white shrink-0 shadow-sm"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" /> Generate Roadmap
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* Roadmap UI */}
                {roadmap.length > 0 && (
                    <StaggerContainer className="mt-16 space-y-10" staggerChildren={0.1}>
                        
                        {/* Timeline Header Navigation */}
                        <div className="relative flex items-center justify-between mx-auto max-w-3xl">
                            {/* Connecting Line */}
                            <div className="absolute left-[10%] right-[10%] top-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 -z-10" />
                            
                            {roadmap.map((phase, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setActivePhase(i)}
                                    className="group relative flex flex-col items-center"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                        i === activePhase 
                                        ? "bg-cyan-600 text-white shadow-md ring-4 ring-cyan-100 dark:ring-cyan-900/40" 
                                        : i < activePhase 
                                            ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300" 
                                            : "bg-white border-2 border-zinc-200 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800"
                                    }`}>
                                        {i < activePhase ? <Check className="w-5 h-5" /> : i + 1}
                                    </div>
                                    <span className={`absolute top-12 whitespace-nowrap text-sm font-semibold transition-colors ${
                                        i === activePhase ? "text-cyan-700 dark:text-cyan-400" : "text-zinc-500 dark:text-zinc-400"
                                    }`}>
                                        {phase.title}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Spacer for absolute positioning layout */}
                        <div className="h-4"></div>

                        {/* Active Phase Content */}
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activePhase} 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6 max-w-4xl mx-auto"
                            >
                                <Card className="border-cyan-100 dark:border-cyan-900 shadow-sm overflow-hidden">
                                    <div className="h-2 w-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                                    <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl text-zinc-950 dark:text-zinc-50">{roadmap[activePhase].title}</CardTitle>
                                            <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 font-semibold px-3 py-1">
                                                <Clock className="w-3.5 h-3.5 mr-1" /> {roadmap[activePhase].duration}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6 md:p-8 space-y-8">
                                        
                                        {/* Goals */}
                                        <section>
                                            <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mb-4 tracking-wide uppercase flex items-center gap-2">
                                                <Target className="w-4 h-4 text-emerald-500" /> Phase Goals
                                            </h3>
                                            <ul className="grid sm:grid-cols-2 gap-3">
                                                {roadmap[activePhase].goals.map(g => (
                                                    <li key={g} className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                        <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">{g}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>

                                        <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800" />

                                        {/* Skills to Learn */}
                                        <section>
                                            <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mb-4 tracking-wide uppercase flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-purple-500" /> Skills to Acquire
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {roadmap[activePhase].skills.map(s => (
                                                    <Badge key={s} variant="outline" className="px-3 py-1.5 bg-white dark:bg-zinc-950 shadow-sm border-zinc-200 dark:border-zinc-700 text-sm font-medium">
                                                        {s}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Recommended Courses */}
                                        <section className="bg-zinc-50 dark:bg-zinc-900/30 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-8 border-t border-zinc-100 dark:border-zinc-800">
                                            <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mb-4 tracking-wide uppercase flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-blue-500" /> Recommended Courses
                                            </h3>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {(roadmap[activePhase].courses.length > 0 ? roadmap[activePhase].courses : COURSES.slice(0, 4)).map(course => (
                                                    <a key={course.id} href={course.url} target="_blank" rel="noopener noreferrer"
                                                        className="group flex flex-col justify-between p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-cyan-500/50 hover:shadow-md transition-all h-full"
                                                    >
                                                        <div>
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors pr-4">{course.title}</h4>
                                                                <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-cyan-500 transition-colors flex-shrink-0" />
                                                            </div>
                                                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{course.platform}</p>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-zinc-400" /> {course.duration}</span>
                                                            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" /> {course.rating}</span>
                                                            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-zinc-400" /> {course.language}</span>
                                                            <span className={`ml-auto px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold ${
                                                                course.price === "Free" 
                                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                                                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                            }`}>
                                                                {course.price}
                                                            </span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </section>

                                    </CardContent>
                                </Card>

                                {/* Next Phase Action */}
                                {activePhase < roadmap.length - 1 ? (
                                    <Button 
                                        onClick={() => setActivePhase(activePhase + 1)}
                                        size="lg"
                                        variant="outline"
                                        className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 group h-14"
                                    >
                                        Proceed to <span className="font-bold ml-1">{roadmap[activePhase + 1].title}</span>
                                        <ChevronRight className="ml-2 w-5 h-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                                    </Button>
                                ) : (
                                    <Button 
                                        size="lg"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white group h-14"
                                    >
                                        <CheckCircle2 className="w-5 h-5 mr-2" /> Mark Roadmap as Completed
                                    </Button>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </StaggerContainer>
                )}
            </div>
        </main>
    );
}
