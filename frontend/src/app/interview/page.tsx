"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { INTERVIEW_QUESTIONS, JOB_ROLES } from "@/lib/data";
import {
    MessageSquare, ChevronDown, Play, Send, RotateCcw,
    Sparkles, Award, Target, Mic, User, Bot, Loader2
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";

interface Message {
    id: string;
    role: "ai" | "user";
    content: string;
    feedback?: string;
    score?: number;
}

export default function InterviewPage() {
    const [selectedRole, setSelectedRole] = useState("");
    const [started, setStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [answer, setAnswer] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [evaluating, setEvaluating] = useState(false);
    const [finished, setFinished] = useState(false);
    const [questions, setQuestions] = useState<string[]>([]);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, evaluating]);

    const handleStart = async () => {
        if (!selectedRole) return;
        setStarted(true);
        try {
            const qs = await api.startInterview(selectedRole);
            setQuestions(qs);
            setCurrentQ(0);
            setMessages([{
                id: Date.now().toString(),
                role: "ai",
                content: `Welcome! I'm your AI interviewer. Let's get started with your ${JOB_ROLES.find(r => r.id === selectedRole)?.title} interview. I'll ask you ${qs.length} questions.\n\n**Question 1:** ${qs[0]}`,
            }]);
        } catch (error) {
            console.error("Failed to start interview:", error);
            setStarted(false);
        }
    };

    const handleSubmit = async () => {
        if (!answer.trim() || evaluating) return;
        
        const userMsg: Message = { id: Date.now().toString() + "-user", role: "user", content: answer };
        setMessages(prev => [...prev, userMsg]);
        setAnswer("");
        setEvaluating(true);

        try {
            const evaluation = await api.evaluateAnswer(questions[currentQ], userMsg.content);
            const score = evaluation.score;
            const feedback = evaluation.feedback;

            const aiMsg: Message = { 
                id: Date.now().toString() + "-ai", 
                role: "ai", 
                content: feedback, 
                score 
            };

            if (currentQ < questions.length - 1) {
                const nextQ = questions[currentQ + 1];
                aiMsg.content += `\n\n**Question ${currentQ + 2}:** ${nextQ}`;
                setCurrentQ(prev => prev + 1);
            } else {
                aiMsg.content += "\n\n🎉 **Interview Complete!** Here's your overall performance summary.";
                setFinished(true);
            }

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Evaluation failed:", error);
        } finally {
            setEvaluating(false);
        }
    };

    const handleReset = () => {
        setStarted(false);
        setCurrentQ(0);
        setAnswer("");
        setMessages([]);
        setFinished(false);
        setSelectedRole("");
    };

    const avgScore = messages.filter(m => m.score).reduce((sum, m) => sum + (m.score || 0), 0) / (messages.filter(m => m.score).length || 1);

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col flex-1 w-full h-full">
                
                {/* Header */}
                <FadeIn className="text-center mb-10 shrink-0">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-6 shadow-sm">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                        Mock Interview <span className="text-amber-600 dark:text-amber-500">AI</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl mx-auto text-lg hover:text-zinc-700 transition">
                        Practice with dynamic AI-generated interview questions and get instant, actionable feedback.
                    </p>
                </FadeIn>

                {/* Setup State */}
                {!started ? (
                    <FadeIn delay={0.1}>
                        <Card className="max-w-xl mx-auto border-amber-100 dark:border-amber-900 shadow-md">
                            <CardHeader className="text-center pb-2">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Mic className="w-10 h-10 text-amber-500" />
                                </div>
                                <CardTitle className="text-2xl">Start a Mock Interview</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Select your target role. The AI will acts as the hiring manager.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4">
                                <div className="relative">
                                    <select 
                                        value={selectedRole} 
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full h-14 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 text-base font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none cursor-pointer text-zinc-950 dark:text-zinc-50 text-center transition-colors"
                                    >
                                        <option value="" disabled>Choose interview role...</option>
                                        {JOB_ROLES.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                                </div>

                                <Button 
                                    size="lg"
                                    onClick={handleStart} 
                                    disabled={!selectedRole}
                                    className="w-full h-14 text-base bg-amber-500 hover:bg-amber-600 text-white group shadow-md"
                                >
                                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> 
                                    Begin Interview
                                </Button>
                            </CardContent>
                        </Card>
                    </FadeIn>
                ) : (
                    /* Active Interview State */
                    <FadeIn className="flex flex-col flex-1 min-h-[500px] h-[60vh] md:h-auto border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl shadow-lg overflow-hidden">
                        
                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <motion.div 
                                        key={msg.id} 
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                                            msg.role === "ai" 
                                            ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800"
                                            : "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-100 dark:border-emerald-800"
                                        }`}>
                                            {msg.role === "ai" ? <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                                        </div>
                                        
                                        <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-5 shadow-sm text-[15px] leading-relaxed relative ${
                                            msg.role === "ai"
                                            ? "bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none"
                                            : "bg-amber-500 text-white rounded-tr-none"
                                        }`}>
                                            <div className="space-y-3">
                                                {msg.content.split('\n').map((line, j) => (
                                                    <p key={j} className="whitespace-pre-wrap">
                                                        {line.includes('**') ?
                                                            line.split('**').map((part, k) =>
                                                                k % 2 === 1 ? <strong key={k} className="font-semibold">{part}</strong> : part
                                                            ) : line}
                                                    </p>
                                                ))}
                                            </div>
                                            
                                            {msg.score && (
                                                <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                                    msg.score >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900" :
                                                    msg.score >= 60 ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900" :
                                                    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900"
                                                }`}>
                                                    <Award className="w-4 h-4" /> Score: {msg.score}/100
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {evaluating && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center shadow-sm">
                                        <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 py-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Evaluating your answer...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={endOfMessagesRef} className="h-4" />
                        </div>

                        {/* Input Area / Summary */}
                        <div className="p-4 sm:p-6 bg-zinc-50/80 dark:bg-zinc-900/50 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800">
                            {!finished ? (
                                <div className="flex gap-3">
                                    <textarea
                                        value={answer} onChange={(e) => setAnswer(e.target.value)}
                                        placeholder="Type your answer here... (Shift+Enter for new line)"
                                        rows={2}
                                        className="flex-1 resize-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4 text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-zinc-900 dark:text-zinc-100 shadow-sm transition-shadow"
                                        onKeyDown={(e) => { 
                                            if (e.key === "Enter" && !e.shiftKey) { 
                                                e.preventDefault(); 
                                                handleSubmit(); 
                                            } 
                                        }}
                                        disabled={evaluating}
                                    />
                                    <Button 
                                        size="icon"
                                        onClick={handleSubmit} 
                                        disabled={!answer.trim() || evaluating}
                                        className="h-auto w-14 shrink-0 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm"
                                    >
                                        <Send className="w-5 h-5 mt-0.5 ml-0.5" />
                                    </Button>
                                </div>
                            ) : (
                                <FadeIn>
                                    <Card className="border-amber-100 dark:border-amber-900/50 bg-white dark:bg-zinc-950 shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 text-center sm:text-left">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                                        <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Interview Summary</h3>
                                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                        {avgScore >= 80 ? "Outstanding performance!" :
                                                            avgScore >= 60 ? "Good effort!" :
                                                                "Keep practicing!"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`text-3xl font-bold ${avgScore >= 80 ? "text-emerald-500" : avgScore >= 60 ? "text-amber-500" : "text-red-500"}`}>
                                                    {Math.round(avgScore)}<span className="text-lg text-zinc-400 font-medium">/100</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Button 
                                                    variant="outline" 
                                                    onClick={handleReset} 
                                                    className="flex-1 h-12 border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-2" /> Try Another Mock
                                                </Button>
                                                <Button 
                                                    className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white"
                                                    asChild
                                                >
                                                    <a href="/roadmap">
                                                        <Target className="w-4 h-4 mr-2" /> Improve Skills
                                                    </a>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </FadeIn>
                            )}
                        </div>
                    </FadeIn>
                )}
            </div>
        </main>
    );
}
