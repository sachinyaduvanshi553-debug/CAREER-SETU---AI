"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { 
  LayoutDashboard, User, Briefcase, MessageSquare, 
  LogOut, ShieldCheck, Search, Bell 
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        async function checkAuth() {
            try {
                const profile = await api.getProfile();
                setUser(profile);
            } catch (err) {
                console.error("Auth check failed", err);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
            </div>
        );
    }

    const menuItems = [
        { label: "Overview", icon: LayoutDashboard, href: "/dashboard", roles: ["all"] },
        { label: "Profile", icon: User, href: "/profile", roles: ["all"] },
        { label: "Marketplace", icon: Search, href: "/dashboard/customer", roles: ["customer", "admin"] },
        { label: "Work Requests", icon: Briefcase, href: "/dashboard/worker", roles: ["worker", "admin"] },
        { label: "Job Matching", icon: Briefcase, href: "/jobs", roles: ["professional", "admin"] },
        { label: "Chat", icon: MessageSquare, href: "/dashboard/chat", roles: ["all"] },
        { label: "Admin Panel", icon: ShieldCheck, href: "/dashboard/admin", roles: ["admin"] },
    ];

    const filteredMenu = menuItems.filter(item => 
        item.roles.includes("all") || item.roles.includes(user?.role || "professional")
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">C</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">CAREER BRIDGE</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {filteredMenu.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.label} 
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group text-sm font-medium",
                                    isActive 
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" 
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300")} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                    <ThemeToggle className="w-full justify-center" />
                    <button 
                        onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}
                        className="flex items-center gap-3 px-3 py-2 w-full text-zinc-600 hover:text-red-600 hover:bg-red-50 dark:text-zinc-400 dark:hover:text-red-400 dark:hover:bg-red-950/50 rounded-lg transition-colors group text-sm font-medium"
                    >
                        <LogOut className="w-5 h-5 text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <ThemeToggle className="md:hidden" />
                        <h2 className="text-lg font-semibold text-zinc-950 dark:text-white capitalize">{user?.role} Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-zinc-950"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-zinc-950 dark:text-white">{user?.name || "User"}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tracking-tighter uppercase">{user?.role}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-50 dark:bg-zinc-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
