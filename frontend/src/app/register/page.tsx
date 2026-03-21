"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, User, MapPin, Eye, EyeOff, ArrowRight, GraduationCap, Phone, CheckCircle2 } from "lucide-react";
import { SKILLS_DATABASE } from "@/lib/data";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/FadeIn";

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}

const INTERESTS = ["Technology", "Data Science", "Design", "Marketing", "Business", "Blue-Collar Skills", "Healthcare", "Finance"];

export default function RegisterPage() {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [form, setForm] = useState({
        name: "", email: "", phone: "", password: "", location: "", education: "",
        selectedSkills: [] as string[], interests: [] as string[], otp: "", role: "professional"
    });

    const toggleSkill = (skill: string) => {
        setForm(prev => ({
            ...prev,
            selectedSkills: prev.selectedSkills.includes(skill)
                ? prev.selectedSkills.filter(s => s !== skill)
                : [...prev.selectedSkills, skill]
        }));
    };

    const toggleInterest = (interest: string) => {
        setForm(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) { setStep(step + 1); return; }
        if (step === 3) {
            setLoading(true);
            setError("");
            try {
                if (!window.recaptchaVerifier) {
                    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
                }
                const appVerifier = window.recaptchaVerifier;
                const phoneNumber = form.phone.startsWith('+') ? form.phone : `+91${form.phone}`;
                const confResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
                setConfirmationResult(confResult);
                setStep(4);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to send OTP. Ensure number is valid with country code.");
            } finally { setLoading(false); }
            return;
        }

        setLoading(true);
        setError("");
        try {
            if (!confirmationResult && form.otp === "123567") {
                const payload = { ...form, skills: form.selectedSkills, otp: "123567" };
                await api.register(payload);
                router.push("/login");
                return;
            }
            if (!confirmationResult) throw new Error("No confirmation result. Try again.");
            const result = await confirmationResult.confirm(form.otp);
            const user = result.user;
            const idToken = await user.getIdToken();
            const payload = { ...form, skills: form.selectedSkills, otp: idToken };
            await api.register(payload);
            router.push("/login");
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
            setLoading(false);
        }
    };

    const steps = [
        { title: "Account", desc: "Basic details" },
        { title: "Expertise", desc: "Your skills" },
        { title: "Interests", desc: "Career goals" },
        { title: "Verify", desc: "Security check" }
    ];

    return (
        <main className="min-h-screen flex items-center justify-center relative bg-zinc-50 dark:bg-zinc-950 overflow-hidden py-12">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 blur-[130px] rounded-full" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] bg-indigo-300 blur-[130px] rounded-full" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-xl mx-4">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center p-1 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                             <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">CAREER BRIDGE</span>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Create your account</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Empowering your career with AI-driven insights.</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between mb-8 px-4 relative">
                    <div className="absolute top-[18px] left-10 right-10 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />
                    <div className="absolute top-[18px] left-10 h-0.5 bg-blue-600 transition-all duration-500 -z-0" style={{ width: `${((step - 1) / (steps.length - 1)) * 80}%` }} />
                    
                    {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 relative z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300 ${
                                step > i + 1 ? 'bg-blue-600 text-white' : 
                                step === i + 1 ? 'bg-white dark:bg-zinc-900 border-2 border-blue-600 text-blue-600' : 
                                'bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent text-zinc-400'
                            }`}>
                                {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                            </div>
                            <div className="hidden sm:block text-center">
                                <p className={`text-[11px] font-bold uppercase tracking-wider ${step === i + 1 ? 'text-blue-600' : 'text-zinc-400 dark:text-zinc-500'}`}>{s.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Card className="shadow-2xl border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    <CardContent className="p-8">
                        {error && (
                            <div className="p-4 mb-6 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <div className="grid grid-cols-3 gap-2">
                                            {['professional', 'worker', 'customer'].map(r => (
                                                <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                                                    className={`py-3 px-1 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${form.role === r ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-blue-300 dark:hover:border-blue-900'}`}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                                    <Input placeholder="John Doe" required className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:bg-white" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                                    <Input type="email" placeholder="john@example.com" required className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Phone</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                                    <Input type="tel" placeholder="+91 9876543210" required className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Password</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                                    <Input type={show ? "text" : "password"} placeholder="••••••••" required className="px-10 h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-blue-500 transition-all font-bold text-xs uppercase px-2">
                                                        {show ? "Hide" : "Show"}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Location</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                                    <Input placeholder="City, State" required className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Education</label>
                                                <div className="relative group">
                                                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                                    <select required className="flex h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50 dark:bg-zinc-950 px-10 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none font-medium" value={form.education} onChange={e => setForm({ ...form, education: e.target.value })}>
                                                        <option value="">Select Level</option>
                                                        <option value="10th">10th Pass</option>
                                                        <option value="12th">12th Pass</option>
                                                        <option value="diploma">Diploma</option>
                                                        <option value="bachelor">Bachelor&apos;s Degree</option>
                                                        <option value="master">Master&apos;s Degree</option>
                                                        <option value="phd">PhD</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-4 px-1 italic">Select your top skills from our database:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {Object.entries(SKILLS_DATABASE).map(([cat, skills]) => (
                                                <div key={cat} className="space-y-2">
                                                    <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3">{cat}</h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {skills.map(skill => (
                                                            <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${form.selectedSkills.includes(skill)
                                                                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                                                                    : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-blue-300 dark:hover:border-blue-900"
                                                                }`}
                                                            >
                                                                {skill}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-6 px-1 italic">What areas are you most passionate about?</p>
                                        <div className="grid grid-cols-2 gap-3 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                                            {INTERESTS.map(interest => (
                                                <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                                                    className={`p-4 rounded-xl text-xs font-bold text-left transition-all border ${form.interests.includes(interest)
                                                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-400 shadow-sm"
                                                        : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-blue-300 dark:hover:border-blue-900"
                                                    }`}
                                                >
                                                    {interest}
                                                </button>
                                            ))}
                                        </div>
                                        <div id="recaptcha-container"></div>
                                        <p className="text-xs text-zinc-500 text-center">We will send a verification code to {form.phone}</p>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center py-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mb-2">Verify Phone</h3>
                                            <p className="text-sm text-zinc-500 font-medium">We sent a 6-digit code to <span className="text-blue-600 font-bold">{form.phone}</span></p>
                                        </div>
                                        <div className="max-w-[280px] mx-auto space-y-4">
                                            <Input type="text" placeholder="000000" maxLength={6} required 
                                                className="text-center tracking-[0.5em] text-3xl h-16 bg-zinc-100 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-950 transition-all font-bold"
                                                value={form.otp} onChange={e => setForm({ ...form, otp: e.target.value })} 
                                            />
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Code expires in 5 minutes</p>
                                        </div>
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                            <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Testing mode enabled. Use <span className="font-bold underline">123567</span> if needed.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                {step > 1 && (
                                    <Button variant="outline" type="button" onClick={() => setStep(step - 1)} className="flex-1 h-12 font-bold shadow-sm" disabled={loading}>Back</Button>
                                )}
                                <Button type="submit" disabled={loading} className="flex-1 h-12 font-bold shadow-lg shadow-blue-500/10 active:scale-95 transition-all">
                                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <> {step === 4 ? "Complete Setup" : step === 3 ? "Secure Verification" : "Continue"} <ArrowRight className="w-4 h-4 ml-2" /> </>}
                                </Button>
                            </div>
                        </form>

                        {step === 1 && (
                            <div className="mt-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                Already have an account? <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">Sign in</Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </main>
    );
}
