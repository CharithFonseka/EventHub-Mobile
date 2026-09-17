// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../config/firebase';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { User } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUserProfile: () => Promise<void>;
  setUserProfile: (profile: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  refreshUserProfile: async () => {},
  setUserProfile: () => {},
});

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setUserProfile({ uid, ...snap.data() } as User);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const refreshUserProfile = async () => {
    if (firebaseUser) {
      await fetchUserProfile(firebaseUser.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        isLoading,
        isAuthenticated: !!firebaseUser,
        refreshUserProfile,
        setUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
