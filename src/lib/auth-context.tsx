'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

interface User {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
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
    } catch {
      // Not authenticated
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

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setUser({
      userId: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
    });
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password, name }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    setUser({
      userId: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
    });
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

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
