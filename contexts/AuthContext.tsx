
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { firebaseService } from '../services/firebaseService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (businessName: string, email: string, pass: string) => Promise<{user: User}>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This simulates checking for an existing session on app load
    const checkUser = async () => {
      try {
        // In a real app, you'd verify a token. Here we just get a mock user.
        // For demonstration, we'll try to get the business user by default.
        // A real implementation would be more robust.
        const storedUser = sessionStorage.getItem('authUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to check user session", error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedInUser = await firebaseService.login(email, pass);
    setUser(loggedInUser);
    sessionStorage.setItem('authUser', JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const register = async (businessName: string, email: string, pass: string) => {
    const { user: registeredUser } = await firebaseService.registerBusiness(businessName, email, pass);
    setUser(registeredUser);
    sessionStorage.setItem('authUser', JSON.stringify(registeredUser));
    return { user: registeredUser };
  };

  const logout = async () => {
    await firebaseService.logout();
    setUser(null);
    sessionStorage.removeItem('authUser');
  };

  const value = { user, loading, login, logout, register };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
