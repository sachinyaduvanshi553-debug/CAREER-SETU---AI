"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, Briefcase, MapPin, Star, Clock, CheckCircle2,
    AlertCircle, User, Volume2, VolumeX, MessageSquare, Camera,
    FileIcon, Upload, X, Phone, Mail, Edit3, Save, ChevronRight,
    Loader2, Plus
} from "lucide-react";
import Link from "next/link";
import { api, BASE_BACKEND_URL } from "@/lib/api";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { useNotify } from "@/components/NotificationProvider";
import { EmptyState, StatusBadge, FadeIn, Spinner } from "@/components/ui";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WorkerDashboard({ user }: { user: any }) {
    const { speak, toggleVoice, isVoiceEnabled, phrases } = useVoiceAssistant();
    const notify = useNotify();
    const [requests, setRequests] = useState<any[]>([]);
    const [workerStats, setWorkerStats] = useState<any>(null);
    const [aadhaar, setAadhaar] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showProfileEditor, setShowProfileEditor] = useState(false);
    const [saving, setSaving] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<"requests" | "portfolio" | "profile">("requests");
    const [profileForm, setProfileForm] = useState({
        skills: [] as string[],
        experience_years: 0,
        service_charges: 0,
        specialty: "",
        description: "",
    });

    const loadData = async () => {
        try {
            const [reqs, profile] = await Promise.all([
                api.getWorkerRequests(),
                api.getWorkerProfile()
            ]);
            setRequests(reqs || []);
            setWorkerStats(profile);
            if (profile && profile.status !== "incomplete") {
                setProfileForm({
                    skills: profile.skills || [],
                    experience_years: profile.experience_years || 0,
                    service_charges: profile.service_charges || 0,
                    specialty: profile.specialty || "",
                    description: profile.description || "",
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            await api.uploadWorkerWork(file);
            const updatedProfile = await api.getWorkerProfile();
            setWorkerStats(updatedProfile);
            notify("success", "Upload Successful", `${file.name} added to your portfolio.`);
        } catch (err: any) {
            notify("error", "Upload Failed", err?.message || "Please try again.");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleAadhaarVerify = async () => {
        if (aadhaar.length !== 12) return;
        setVerifying(true);
        speak(phrases.VERIFY_AADHAAR_PROMPT);
        try {
            await api.verifyAadhaar(aadhaar);
            notify("success", "Identity Verified!", "You can now receive premium job requests.");
            speak(phrases.VERIFY_SUCCESS);
            setTimeout(() => window.location.reload(), 2000);
        } catch (err: any) {
            notify("error", "Verification Failed", err?.message || "Check your Aadhaar number.");
        } finally {
            setVerifying(false);
        }
    };

    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            await api.updateWorkerProfile(profileForm);
            setShowProfileEditor(false);
            const updatedProfile = await api.getWorkerProfile();
            setWorkerStats(updatedProfile);
            notify("success", "Profile Updated", "Your worker profile has been saved.");
        } catch (err: any) {
            notify("error", "Save Failed", err?.message || "Please try again.");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!containerRef.current) return;
        const els = containerRef.current.querySelectorAll(".gsap-reveal");
        gsap.fromTo(els,
            { opacity: 0, y: 30 },
            { 
                opacity: 1, y: 0, 
                stagger: 0.1, duration: 0.8, ease: "power2.out",
                scrollTrigger: { trigger: containerRef.current, start: "top 80%", once: true }
            }
        );
        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    const portfolioItems = workerStats?.work_photos || [];

    return (
        <div className="space-y-8" ref={containerRef}>
            {/* ─── Header ─── */}
            <motion.header
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
            >
                <div className="flex items-center gap-4">
                    <Link href="/" className="w-12 h-12 flex-shrink-0 group">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain transition-transform group-hover:scale-110" />
                    </Link>
                    <div>
                        <p className="text-dark-500 text-[10px] font-mono mb-0.5 uppercase tracking-[0.2em] font-bold">Portal · Worker</p>
                        <h1 className="text-3xl font-bold text-white font-display">
                            Worker <span className="gradient-text">Hub</span>
                        </h1>
                        <p className="text-dark-400 mt-0.5 text-sm">Manage services, verification, and job requests.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowProfileEditor(true)}
                        className="btn-secondary flex items-center gap-2 text-sm !px-5 !py-2.5 shadow-xl shadow-primary-500/5 hover:border-primary-500/30"
                    >
                        <Edit3 className="w-4 h-4 text-primary-400" /> Edit Worker Profile
                    </button>
                </div>
            </motion.header>

            {/* ─── Profile Editor Panel ─── */}
            <AnimatePresence>
                {showProfileEditor && (
                    <motion.section
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="glass-card p-6 border-primary-500/30 bg-primary-500/5 relative overflow-hidden"
                    >
                        <button onClick={() => setShowProfileEditor(false)} className="absolute top-4 right-4 text-dark-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary-400" /> Update Worker Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="text-xs text-dark-300 mb-2 block font-semibold uppercase tracking-wider">Skills (comma-separated)</label>
                                <input
                                    type="text"
                                    value={profileForm.skills.join(", ")}
                                    onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                                    className="input-field"
                                    placeholder="e.g. Electrician, Plumbing, Carpentry"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-dark-300 mb-2 block font-semibold uppercase tracking-wider">Specialty</label>
                                <input
                                    type="text"
                                    value={profileForm.specialty}
                                    onChange={(e) => setProfileForm({ ...profileForm, specialty: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. AC Repair, House Wiring"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-dark-300 mb-2 block font-semibold uppercase tracking-wider">Service Rate (₹/hr)</label>
                                <input
                                    type="number"
                                    value={profileForm.service_charges}
                                    onChange={(e) => setProfileForm({ ...profileForm, service_charges: parseFloat(e.target.value) })}
                                    className="input-field"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-dark-300 mb-2 block font-semibold uppercase tracking-wider">Years of Experience</label>
                                <input
                                    type="number"
                                    value={profileForm.experience_years}
                                    onChange={(e) => setProfileForm({ ...profileForm, experience_years: parseInt(e.target.value) })}
                                    className="input-field"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-dark-300 mb-2 block font-semibold uppercase tracking-wider">About Your Work</label>
                                <textarea
                                    value={profileForm.description}
                                    onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                                    className="input-field resize-none"
                                    rows={2}
                                    placeholder="Describe your expertise and services..."
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleUpdateProfile}
                            disabled={saving}
                            className="btn-primary mt-5 flex items-center gap-2 !px-6"
                        >
                            {saving ? <><Spinner size={16} /> Saving...</> : <><Save className="w-4 h-4" /> Save Profile</>}
                        </button>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* ─── Verification Banner ─── */}
            {!user?.is_verified && !showProfileEditor && (
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gsap-reveal glass-card p-5 border-l-4 border-accent-amber bg-accent-amber/5"
                >
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-accent-amber flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-bold text-white mb-1">Verify Your Identity</h3>
                            <p className="text-sm text-dark-400 mb-4">Complete Aadhaar verification to start receiving job requests.</p>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter 12-digit Aadhaar"
                                    maxLength={12}
                                    value={aadhaar}
                                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                                    className="input-field !py-2 flex-1 font-mono tracking-widest max-w-xs"
                                />
                                <button
                                    onClick={handleAadhaarVerify}
                                    disabled={verifying || aadhaar.length !== 12}
                                    className="btn-primary !px-5 !py-2 text-sm flex items-center gap-2"
                                >
                                    {verifying ? <><Spinner size={14} /> Verifying</> : "Verify Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}

            {user?.is_verified && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="gsap-reveal glass-card px-5 py-3 border-l-4 border-accent-emerald bg-accent-emerald/5 flex items-center gap-3"
                >
                    <CheckCircle2 className="w-5 h-5 text-accent-emerald" />
                    <div>
                        <span className="text-white font-bold text-sm">Identity Verified</span>
                        <span className="text-dark-400 text-xs ml-2">You're eligible for premium job requests</span>
                    </div>
                </motion.div>
            )}

            {/* ─── Main Grid ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Tabs content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 glass-card !rounded-xl w-fit">
                        {(["requests", "portfolio", "profile"] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={activeTab === tab ? "tab-btn-active capitalize" : "tab-btn capitalize"}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ── Job Requests Tab ── */}
                        {activeTab === "requests" && (
                            <motion.div key="requests" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-primary-400" /> Incoming Requests
                                    <span className="ml-1 px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold">{requests.length}</span>
                                </h2>
                                {requests.length === 0 ? (
                                    <EmptyState
                                        icon={Clock}
                                        title="No Requests Yet"
                                        description="Job requests from customers will appear here. Make sure your profile is complete and Aadhaar is verified."
                                    />
                                ) : (
                                    requests.map((req, i) => (
                                        <motion.div
                                            key={req._id || i}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            className="glass-card p-5 hover:border-primary-500/30 transition-all group"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className="tag uppercase">{req.work_type}</span>
                                                        <StatusBadge status={req.status || "pending"} />
                                                        {req.location && (
                                                            <span className="text-xs text-dark-500 flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" /> {req.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-white font-semibold text-sm mb-1">{req.description}</p>
                                                    <p className="text-xs text-dark-500 font-mono">Customer: {req.customer_id?.substring(0, 15)}...</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-accent-emerald">₹{req.budget}</div>
                                                        <div className="text-[10px] text-dark-500 uppercase tracking-wider">Budget</div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => { speak(phrases.ACCEPT_JOB); notify("info", "Job Accepted", "The customer has been notified."); }}
                                                            className="btn-primary !px-4 !py-1.5 text-xs flex items-center gap-1"
                                                        >
                                                            Accept
                                                        </button>
                                                        <Link href="/chat" className="p-2 glass-card !rounded-xl text-dark-400 hover:text-white transition-all">
                                                            <MessageSquare className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {/* ── Portfolio Tab ── */}
                        {activeTab === "portfolio" && (
                            <motion.div key="portfolio" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white">My Portfolio</h2>
                                    <label className={`btn-secondary text-xs !px-4 !py-2 cursor-pointer flex items-center gap-2 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                                        {uploading ? <><Spinner size={14} /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Work</>}
                                        <input type="file" className="hidden" onChange={handlePortfolioUpload} accept="image/*,video/*,.pdf,.doc,.docx" disabled={uploading} />
                                    </label>
                                </div>

                                {portfolioItems.length === 0 ? (
                                    <EmptyState
                                        icon={Camera}
                                        title="Portfolio is Empty"
                                        description="Upload photos, videos, or documents of your work to attract more customers."
                                        action={{
                                            label: "Upload First File",
                                            onClick: () => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()
                                        }}
                                    />
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {portfolioItems.map((url: string, i: number) => {
                                            const isVideo = /\.(mp4|webm|ogg)$/.test(url);
                                            const isDoc = /\.(pdf|doc|docx)$/.test(url);
                                            const src = url.startsWith("http") ? url : `${BASE_BACKEND_URL}${url}`;
                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="aspect-square rounded-xl bg-slate-800 border border-white/5 overflow-hidden flex items-center justify-center relative group"
                                                >
                                                    {isVideo ? (
                                                        <video src={src} className="w-full h-full object-cover" controls />
                                                    ) : isDoc ? (
                                                        <div className="flex flex-col items-center gap-2 text-dark-400 p-4 text-center">
                                                            <FileIcon className="w-10 h-10" />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">Document</span>
                                                            <a href={src} target="_blank" className="text-xs text-primary-400 hover:underline">View →</a>
                                                        </div>
                                                    ) : (
                                                        <img src={src} alt={`Work ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                        {/* Upload more slot */}
                                        <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-primary-500/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
                                            <Plus className="w-6 h-6 text-dark-500 group-hover:text-primary-400 transition-colors" />
                                            <span className="text-[10px] text-dark-500 group-hover:text-dark-300 uppercase tracking-wider">Add More</span>
                                            <input type="file" className="hidden" onChange={handlePortfolioUpload} accept="image/*,video/*,.pdf,.doc,.docx" disabled={uploading} />
                                        </label>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* ── Quick Stats Tab ── */}
                        {activeTab === "profile" && (
                            <motion.div key="profile-stats" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                                <h2 className="text-xl font-bold text-white">Profile Overview</h2>
                                <div className="glass-card p-6 space-y-4">
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-dark-400">Full Name</span>
                                        <span className="text-white font-semibold">{user?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-dark-400">Email</span>
                                        <span className="text-white font-mono text-xs">{user?.email}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-dark-400">Phone</span>
                                        <span className="text-white">{user?.phone || "Not set"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-dark-400">Location</span>
                                        <span className="text-white">{user?.location || "Not set"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-dark-400">Experience</span>
                                        <span className="text-white font-bold">{workerStats?.experience_years || 0} Years</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-dark-400">Rate</span>
                                        <span className="text-accent-emerald font-bold">₹{workerStats?.service_charges || 0}/hr</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-dark-400">Identity Status</span>
                                        <StatusBadge status={user?.is_verified ? "verified" : "unverified"} />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(workerStats?.skills || user?.skills || []).map((s: string) => (
                                        <span key={s} className="tag">{s}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => { setShowProfileEditor(true); setActiveTab("requests"); }}
                                    className="btn-secondary text-sm flex items-center gap-2"
                                >
                                    <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ─── Sidebar ─── */}
                <div className="space-y-6">
                    {/* Profile card */}
                    <motion.section className="glass-card p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-amber/40 to-orange-600/40 border border-accent-amber/20 flex items-center justify-center text-2xl font-bold text-white overflow-hidden flex-shrink-0">
                                {user?.profile_photo
                                    ? <img src={user.profile_photo} alt="avatar" className="w-full h-full object-cover" />
                                    : user?.name?.[0]?.toUpperCase()
                                }
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                                <div className="flex items-center gap-1 text-accent-amber">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-bold">{workerStats?.rating || "0.0"}</span>
                                    <span className="text-xs text-dark-400">({workerStats?.total_reviews || 0})</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-white/5">
                            {[
                                { label: "Status", value: workerStats?.availability ? "Available" : "Busy", color: workerStats?.availability ? "text-accent-emerald" : "text-red-400" },
                                { label: "Experience", value: `${workerStats?.experience_years || 0} Years`, color: "text-white" },
                                { label: "Rate", value: `₹${workerStats?.service_charges || 0}/hr`, color: "text-white" },
                                { label: "Earnings", value: `₹${workerStats?.total_earnings || 0}`, color: "text-accent-emerald" },
                                { label: "Jobs Done", value: workerStats?.completed_jobs_count || 0, color: "text-accent-cyan" },
                            ].map(item => (
                                <div key={item.label} className="flex justify-between items-center text-sm">
                                    <span className="text-dark-400">{item.label}</span>
                                    <span className={`font-bold text-xs uppercase tracking-wider ${item.color}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Quick Links */}
                    <motion.section className="glass-card p-5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Quick Links</h3>
                        <div className="space-y-2">
                            {[
                                { label: "Chat with Customers", href: "/chat", icon: MessageSquare },
                                { label: "View Profile Page", href: "/profile", icon: User },
                            ].map(link => (
                                <Link key={link.href} href={link.href}
                                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all text-dark-400 hover:text-white group"
                                >
                                    <link.icon className="w-4 h-4 group-hover:text-primary-400 transition-colors" />
                                    <span className="text-sm">{link.label}</span>
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </div>
        </div>
    );
}
