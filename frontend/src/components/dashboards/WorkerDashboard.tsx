"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Briefcase, MapPin, Star, Clock, CheckCircle2, AlertCircle, ChevronRight, User } from "lucide-react";
import { api } from "@/lib/api";

export default function WorkerDashboard({ user }: { user: any }) {
    const [requests, setRequests] = useState<any[]>([]);
    const [workerStats, setWorkerStats] = useState<any>(null);
    const [aadhaar, setAadhaar] = useState("");
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [reqs, stats] = await Promise.all([
                    api.getWorkerRequests(),
                    api.getWorkerProfile()
                ]);
                setRequests(reqs);
                setWorkerStats(stats);
            } catch (err) { console.error(err); }
        }
        loadData();
    }, []);

    const handleAadhaarVerify = async () => {
        setVerifying(true);
        try {
            await api.verifyAadhaar(aadhaar);
            window.location.reload(); // Refresh to update status
        } catch (err) {
            alert("Verification failed: " + err);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white uppercase italic tracking-wider">Worker Hub</h1>
                <p className="text-dark-400 mt-2 tracking-tight font-medium">Manage your services, verification, and job requests in one place.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Aadhaar Verification Section */}
                    {!user.is_verified && (
                        <section className="glass-card p-6 border-l-4 border-accent-amber bg-accent-amber/5">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-accent-amber flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2 underline underline-offset-4 decoration-accent-amber/30">Verification Required</h3>
                                    <p className="text-sm text-dark-300 mb-6 font-medium leading-relaxed">To start accepting job requests, please verify your identity using your 12-digit Aadhaar number.</p>
                                    <div className="flex gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="XXXX XXXX XXXX" 
                                            value={aadhaar}
                                            onChange={(e) => setAadhaar(e.target.value)}
                                            className="bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1 font-mono tracking-widest"
                                        />
                                        <button 
                                            onClick={handleAadhaarVerify}
                                            disabled={verifying || aadhaar.length !== 12}
                                            className="btn-primary"
                                        >
                                            {verifying ? "Verifying..." : "Verify Now"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {user.is_verified && (
                        <section className="glass-card p-6 border-l-4 border-accent-emerald bg-accent-emerald/5">
                            <div className="flex items-center gap-4">
                                <CheckCircle2 className="w-8 h-8 text-accent-emerald" />
                                <div>
                                    <h3 className="text-lg font-bold text-white">Identity Verified</h3>
                                    <p className="text-sm text-dark-300 font-medium">You are eligible to receive premium job requests in your locality.</p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Job Requests */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                             <Briefcase className="w-6 h-6 text-primary-400" /> Incoming Requests
                        </h2>
                        <div className="space-y-4">
                            {requests.length === 0 ? (
                                <div className="glass-card p-12 text-center">
                                    <Clock className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                                    <p className="text-dark-400 font-medium">No new requests at the moment. Stay tuned!</p>
                                </div>
                            ) : (
                                requests.map((req, i) => (
                                    <div key={i} className="glass-card p-6 hover:bg-white/5 transition-colors group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 text-xs font-bold uppercase tracking-widest">{req.work_type}</span>
                                                    <span className="text-xs text-dark-500 flex items-center gap-1 font-medium"><MapPin className="w-3 h-3" /> {req.location}</span>
                                                </div>
                                                <h4 className="text-white font-bold text-lg mb-1 leading-tight">{req.description}</h4>
                                                <p className="text-xs text-dark-500 tracking-tight font-medium uppercase font-mono">Posted by Customer ID: {req.customer_id.substring(0, 8)}...</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-accent-emerald">₹{req.budget}</div>
                                                    <div className="text-xs text-dark-400 font-medium uppercase opacity-60">Estimated Budget</div>
                                                </div>
                                                <button className="btn-secondary group-hover:bg-primary-600 group-hover:text-white transition-all">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="glass-card p-6">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-primary-500/50 flex items-center justify-center text-2xl font-bold text-primary-400">
                                {user.name?.[0]}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-wide">{user.name}</h3>
                                <div className="flex items-center gap-1 text-accent-amber mt-1">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-bold">4.8</span>
                                    <span className="text-xs text-dark-400 font-medium ml-1 underline decoration-dark-400/30">(24 Reviews)</span>
                                </div>
                            </div>
                         </div>
                         <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400 font-medium tracking-tight">Status</span>
                                <span className="text-accent-emerald font-bold uppercase tracking-wider text-xs">Available</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400 font-medium tracking-tight">Experience</span>
                                <span className="text-white font-bold opacity-80 uppercase text-xs tracking-wider">{workerStats?.experience_years || 0} Years</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400 font-medium tracking-tight">Jobs Completed</span>
                                <span className="text-white font-bold opacity-80 uppercase text-xs tracking-wider">{workerStats?.completed_jobs_count || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400 font-medium tracking-tight">Total Earnings</span>
                                <span className="text-accent-emerald font-bold uppercase text-xs tracking-wider">₹{workerStats?.total_earnings || 0}</span>
                            </div>
                         </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
