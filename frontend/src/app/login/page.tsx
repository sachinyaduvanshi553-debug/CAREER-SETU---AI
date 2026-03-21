"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/animations/FadeIn";

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
            const data = await api.login(form);
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center relative bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400 blur-[120px] rounded-full" />
            </div>

            <FadeIn className="relative z-10 w-full max-w-md mx-4">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center p-1 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                             <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">CAREER BRIDGE</span>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Welcome Back</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Please enter your details to sign in.</p>
                </div>

                <Card className="shadow-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden backdrop-blur-sm">
                    <CardContent className="p-8">
                        {error && (
                            <div className="p-4 mb-6 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest ml-0.5">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input 
                                        type="email" 
                                        placeholder="you@example.com" 
                                        required
                                        className="pl-10 h-12 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-950 transition-all text-[15px] font-medium"
                                        value={form.email} 
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-0.5">
                                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest">Password</label>
                                    <a href="#" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input 
                                        type={show ? "text" : "password"} 
                                        placeholder="••••••••" 
                                        required
                                        className="px-10 h-12 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-950 transition-all text-[15px] font-medium"
                                        value={form.password} 
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShow(!show)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                    >
                                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-1">
                                <input 
                                    type="checkbox" 
                                    id="remember"
                                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" 
                                />
                                <label htmlFor="remember" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 cursor-pointer">
                                    Remember my session?
                                </label>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-12 text-[15px] font-bold tracking-wide shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
                                Create one free
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </FadeIn>
        </main>
    );
}
