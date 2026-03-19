"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                router.push("/dashboard");
            } else {
                setError(data.detail || "Login failed");
                setLoading(false);
            }
        } catch (err) {
            setError("Server error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-hero-glow" />
            <div className="absolute top-1/3 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/3 -right-40 w-80 h-80 bg-accent-purple/10 rounded-full blur-[100px]" />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold font-display text-white">SkillBridge AI</span>
                    </Link>
                    <h1 className="text-2xl font-bold font-display text-white">Welcome Back</h1>
                    <p className="text-dark-400 text-sm mt-2">Sign in to continue your career journey</p>
                </div>

                <div className="glass-card p-8">
                    {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-xl">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm text-dark-300 mb-2 block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                <input type="email" placeholder="you@example.com" required
                                    className="input-field !pl-11"
                                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-dark-300 mb-2 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                <input type={show ? "text" : "password"} placeholder="••••••••" required
                                    className="input-field !pl-11 !pr-11"
                                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                                <button type="button" onClick={() => setShow(!show)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                                >
                                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-dark-400">
                                <input type="checkbox" className="rounded border-dark-600 bg-dark-800" />
                                Remember me
                            </label>
                            <a href="#" className="text-primary-400 hover:text-primary-300">Forgot password?</a>
                        </div>
                        <button type="submit" disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 disabled:opacity-50"
                        >
                            {loading ? <div className="loader !w-5 !h-5" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-dark-400">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium">Create one free</Link>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
