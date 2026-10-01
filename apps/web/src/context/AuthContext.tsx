import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Business, UserRole } from '@ai-receptionist/shared';
import { apiRequest } from '../lib/api';

interface AuthContextType {
  user: User | null;
  business: Business | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User, business: Business, role: UserRole) => void;
  logout: () => void;
  loginAsDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ai_receptionist_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setIsLoading(false);
        return;
      }
      const res = await apiRequest<{ user: User; business: Business; role: UserRole }>('/auth/me');
      setUser(res.user);
      setBusiness(res.business);
      setRole(res.role);
    } catch (err) {
      console.warn('Failed to verify token session:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = (newToken: string, newUser: User, newBusiness: Business, newRole: UserRole) => {
    localStorage.setItem('ai_receptionist_token', newToken);
    setToken(newToken);
    setUser(newUser);
    setBusiness(newBusiness);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem('ai_receptionist_token');
    setToken(null);
    setUser(null);
    setBusiness(null);
    setRole(null);
  };

  const loginAsDemo = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<{ token: string; user: User; business: Business; role: UserRole }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'owner@swiftfixplumbing.com',
          password: 'password123'
        })
      });
      login(res.token, res.user, res.business, res.role);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, business, role, token, isLoading, login, logout, loginAsDemo }}>
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
