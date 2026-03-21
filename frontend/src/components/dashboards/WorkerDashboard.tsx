"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Briefcase, MapPin, Star, Clock, CheckCircle2, AlertCircle, ChevronRight, User, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { Input } from "@/components/ui/input";

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
            window.location.reload(); 
        } catch (err) {
            alert("Verification failed: " + err);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <StaggerContainer className="space-y-8 max-w-6xl mx-auto" staggerChildren={0.1}>
            <StaggerItem>
                <header className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        Worker Hub
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Manage your service requests, track earnings, and complete your verification.</p>
                </header>
            </StaggerItem>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Aadhaar Verification Section */}
                    {!user.is_verified && (
                        <StaggerItem>
                            <Card className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                                            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                                        </div>
                                        <div className="flex-1 w-full mt-1">
                                            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-50 mb-1">Verification Required</h3>
                                            <p className="text-sm text-amber-700 dark:text-amber-400 mb-5 leading-relaxed">
                                                To build trust with customers and start accepting job requests, please verify your identity using your 12-digit Aadhaar number.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Input 
                                                    type="text" 
                                                    placeholder="XXXX XXXX XXXX" 
                                                    value={aadhaar}
                                                    onChange={(e) => setAadhaar(e.target.value)}
                                                    className="flex-1 font-mono tracking-widest bg-white dark:bg-zinc-900 border-amber-200 dark:border-amber-800 focus:ring-amber-500"
                                                />
                                                <Button 
                                                    onClick={handleAadhaarVerify}
                                                    disabled={verifying || aadhaar.length !== 12}
                                                    className="bg-amber-500 hover:bg-amber-600 text-white shrink-0 shadow-sm h-11 px-6"
                                                >
                                                    {verifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                                                    {verifying ? "Verifying..." : "Verify Now"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    )}

                    {user.is_verified && (
                        <StaggerItem>
                            <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-50">Identity Verified</h3>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-400">You are eligible to receive premium job requests in your locality.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    )}

                    {/* Job Requests */}
                    <StaggerItem>
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-emerald-500" /> Incoming Job Requests
                                </h2>
                                <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800">
                                    {requests.length} New
                                </Badge>
                            </div>
                            
                            <div className="space-y-4">
                                {requests.length === 0 ? (
                                    <Card className="border-dashed border-2 text-center p-12 bg-transparent shadow-none">
                                        <Clock className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No active requests</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">New job requests will appear here when customers near you need your services.</p>
                                    </Card>
                                ) : (
                                    requests.map((req, i) => (
                                        <Card key={i} className="group hover:border-emerald-500/50 hover:shadow-md transition-all">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-200 uppercase tracking-widest text-[10px] font-bold border-0">
                                                                {req.work_type}
                                                            </Badge>
                                                            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                                                                <MapPin className="w-3 h-3" /> {req.location}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-zinc-950 dark:text-zinc-50 font-bold text-lg mb-1.5 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                            {req.description}
                                                        </h4>
                                                        <p className="text-xs text-zinc-500 font-mono">
                                                            Req ID: {req.customer_id.substring(0, 8).toUpperCase()}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col md:items-end justify-between min-w-[120px] gap-4">
                                                        <div className="md:text-right">
                                                            <div className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                                                                ₹{req.budget}
                                                            </div>
                                                            <div className="text-xs text-zinc-500 font-medium">Estimated Budget</div>
                                                        </div>
                                                        <Button className="w-full md:w-auto bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 hover:text-emerald-600 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-emerald-400 transition-colors shadow-sm">
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </section>
                    </StaggerItem>
                </div>

                <div className="space-y-8">
                    <StaggerItem>
                        <Card className="overflow-hidden">
                            <div className="h-24 bg-gradient-to-br from-emerald-500 to-teal-600 w-full" />
                            <CardContent className="p-6 relative pt-0">
                                <div className="flex flex-col items-center -mt-12 mb-6">
                                    <div className="w-24 h-24 rounded-full bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-950 flex items-center justify-center text-4xl font-bold text-emerald-600 dark:text-emerald-500 shadow-md">
                                        {user.name?.[0]}
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mt-3">{user.name}</h3>
                                    <div className="flex items-center gap-1 text-amber-500 mt-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-bold">4.8</span>
                                        <span className="text-xs text-amber-700 dark:text-amber-400 ml-1 font-medium">(24 Reviews)</span>
                                    </div>
                                </div>
                                 <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                                        <span className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Status</span>
                                        <Badge variant="success" className="px-2 py-0.5 text-xs">Available</Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-sm p-2">
                                        <span className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Experience</span>
                                        <span className="text-zinc-950 dark:text-zinc-50 font-bold">{workerStats?.experience_years || 0} Years</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                                        <span className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Jobs Completed</span>
                                        <span className="text-zinc-950 dark:text-zinc-50 font-bold">{workerStats?.completed_jobs_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm p-2">
                                        <span className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Total Earnings</span>
                                        <span className="text-emerald-600 dark:text-emerald-500 font-bold text-base tracking-tight">₹{workerStats?.total_earnings || "0"}</span>
                                    </div>
                                 </div>
                            </CardContent>
                        </Card>
                    </StaggerItem>
                </div>
            </div>
        </StaggerContainer>
    );
}
