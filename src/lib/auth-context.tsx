'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

const AUTH_SERVER_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_URL || 'https://auth.arkynox.com';
const AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || 'kaffeine';

interface User {
    userId: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    /** Redirect to auth.arkynox.com for sign-in. */
    login: (returnTo?: string) => void;
    /** Redirect to auth.arkynox.com for sign-up. */
    register: (returnTo?: string) => void;
    /** Clear local session and trigger global logout. Returns true if a global redirect was triggered. */
    logout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const response = await fetch('/api/auth');
            if (response.ok) {
                const data = await response.json();
                if (data.authenticated && data.user) {
                    setUser({
                        userId: data.user.userId,
                        email: data.user.email,
                        name: data.user.name || '',
                        role: data.user.role,
                    });
                    return;
                }
            }
            setUser(null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
        const interval = setInterval(checkAuth, 30000);
        return () => clearInterval(interval);
    }, [checkAuth]);

    const userIdRef = useRef(user?.userId);
    useEffect(() => { userIdRef.current = user?.userId; }, [user?.userId]);

    useEffect(() => {
        if (!user?.userId) return;

        const es = new EventSource('/api/realtime', { withCredentials: true });

        es.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'user-change' && (data.action === 'ban' || data.action === 'unban')) {
                    if (data.userId === userIdRef.current && data.action === 'ban') {
                        checkAuth();
                    }
                }
            } catch {
                // Ignore parse errors
            }
        };

        es.onerror = () => {
            es.close();
        };

        return () => {
            es.close();
        };
    }, [user?.userId, checkAuth]);

    /** Redirect to auth.arkynox.com for sign-in. */
    const login = useCallback((returnTo?: string) => {
        const callbackUrl = `${window.location.origin}/api/auth/callback`;
        const target = returnTo || `${window.location.pathname}${window.location.search}`;
        const params = new URLSearchParams({
            client_id: AUTH_CLIENT_ID,
            redirect_uri: callbackUrl,
            response_type: 'code',
            scope: 'openid profile email',
            state: target,
        });
        window.location.href = `${AUTH_SERVER_URL}/signin?redirect=${encodeURIComponent(
            `/api/auth/authorize?${params.toString()}`,
        )}`;
    }, []);

    /** Redirect to auth.arkynox.com for sign-up. */
    const register = useCallback((returnTo?: string) => {
        const callbackUrl = `${window.location.origin}/api/auth/callback`;
        const target = returnTo || `${window.location.pathname}${window.location.search}`;
        const params = new URLSearchParams({
            client_id: AUTH_CLIENT_ID,
            redirect_uri: callbackUrl,
            response_type: 'code',
            scope: 'openid profile email',
            state: target,
        });
        window.location.href = `${AUTH_SERVER_URL}/signup?redirect=${encodeURIComponent(
            `/api/auth/authorize?${params.toString()}`,
        )}`;
    }, []);

    /**
     * Clear local session AND trigger global logout across all Arkynox
     * platforms. The server returns a redirectUrl pointing to the auth
     * server's global-logout endpoint — we navigate the browser there so
     * the auth-domain cookie is sent automatically.
     *
     * Returns true if a global redirect was triggered, false otherwise.
     */
    const logout = useCallback(async (): Promise<boolean> => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            const data = await res.json().catch(() => ({}));
            if (data?.redirectUrl) {
                // Redirect browser to auth server for global logout.
                setUser(null);
                window.location.href = data.redirectUrl;
                return true;
            }
        } catch {
            // Even on failure, clear local state.
        }
        setUser(null);
        return false;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
