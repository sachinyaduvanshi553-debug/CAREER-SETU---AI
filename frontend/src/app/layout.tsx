import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationProvider";
import { GlobalVoiceAssistant } from "@/components/GlobalVoiceAssistant";
import { SocketProvider } from "@/components/SocketProvider";
import PageTransition from "@/components/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
    title: "Career Setu AI — Intelligent Career & Upskilling Platform",
    description:
        "AI-powered career guidance and skill development platform. Identify skill gaps, get personalized learning roadmaps, and connect with real job opportunities across India.",
    keywords: "career guidance, skill development, AI, upskilling, jobs, India, Career Setu",
    manifest: "/manifest.json",
    themeColor: "#6366f1",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Career Setu",
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Career Setu" />
                <meta name="theme-color" content="#6366f1" />
            </head>
            <body className="bg-background text-foreground antialiased min-h-screen relative overflow-x-hidden transition-colors duration-300">
                <ThemeProvider>
                    <NotificationProvider>
                    <SocketProvider>
                        <PageTransition>
                            {children}
                        </PageTransition>
                        <GlobalVoiceAssistant />
                    </SocketProvider>
                </NotificationProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
