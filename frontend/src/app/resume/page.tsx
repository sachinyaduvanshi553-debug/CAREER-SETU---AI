"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import {
    FileText, Upload, CheckCircle2, AlertTriangle, XCircle, ArrowRight,
    TrendingUp, Target, Sparkles, BarChart3, Lightbulb, Check
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import Link from "next/link";

interface AnalysisResult {
    atsScore: number;
    keywordMatch: number;
    sections: { name: string; status: "good" | "warning" | "missing"; tip: string }[];
    improvements: string[];
    strongPoints: string[];
    extractedSkills: string[];
    missingKeywords: string[];
}

export default function ResumePage() {
    const [step, setStep] = useState<"upload" | "analyzing" | "result">("upload");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (e?: React.ChangeEvent<HTMLInputElement> | React.DragEvent | File) => {
        let file: File | undefined;

        if (e instanceof File) {
            file = e;
        } else if (e && 'target' in e && (e.target as HTMLInputElement).files) {
            const target = e.target as HTMLInputElement;
            file = target.files?.[0];
        } else if (e && 'dataTransfer' in e) {
            const dragEvent = e as React.DragEvent;
            file = dragEvent.dataTransfer.files[0];
        }

        if (!file) return;

        setStep("analyzing");
        try {
            const analysis = await api.analyzeResume(file);
            setResult({
                atsScore: analysis.overall_score || 0,
                keywordMatch: analysis.keyword_match || 0,
                sections: (analysis.section_analysis || []).map((s: any) => ({
                    name: s.section,
                    status: s.score >= 80 ? "good" : s.score >= 50 ? "warning" : "missing",
                    tip: s.feedback
                })),
                improvements: analysis.suggestions || [],
                strongPoints: analysis.strengths || [],
                extractedSkills: analysis.extracted_skills || [],
                missingKeywords: analysis.missing_keywords || []
            });
            setStep("result");
        } catch (error) {
            console.error("Analysis failed:", error);
            setStep("upload");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "good": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case "warning": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case "missing": return <XCircle className="w-5 h-5 text-red-500" />;
        }
    };

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <FadeIn className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 shadow-sm">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                        Resume <span className="text-blue-600 dark:text-blue-400">Analyzer</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl mx-auto text-lg hover:text-zinc-700 transition">
                        Upload your resume and get AI-powered ATS analysis and expert improvement tips in seconds.
                    </p>
                </FadeIn>

                <div className="mt-8">
                    <AnimatePresence mode="wait">
                        {/* Upload Step */}
                        {step === "upload" && (
                            <motion.div key="upload" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                                <Card className="border-dashed border-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:border-blue-500/50 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300">
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e); }}
                                        className={`p-16 text-center cursor-pointer rounded-xl ${dragOver ? "bg-blue-50 dark:bg-blue-900/10 border-blue-500" : ""}`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.txt"
                                            onChange={handleFile}
                                        />
                                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group">
                                            <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:-translate-y-1 transition-transform" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50 mb-2">Drag & Drop your resume</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">Supports PDF, DOC, DOCX, TXT (Max 5MB)</p>
                                        <Button size="lg" className="rounded-full shadow-sm hover:shadow-md transition-shadow">
                                            Browse Files
                                        </Button>
                                    </div>
                                    <div className="pb-6 text-center text-sm text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        Your resume data is processed securely and never stored permanently.
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Analyzing Step */}
                        {step === "analyzing" && (
                            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Card className="py-20 text-center">
                                    <div className="relative w-24 h-24 mx-auto mb-8">
                                        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-ping opacity-75" />
                                        <div className="relative w-full h-full bg-blue-50 dark:bg-blue-900/50 rounded-full flex items-center justify-center border-2 border-blue-500 shadow-lg">
                                            <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-pulse" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50 mb-3 tracking-tight">Analyzing Your Resume</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
                                        Our AI is parsing skills, scoring ATS compatibility, and generating tailored suggestions...
                                    </p>
                                    <div className="max-w-sm mx-auto space-y-4 text-left">
                                        {["Extracting skills & keywords", "Evaluating formatting for ATS", "Generating improvement suggestions"].map((t, i) => (
                                            <motion.div key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }}
                                                className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 rounded-lg border border-zinc-100 dark:border-zinc-800"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                {t}
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Result Step */}
                        {step === "result" && result && (
                            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                {/* Score Cards */}
                                <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerChildren={0.1}>
                                    {[
                                        { label: "ATS Score", value: result.atsScore, icon: BarChart3, color: result.atsScore >= 70 ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" },
                                        { label: "Keyword Match", value: result.keywordMatch, icon: Target, color: result.keywordMatch >= 70 ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" },
                                        { label: "Skills Found", value: result.extractedSkills.length, icon: TrendingUp, color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30", noPercent: true },
                                    ].map((card, i) => (
                                        <StaggerItem key={card.label}>
                                            <Card className="text-center py-8">
                                                <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                                                    <card.icon className="w-7 h-7" />
                                                </div>
                                                <div className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-1">
                                                    {card.value}{card.noPercent ? '' : '%'}
                                                </div>
                                                <CardDescription>{card.label}</CardDescription>
                                            </Card>
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>

                                {/* Section Analysis */}
                                <FadeIn delay={0.3}>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                Section Analysis
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {result.sections.map(s => (
                                                <div key={s.name} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                                                    <div className="flex-shrink-0">{getStatusIcon(s.status)}</div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{s.name}</h4>
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{s.tip}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </FadeIn>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Extracted Skills */}
                                    <FadeIn delay={0.4} className="h-full">
                                        <Card className="h-full">
                                            <CardHeader>
                                                <CardTitle>Skills Found</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap gap-2 mb-8">
                                                    {result.extractedSkills.map(s => <Badge variant="success" key={s} className="px-3 py-1 font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">{s}</Badge>)}
                                                </div>
                                                <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 mb-3">Missing Keywords (Recommended)</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.missingKeywords.map(s => <Badge variant="destructive" key={s} className="px-3 py-1 font-medium bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">{s}</Badge>)}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </FadeIn>

                                    {/* Improvements */}
                                    <FadeIn delay={0.5} className="h-full">
                                        <Card className="h-full">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Lightbulb className="w-5 h-5 text-amber-500" /> Improvement Tips
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-4">
                                                    {result.improvements.map((tip, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                                                            <div className="mt-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 p-1 flex-shrink-0">
                                                                <ArrowRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                                            </div>
                                                            <span className="leading-relaxed">{tip}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </FadeIn>
                                </div>

                                {/* CTA */}
                                <FadeIn delay={0.6}>
                                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900">
                                        <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-1">Want to improve your score?</h3>
                                                <p className="text-zinc-600 dark:text-zinc-400 text-sm">Get a personalized learning roadmap to fill your skill gaps.</p>
                                            </div>
                                            <Link href="/skills">
                                                <Button size="lg" className="rounded-full shrink-0 group">
                                                    View Skill Gap <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </FadeIn>

                                <FadeIn delay={0.7} className="text-center pt-4">
                                    <Button variant="ghost" onClick={() => { setStep("upload"); setResult(null); }} className="text-zinc-500 font-medium hover:text-zinc-950 dark:hover:text-zinc-50">
                                        Analyze Another Resume
                                    </Button>
                                </FadeIn>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
