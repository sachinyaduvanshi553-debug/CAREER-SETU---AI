"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, LayoutDashboard, FileText, Target, Map, Briefcase,
    MessageSquare, BarChart3, User, Menu, X, LogOut, ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Resume", href: "/resume", icon: FileText },
    { label: "Skill Gap", href: "/skills", icon: Target },
    { label: "Roadmap", href: "/roadmap", icon: Map },
    { label: "Jobs", href: "/jobs", icon: Briefcase },
    { label: "Interview", href: "/interview", icon: MessageSquare },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isLanding = pathname === "/";

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isLanding
                        ? "bg-dark-950/90 backdrop-blur-xl border-b border-white/5"
                        : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl object-contain bg-white/5 p-1 group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-300" />
                            <span className="text-xl font-bold font-display text-white">CAREER BRIDGE - AI</span>
                        </Link>

                        {/* Desktop Nav */}
                        {!isLanding && (
                            <div className="hidden lg:flex items-center gap-1">
                                {NAV_ITEMS.map((item) => {
                                    const active = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                                                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                                                    : "text-dark-400 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            {isLanding ? (
                                <>
                                    <Link href="/login" className="btn-secondary text-sm !px-4 !py-2 hidden sm:inline-flex">
                                        Log In
                                    </Link>
                                    <Link href="/register" className="btn-primary text-sm !px-4 !py-2 flex items-center gap-1">
                                        Get Started <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/profile" className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center hover:shadow-lg hover:shadow-primary-500/30 transition-all">
                                        <User className="w-4 h-4 text-white" />
                                    </Link>
                                    <button
                                        className="lg:hidden p-2 text-dark-400 hover:text-white"
                                        onClick={() => setMobileOpen(!mobileOpen)}
                                    >
                                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && !isLanding && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-x-0 top-16 z-40 bg-dark-950/95 backdrop-blur-xl border-b border-white/5 lg:hidden"
                    >
                        <div className="p-4 space-y-1">
                            {NAV_ITEMS.map((item) => {
                                const active = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active
                                                ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                                                : "text-dark-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                            <div className="border-t border-white/5 pt-3 mt-3">
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-dark-400 hover:text-white hover:bg-white/5"
                                >
                                    <User className="w-5 h-5" /> Profile
                                </Link>
                                <Link
                                    href="/"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10"
                                >
                                    <LogOut className="w-5 h-5" /> Log Out
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
