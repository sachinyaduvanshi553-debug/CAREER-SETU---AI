import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationProvider";
import { GlobalVoiceAssistant } from "@/components/GlobalVoiceAssistant";
import { SocketProvider } from "@/components/SocketProvider";
import PageTransition from "@/components/PageTransition";
<<<<<<< HEAD
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "sonner";
import { SWRProvider } from "@/components/SWRProvider";
import PWARegister from "@/components/PWARegister";
=======
import { ThemeProvider } from "@/components/ThemeProvider";
>>>>>>> ac0b0caf35cbcb500c95c37124e05edc2fc1ad2c

export const metadata: Metadata = {
    title: "Career Setu AI — Intelligent Career & Upskilling Platform",
    description:
        "AI-powered career guidance and skill development platform. Identify skill gaps, get personalized learning roadmaps, and connect with real job opportunities across India.",
    keywords: "career guidance, skill development, AI, upskilling, jobs, India, Career Setu",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Career Setu",
    },
};

export const viewport: Viewport = {
    themeColor: "#6366f1",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
<<<<<<< HEAD
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className="bg-dark-950 text-dark-200 antialiased bg-grid min-h-screen relative overflow-x-hidden">
                <PWARegister />
                <NotificationProvider>
=======
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
>>>>>>> ac0b0caf35cbcb500c95c37124e05edc2fc1ad2c
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
                </ThemeProvider>
            </body>
        </html>
    );
}
