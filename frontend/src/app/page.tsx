"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Sparkles, Target, Map, Briefcase, MessageSquare, BarChart3,
  FileText, ArrowRight, Users, BookOpen, TrendingUp,
  Globe, Award, Shield, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";

const FEATURES = [
  { icon: Target, title: "Skill Gap Analysis", desc: "AI-powered detection of missing skills with visual radar charts and personalized insights.", color: "text-blue-500 bg-blue-500/10" },
  { icon: Map, title: "Learning Roadmap", desc: "Personalized 30-60-90 day upskilling plans with free & affordable course links.", color: "text-purple-500 bg-purple-500/10" },
  { icon: FileText, title: "Resume Analyzer", desc: "ATS score, keyword match, and AI-driven improvement suggestions.", color: "text-cyan-500 bg-cyan-500/10" },
  { icon: Briefcase, title: "Job Matching", desc: "Region-based real job listings matched to your skills and aspirations.", color: "text-emerald-500 bg-emerald-500/10" },
  { icon: MessageSquare, title: "Mock Interview AI", desc: "Practice interviews with AI-generated questions and instant feedback.", color: "text-amber-500 bg-amber-500/10" },
  { icon: BarChart3, title: "Gov Analytics", desc: "District-wise skill gap maps and training-to-placement dashboards.", color: "text-rose-500 bg-rose-500/10" },
];

const STATS = [
  { label: "Skills Tracked", value: "500+", icon: ZapIcon },
  { label: "Career Paths", value: "100+", icon: TrendingUp },
  { label: "Districts Covered", value: "50+", icon: Globe },
  { label: "Courses Mapped", value: "200+", icon: BookOpen },
];

function ZapIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const MISSIONS = [
  { title: "Skill India Mission", desc: "Mapping workforce capabilities to industry demand using AI", icon: Award },
  { title: "Digital India", desc: "Digitizing skill development and career guidance for every citizen", icon: Globe },
  { title: "Employment Mission", desc: "Reducing unemployment through data-driven skill matching", icon: Users },
];

export default function LandingPage() {
  return (
    <main className="relative bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16">
        {/* Subtle Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-[500px] w-full bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px]" />
        
        <StaggerContainer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" staggerChildren={0.15}>
          <StaggerItem>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium mb-8 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
              <Sparkles className="w-4 h-4" /> Aligned with Skill India & Digital India Missions
            </div>
          </StaggerItem>

          <StaggerItem>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-6">
              Your AI-Powered <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Career GPS
              </span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-4 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Detect skill gaps, get personalized learning roadmaps, and connect with real
              job opportunities — all powered by AI. From blue-collar workers to tech professionals.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto group rounded-full text-base h-12 px-8">
                  Start Free Analysis
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full text-base h-12 px-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                  <BarChart3 className="mr-2 w-4 h-4" />
                  View Analytics Demo
                </Button>
              </Link>
            </div>
          </StaggerItem>

          {/* Stats Row */}
          <StaggerItem>
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-y border-zinc-200 dark:border-zinc-800 py-8">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">{stat.value}</div>
                  <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-100/50 dark:bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn distance={30} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Everything You Need to <span className="text-blue-600 dark:text-blue-400">Build Your Career</span>
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Six powerful AI modules working together to transform your career trajectory
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <FadeIn key={feat.title} delay={i * 0.1}>
                <Card className="h-full group hover:border-blue-500/20 transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <feat.icon className="w-6 h-6" />
                    </div>
                    <CardTitle>{feat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {feat.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              How <span className="text-blue-600 dark:text-blue-400">CAREER BRIDGE</span> Works
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              From profile creation to job placement in 4 simple steps
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[4.5rem] left-[12.5%] right-[12.5%] h-px bg-zinc-200 dark:bg-zinc-800" />
            
            {[
              { step: "01", title: "Create Profile", desc: "Enter your education, skills, interests, and career goals", icon: Users },
              { step: "02", title: "AI Analysis", desc: "Our AI engine maps your skills against industry demand", icon: Sparkles },
              { step: "03", title: "Get Roadmap", desc: "Receive personalized learning paths with free courses", icon: Map },
              { step: "04", title: "Land Your Job", desc: "Connect with matching jobs in your region", icon: Briefcase },
            ].map((item, i) => (
              <StaggerItem key={item.step} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 flex items-center justify-center mx-auto mb-6 relative z-10 shadow-sm">
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-50 border border-blue-200 dark:bg-blue-900 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 mb-2">{item.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-blue-600 dark:bg-blue-900 overflow-hidden relative text-white">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                  Transforming India&apos;s Workforce, One Skill at a Time
                </h2>
                <ul className="space-y-4">
                  {[
                    "Reduces random course enrollment with demand-based guidance",
                    "Helps rural youth choose high-demand careers",
                    "Assists blue-collar workers with digital upskilling",
                    "Bridges the skill gap between education and employment",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-white/80 flex-shrink-0" />
                      <span className="text-lg text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "73%", label: "Placement Rate Improvement" },
                  { value: "45%", label: "Skill Gap Reduction" },
                  { value: "2.5x", label: "Faster Career Progression" },
                  { value: "60%", label: "Cost Savings on Training" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">{s.value}</div>
                    <div className="text-sm text-white/80 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <FadeIn className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-4">
            Ready to Bridge Your Skills?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl mb-8">
            Join thousands of Indians building demand-driven careers with AI guidance.
          </p>
          <Link href="/register">
            <Button size="lg" className="rounded-full text-base h-14 px-10 group">
              Get Started — It&apos;s Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </FadeIn>
      </section>

      {/* Enhanced Clean Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold tracking-tight text-lg text-zinc-950 dark:text-zinc-50">CAREER BRIDGE</span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                AI-powered career guidance for every Indian citizen. Building a skilled workforce for the future.
              </p>
            </div>
            <div>
              <h4 className="text-zinc-950 dark:text-zinc-50 font-semibold mb-4 text-sm tracking-wide uppercase">Platform</h4>
              <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                <li><Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><Link href="/resume" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Resume Analyzer</Link></li>
                <li><Link href="/skills" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Skill Gap Analysis</Link></li>
                <li><Link href="/jobs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Job Explorer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-zinc-950 dark:text-zinc-50 font-semibold mb-4 text-sm tracking-wide uppercase">Resources</h4>
              <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                <li><Link href="/roadmap" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Learning Roadmap</Link></li>
                <li><Link href="/interview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Mock Interviews</Link></li>
                <li><Link href="/analytics" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Workforce Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-zinc-950 dark:text-zinc-50 font-semibold mb-4 text-sm tracking-wide uppercase">Partners</h4>
              <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500" /> Skill India</li>
                <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> Digital India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
            <p>© 2026 CAREER BRIDGE - AI. All rights reserved.</p>
            <p className="mt-2 md:mt-0 flex items-center gap-1">Built with precision for India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
