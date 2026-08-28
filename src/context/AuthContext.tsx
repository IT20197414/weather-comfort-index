import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';

interface MfaState {
  sessionToken: string;
  email: string;
  demoCode?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  mfaState: MfaState | null;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  verifyMfa: (code: string) => Promise<boolean>;
  cancelMfa: () => void;
  logout: () => void;
  clearError: () => void;
  quickFillCredentials: () => { email: string; pass: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'fidenz_weather_jwt';
const USER_KEY = 'fidenz_weather_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mfaState, setMfaState] = useState<MfaState | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validate session on load
  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session validation error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [token]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed');
        return false;
      }

      if (data.mfaRequired && data.sessionToken) {
        setMfaState({
          sessionToken: data.sessionToken,
          email,
          demoCode: data.demoCode,
        });
        return true;
      }

      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return true;
      }

      return false;
    } catch (err: any) {
      setError(err.message || 'Network error during login');
      return false;
    }
  };

  const verifyMfa = async (code: string): Promise<boolean> => {
    if (!mfaState) return false;
    setError(null);
    try {
      const res = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: mfaState.sessionToken,
          code,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid 6-digit MFA code');
        return false;
      }

      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        setMfaState(null);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'MFA verification network error');
      return false;
    }
  };

  const cancelMfa = () => {
    setMfaState(null);
    setError(null);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setMfaState(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const quickFillCredentials = () => {
    return {
      email: 'careers@fidenz.com',
      pass: 'Pass#fidenz',
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        mfaState,
        error,
        login,
        verifyMfa,
        cancelMfa,
        logout,
        clearError: () => setError(null),
        quickFillCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
