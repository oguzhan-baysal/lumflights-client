'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface UserWithRole extends User {
  role?: 'admin' | 'staff';
}

interface AuthContextType {
  user: UserWithRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firestore'dan kullanıcı rolünü al
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        const userWithRole: UserWithRole = {
          ...firebaseUser,
          role: userData?.role
        };

        setUser(userWithRole);
        const token = await firebaseUser.getIdToken();
        document.cookie = `session=${token}; path=/;`;
      } else {
        setUser(null);
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      let errorMessage = 'Giriş yapılırken bir hata oluştu';
      
      if (err instanceof Error && 'code' in err && err.code === 'auth/invalid-credential') {
        errorMessage = 'Email veya şifre hatalı';
      }
      
      setError(errorMessage);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      // Çıkış sonrası state'i temizle
      setUser(null);
      // Ana sayfaya yönlendir (router yerine window.location kullan)
      window.location.href = '/';
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
      toast.error('Çıkış yapılamadı');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 