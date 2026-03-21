"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, MapPin, Eye, EyeOff, ArrowRight, GraduationCap, Phone } from "lucide-react";
import { SKILLS_DATABASE } from "@/lib/data";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { api } from "@/lib/api";

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

    const allSkills = Object.values(SKILLS_DATABASE).flat();

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
        
        // Handle Step Transition
        if (step < 3) { 
            setStep(step + 1); 
            return; 
        }
        
        // At step 3: Send OTP before proceeding to Step 4
        if (step === 3) {
            setLoading(true);
            setError("");
            try {
                // Initialize Recaptcha if it doesn't exist
                if (!window.recaptchaVerifier) {
                    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        size: 'invisible'
                    });
                }
                const appVerifier = window.recaptchaVerifier;
                
                // Format phone number
                const phoneNumber = form.phone.startsWith('+') ? form.phone : `+91${form.phone}`;
                
                const confResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
                setConfirmationResult(confResult);
                setStep(4);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to send OTP. Ensure number is valid with country code.");
            } finally {
                setLoading(false);
            }
            return;
        }

        // At step 4: Register with OTP
        setLoading(true);
        setError("");
        try {
            // Special handling for Test OTP (123567) if confirmationResult is missing
            if (!confirmationResult && form.otp === "123567") {
                // Bypass Firebase verify and go straight to backend register
                const payload = {
                    ...form,
                    skills: form.selectedSkills,
                    otp: "123567" // Send the test string directly
                };
                const res = await api.register(payload);
                router.push("/login");
                return;
            }

            if (!confirmationResult) throw new Error("No confirmation result. Try again.");
            
            // Verify OTP via Firebase
            const result = await confirmationResult.confirm(form.otp);
            const user = result.user;
            
            // Fetch Firebase ID Token for backend verification
            const idToken = await user.getIdToken();
            
            const payload = {
                ...form,
                skills: form.selectedSkills,
                otp: idToken // Send idToken securely
            };
            const res = await api.register(payload);
            router.push("/login");
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
            <div className="absolute inset-0 bg-hero-glow" />
            <div className="absolute top-1/4 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-accent-purple/10 rounded-full blur-[100px]" />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-lg mx-4"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl object-contain bg-white/5 p-1" />
                        <span className="text-xl font-bold font-display text-white">CAREER BRIDGE - AI</span>
                    </Link>
                    <h1 className="text-2xl font-bold font-display text-white">Create Account</h1>
                    <p className="text-dark-400 text-sm mt-2">Step {step} of 3 — {step === 1 ? "Basic Info" : step === 2 ? "Your Skills" : "Your Interests"}</p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${s <= step ? "bg-gradient-to-r from-primary-500 to-accent-purple" : "bg-dark-800"}`} />
                    ))}
                </div>

                <div className="glass-card p-8">
                    {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-xl">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                   <label className="text-sm text-dark-300 col-span-2">Select Your Role</label>
                                   {['professional', 'worker', 'customer'].map(r => (
                                       <button 
                                           key={r}
                                           type="button" 
                                           onClick={() => setForm({ ...form, role: r })}
                                           className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${form.role === r ? 'bg-primary-500/20 border-primary-500 text-primary-400 shadow-lg shadow-primary-500/10' : 'bg-slate-900/50 border-white/5 text-dark-400 hover:border-white/10'}`}
                                       >
                                           {r}
                                       </button>
                                   ))}
                                </div>
                                <div>
                                    <label className="text-sm text-dark-300 mb-2 block">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                        <input type="text" placeholder="Your full name" required className="input-field !pl-11"
                                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-dark-300 mb-2 block">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                        <input type="email" placeholder="you@example.com" required className="input-field !pl-11"
                                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-dark-300 mb-2 block">Phone Number (with country code)</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                        <input type="tel" placeholder="+91 9876543210" required className="input-field !pl-11"
                                            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-dark-300 mb-2 block">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                        <input type={show ? "text" : "password"} placeholder="••••••••" required className="input-field !pl-11 !pr-11"
                                            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                        <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                                            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-dark-300 mb-2 block">Location (City/State)</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                        <input type="text" placeholder="e.g. Bangalore, Karnataka" required className="input-field !pl-11"
                                            value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-dark-300 mb-2 block">Education Level</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                        <select required className="input-field !pl-11 appearance-none"
                                            value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} >
                                            <option value="">Select education level</option>
                                            <option value="10th">10th Pass</option>
                                            <option value="12th">12th Pass</option>
                                            <option value="diploma">Diploma</option>
                                            <option value="bachelor">Bachelor&apos;s Degree</option>
                                            <option value="master">Master&apos;s Degree</option>
                                            <option value="phd">PhD</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <p className="text-sm text-dark-400 mb-4">Select all skills you currently have:</p>
                                <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
                                    {Object.entries(SKILLS_DATABASE).map(([cat, skills]) => (
                                        <div key={cat}>
                                            <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">{cat}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map(skill => (
                                                    <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${form.selectedSkills.includes(skill)
                                                                ? "bg-primary-500/20 text-primary-300 border border-primary-500/40"
                                                                 : "bg-dark-800 text-dark-400 border border-white/5 hover:border-white/20"
                                                            }`}
                                                    >
                                                        {skill}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-dark-500 mt-3">{form.selectedSkills.length} skills selected</p>
                            </motion.div>
                        )}
                        <div id="recaptcha-container"></div>

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div>
                                    <p className="text-sm text-dark-400 mb-4">What areas interest you?</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {INTERESTS.map(interest => (
                                            <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                                                className={`p-4 rounded-xl text-sm font-medium text-left transition-all duration-200 ${form.interests.includes(interest)
                                                        ? "bg-primary-500/15 text-primary-300 border border-primary-500/30"
                                                        : "bg-dark-800/80 text-dark-400 border border-white/5 hover:border-white/20"
                                                    }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="pt-6 border-t border-white/5">
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(4)}
                                        className="w-full py-3 rounded-xl bg-white/5 text-dark-400 hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-wider border border-white/5"
                                    >
                                        Skip to Verification (Local Test)
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Verify Phone</h3>
                                    <p className="text-sm text-dark-400">
                                        We&apos;ve sent a 6-digit code to <span className="text-primary-400 font-medium">{form.phone}</span>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-dark-300 mb-2 block text-center">Verification Code</label>
                                    <input type="text" placeholder="123456" maxLength={6} required 
                                        className="input-field text-center tracking-[0.5em] text-xl !py-4 font-mono font-bold"
                                        value={form.otp} onChange={e => setForm({ ...form, otp: e.target.value })} 
                                    />
                                    <p className="text-xs text-dark-500 mt-2 text-center">Use <span className="text-primary-400 font-bold">123567</span> for testing if OTP not received</p>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex gap-3 pt-2">
                            {step > 1 && (
                                <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary flex-1 !py-3">Back</button>
                            )}
                            <button type="submit" disabled={loading}
                                className="btn-primary flex-1 flex items-center justify-center gap-2 !py-3.5 disabled:opacity-50"
                            >
                                {loading ? <div className="loader !w-5 !h-5" /> : <>{step === 4 ? "Verify & Create Account" : step === 3 ? "Send OTP" : "Continue"} <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </div>
                    </form>

                    {step === 1 && (
                        <div className="mt-6 text-center text-sm text-dark-400">
                            Already have an account? <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </main>
    );
}
