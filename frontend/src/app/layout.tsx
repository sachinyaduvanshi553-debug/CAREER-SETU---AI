import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationProvider";
import { GlobalVoiceAssistant } from "@/components/GlobalVoiceAssistant";
import { SocketProvider } from "@/components/SocketProvider";
import PageTransition from "@/components/PageTransition";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "sonner";
import { SWRProvider } from "@/components/SWRProvider";

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
        <html lang="en" className="dark">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Career Setu" />
                <meta name="theme-color" content="#6366f1" />
            </head>
            <body className="bg-dark-950 text-dark-200 antialiased bg-grid min-h-screen relative overflow-x-hidden">
                <NotificationProvider>
                    <SocketProvider>
                        <SWRProvider>
                            <ErrorBoundary>
                                <PageTransition>
                                    {children}
                                </PageTransition>
                            </ErrorBoundary>
                            <GlobalVoiceAssistant />
                        </SWRProvider>
                        <Toaster position="bottom-right" theme="dark" richColors />
                    </SocketProvider>
                </NotificationProvider>
            </body>
        </html>
    );
}
