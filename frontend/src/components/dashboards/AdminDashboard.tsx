"use client";
import React, { useState, useEffect } from "react";
import { ShieldCheck, Users, CheckCircle2, XCircle, TrendingUp, Activity, BarChart3, AlertCircle, Search, MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { Input } from "@/components/ui/input";

export default function AdminDashboard({ user }: { user: any }) {
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadAdminData() {
            try {
                const [u, s] = await Promise.all([api.getAdminUsers(), api.getAdminStats()]);
                setUsers(u);
                setStats(s);
            } catch (err) { console.error(err); }
        }
        loadAdminData();
    }, []);

    const handleVerify = async (email: string, status: boolean) => {
        try {
            await api.verifyUser(email, status);
            setUsers(prev => prev.map(u => u.email === email ? { ...u, is_verified: status } : u));
        } catch (err) { alert(err); }
    };

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    return (
        <StaggerContainer className="space-y-8 max-w-7xl mx-auto" staggerChildren={0.1}>
            <StaggerItem>
                <header className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            System Administration
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Platform Health, Governance & User Management</p>
                    </div>
                    <div className="flex gap-3">
                         <Button variant="outline" className="bg-white dark:bg-zinc-950 shadow-sm border-zinc-200 dark:border-zinc-800">
                             Download Report
                         </Button>
                    </div>
                </header>
            </StaggerItem>

            {/* Stats Overview */}
            <StaggerItem>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { label: "Total Users", value: stats?.total_users || 0, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
                        { label: "Active Jobs", value: stats?.active_requests || 0, icon: Activity, color: "text-amber-600 dark:text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
                        { label: "Completed", value: stats?.completed_jobs || 0, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
                        { label: "Revenue", value: `₹${stats?.revenue || 0}`, icon: TrendingUp, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
                    ].map((s, i) => (
                        <Card key={i} className="shadow-sm border-zinc-200 dark:border-zinc-800">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{s.label}</div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.bg}`}>
                                        <s.icon className={`w-4 h-4 ${s.color}`} />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">{s.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </StaggerItem>

            <StaggerItem className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2 tracking-tight">
                            <Users className="w-5 h-5 text-indigo-500" /> User Directory
                        </h2>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input 
                                type="text" 
                                placeholder="Search users by name or email..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 h-10 bg-white dark:bg-zinc-950 shadow-sm border-zinc-200 dark:border-zinc-800"
                            />
                        </div>
                    </div>

                    <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Verification</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                                                No users found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((u, i) => (
                                            <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                                        {u.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">{u.name}</div>
                                                        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{u.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={u.role === 'admin' ? 'destructive' : 'secondary'} className={`uppercase text-[10px] tracking-widest ${u.role !== 'admin' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : ''}`}>
                                                        {u.role}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="border-0 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 uppercase tracking-widest text-[10px]">
                                                        Active
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {u.is_verified ? (
                                                            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 text-xs font-bold">
                                                                <CheckCircle2 className="w-4 h-4" /> Verified
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 text-xs font-bold">
                                                                <AlertCircle className="w-4 h-4" /> Pending
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {!u.is_verified ? (
                                                            <Button 
                                                                onClick={() => handleVerify(u.email, true)}
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                                                            >
                                                                <UserCheck className="w-4 h-4 mr-1.5" /> Approve
                                                            </Button>
                                                        ) : (
                                                            <Button 
                                                                onClick={() => handleVerify(u.email, false)}
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30"
                                                            >
                                                                <UserX className="w-4 h-4 mr-1.5" /> Revoke
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </StaggerItem>
        </StaggerContainer>
    );
}
