import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { firebaseService } from '../services/firebaseService';
import { auth } from '../firebaseConfig';

// FIX: `firebase.User` type was not being resolved. Importing `firebase` types
// from `firebase/compat/app` makes the type available for `onAuthStateChanged`.
import type firebase from 'firebase/compat/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (businessName: string, email: string, pass: string) => Promise<{user: User}>;
  registerAdmin: (email: string, pass: string) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: firebase.User | null) => {
      if (firebaseUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const userProfile = await firebaseService.getUserProfile(firebaseUser.uid);
        setUser(userProfile);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedInUser = await firebaseService.login(email, pass);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (businessName: string, email: string, pass: string) => {
    const { user: registeredUser } = await firebaseService.registerBusiness(businessName, email, pass);
    setUser(registeredUser);
    return { user: registeredUser };
  };

  const registerAdmin = async (email: string, pass: string) => {
    const registeredUser = await firebaseService.registerAdmin(email, pass);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    await firebaseService.logout();
    setUser(null);
  };

  const value = { user, loading, login, logout, register, registerAdmin };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};