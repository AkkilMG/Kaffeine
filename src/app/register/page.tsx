"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/**
 * Register page — redirects to auth.arkynox.com for registration.
 */
export default function RegisterPage() {
    const router = useRouter();
    const { user, loading, register } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (!loading && !user) {
            register('/dashboard');
        }
    }, [loading, user, register]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}
