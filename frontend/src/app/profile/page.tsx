"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import {
    User, MapPin, GraduationCap, Mail, Save, Edit3, Sparkles,
    Target, Award, BookOpen, Briefcase, Camera, Plus, ChevronRight,
    CircleDashed, Github, Globe, Linkedin, Twitter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";

export default function ProfilePage() {
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Sachin Sharma",
        email: "sachin@example.com",
        location: "Bangalore, Karnataka",
        education: "Bachelor's Degree",
        bio: "Aspiring full-stack developer passionate about building impactful products for India. Focused on AI-driven career growth and skill development.",
        skills: ["React", "JavaScript", "HTML5", "CSS3", "Node.js", "Python", "Git", "MongoDB"],
        interests: ["Technology", "Data Science", "Business"],
    });

    const stats = [
        { label: "Career Score", value: "72", icon: Target, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Skills", value: "8", icon: Sparkles, color: "text-indigo-600", bg: "bg-indigo-100" },
        { label: "Courses Active", value: "3", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-100" },
        { label: "Interviews Done", value: "5", icon: Award, color: "text-rose-600", bg: "bg-rose-100" },
    ];

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />
            
            {/* Profile Header / Banner */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden pt-28">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Floating accents */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20 relative z-10">
                <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8" staggerChildren={0.1}>
                    
                    {/* Sidebar / Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <StaggerItem>
                            <Card className="shadow-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                                <CardContent className="p-8 text-center pt-10">
                                    <div className="relative inline-block group mb-6">
                                        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
                                            <div className="w-full h-full rounded-[20px] bg-white dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
                                                <span className="text-4xl font-black text-blue-600 dark:text-blue-400">{profile.name.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 border-4 border-white dark:border-zinc-900 flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all">
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">{profile.name}</h2>
                                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Full-Stack Developer</p>
                                    </div>

                                    <div className="mt-8 flex items-center justify-center gap-4">
                                        {[Twitter, Linkedin, Github, Globe].map((Icon, i) => (
                                            <a key={i} href="#" className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-blue-600 hover:border-blue-500/50 hover:shadow-md transition-all">
                                                <Icon className="w-4 h-4" />
                                            </a>
                                        ))}
                                    </div>
                                    
                                    <Button className="w-full mt-8 h-12 font-bold shadow-lg shadow-blue-500/10 active:scale-95 transition-all">
                                        Complete Profile <CircleDashed className="ml-2 w-4 h-4 animate-spin" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </StaggerItem>

                        <StaggerItem>
                            <Card className="shadow-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400">Personal Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5 p-6 pt-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</p>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{profile.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{profile.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                                            <GraduationCap className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Education</p>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{profile.education}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    </div>

                    {/* Main Content Area / Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Stats */}
                        <StaggerItem>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {stats.map((s, i) => (
                                    <Card key={s.label} className="shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden relative group">
                                         <div className={`h-1 w-full ${s.bg.replace('bg-', 'bg-')}-500 opacity-40 group-hover:opacity-100 transition-opacity absolute top-0`} />
                                         <CardContent className="p-4 text-center">
                                            <div className="text-2xl font-black text-zinc-950 dark:text-zinc-50 tracking-tighter">{s.value}</div>
                                            <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">{s.label}</div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </StaggerItem>

                        {/* About Me Card */}
                        <StaggerItem>
                            <Card className="shadow-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-full">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-50 dark:border-zinc-800/50 pb-4">
                                    <div>
                                        <CardTitle className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Career Story</CardTitle>
                                        <CardDescription className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Short professional biography</CardDescription>
                                    </div>
                                    <Button 
                                        onClick={() => setEditing(!editing)}
                                        variant={editing ? "default" : "secondary"}
                                        className={`h-10 px-4 font-bold ${editing ? 'bg-blue-600 shadow-blue-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'}`}
                                    >
                                        {editing ? <><Save className="w-3.5 h-3.5 mr-2" /> Save</> : <><Edit3 className="w-3.5 h-3.5 mr-2" /> Edit</>}
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <AnimatePresence mode="wait">
                                        {editing ? (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Display Name</label>
                                                        <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="h-11 bg-zinc-50 dark:bg-zinc-950 font-medium" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Current Base</label>
                                                        <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="h-11 bg-zinc-50 dark:bg-zinc-950 font-medium" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Professional Bio</label>
                                                    <textarea 
                                                        value={profile.bio} 
                                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
                                                        rows={4}
                                                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 block"
                                                    />
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed italic">
                                                &ldquo;{profile.bio}&rdquo;
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </StaggerItem>

                        {/* Expertise & Interests */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StaggerItem>
                                <Card className="shadow-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-full">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Proven Expertise</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-2">
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills.map(s => (
                                                <Badge key={s} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50 font-bold px-3 py-1 text-[11px] uppercase tracking-wider rounded-lg shadow-sm">
                                                    {s}
                                                </Badge>
                                            ))}
                                            <button className="h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-500 transition-all">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </StaggerItem>

                            <StaggerItem>
                                <Card className="shadow-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-full">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Industry Interests</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-2">
                                        <div className="flex flex-wrap gap-2">
                                            {profile.interests.map(i => (
                                                <Badge key={i} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-0 font-bold px-3 py-1 text-[11px] uppercase tracking-wider rounded-lg">
                                                    {i}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </StaggerItem>
                        </div>

                        {/* Quick Insights / Tools */}
                        <StaggerItem>
                            <Card className="shadow-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                                <CardHeader className="bg-zinc-50/50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-800 px-8 py-6">
                                    <CardTitle className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Career Toolkit</CardTitle>
                                    <CardDescription className="font-medium">Direct access to our most powerful AI analysis tools</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-2">
                                        {[
                                            { label: "Skill Gap Analysis", desc: "Detailed breakdown of missing competencies", href: "/skills", icon: Target, color: "text-blue-600" },
                                            { label: "Resume Optimizer", desc: "AI-powered feedback on your CV", href: "/resume", icon: Briefcase, color: "text-emerald-600" },
                                            { label: "Learning Roadmap", desc: "Your personalized educational journey", href: "/roadmap", icon: BookOpen, color: "text-indigo-600" },
                                            { label: "Mock Interviews", desc: "Real-time AI behavioral practice", href: "/interview", icon: Award, color: "text-rose-600" },
                                        ].map((link, i) => (
                                            <a key={link.href} href={link.href}
                                                className={`group p-8 flex items-start gap-4 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-950 border-zinc-100 dark:border-zinc-800/50 ${i % 2 === 0 ? 'sm:border-r' : ''} ${i < 2 ? 'border-b' : ''}`}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all`}>
                                                    <link.icon className={`w-5 h-5 ${link.color}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors tracking-tight">{link.label}</h4>
                                                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                    <p className="text-xs font-semibold text-zinc-400 mt-1 leading-relaxed">{link.desc}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    </div>

                </StaggerContainer>
            </div>
        </main>
    );
}
