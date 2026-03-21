"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import ProfessionalDashboard from "@/components/dashboards/ProfessionalDashboard";
import WorkerDashboard from "@/components/dashboards/WorkerDashboard";
import CustomerDashboard from "@/components/dashboards/CustomerDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const profile = await api.getProfile();
                setUser(profile);
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20 min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-zinc-950 dark:text-white mb-4">You are not logged in</h2>
                <Link href="/login">
                    <Button>Go to Login</Button>
                </Link>
            </div>
        );
    }

    // Dispatcher
    switch (user.role) {
        case "worker":
            return <WorkerDashboard user={user} />;
        case "customer":
            return <CustomerDashboard user={user} />;
        case "admin":
            return <AdminDashboard user={user} />;
        case "professional":
        default:
            return <ProfessionalDashboard user={user} />;
    }
}
