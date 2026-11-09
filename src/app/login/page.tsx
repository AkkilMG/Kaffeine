"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import emailAniData from "@/assets/lottie/email.json";
import ThemeToggle from "@/components/theme-toggle";

/**
 * Login page — redirects to auth.arkynox.com for authentication.
 * No local form needed since auth is centralized.
 */
export default function LoginPage() {
    const router = useRouter();
    const { user, loading, login, register } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (user) return null;

    // Redirect to auth.arkynox.com.
    const handleLogin = () => {
        login('/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background">
            {/* Left panel — form */}
            <div className="flex-1 flex flex-col">
                <div className="p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary">Kaffeine</h1>
                    <ThemeToggle />
                </div>

                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
                            <p className="mt-2 text-muted-foreground">
                                Sign in with your Arkynox account to access Kaffeine.
                            </p>
                        </div>

                        <button
                            onClick={handleLogin}
                            className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Sign in with Arkynox
                        </button>

                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <button
                                onClick={() => register('/dashboard')}
                                className="text-primary font-semibold hover:underline"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right panel — animation */}
            <div className="hidden lg:flex flex-1 items-center justify-center bg-primary/5 p-12">
                <div className="w-full max-w-lg">
                    <div className="bg-background rounded-2xl shadow-lg p-8">
                        <Lottie animationData={emailAniData} loop autoplay />
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-lg font-semibold text-foreground">One account, all your apps</p>
                        <p className="text-sm text-muted-foreground mt-1">Sign in once, access PikDB, ArkyDesk, Kaffeine & more.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
