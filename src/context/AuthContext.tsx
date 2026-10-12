import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'admin' | 'analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const DEMO_ACCOUNTS = [
  {
    id: 'usr_admin',
    name: 'Platform Admin',
    email: 'admin@retailanalytics.com',
    password: 'Admin@123',
    role: 'admin' as UserRole,
    title: 'Administrator',
    avatar: 'PA',
  },
  {
    id: 'usr_analyst',
    name: 'Retail Analyst',
    email: 'analyst@retailanalytics.com',
    password: 'Analyst@123',
    role: 'analyst' as UserRole,
    title: 'Analytics User',
    avatar: 'RA',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Initialize Auth state safely from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('app_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.role) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Error restoring session:', e);
      localStorage.removeItem('app_auth_session');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const isAuthenticated = user !== null;
  const role = user ? user.role : null;
  const isAdmin = role === 'admin';

  const login = (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const found = DEMO_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === trimmedEmail && acc.password === password
    );

    if (found) {
      const userPayload: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        title: found.title,
        avatar: found.avatar,
      };
      setUser(userPayload);
      try {
        localStorage.setItem('app_auth_session', JSON.stringify(userPayload));
      } catch (e) {
        console.error('Error saving session:', e);
      }
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Invalid email or password. Please use valid credentials.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('app_auth_session');
    } catch (e) {
      console.error('Error clearing session:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isAuthenticated,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
