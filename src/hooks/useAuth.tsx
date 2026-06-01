import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '../lib/supabase';
import { checkAndInitializeProfile } from '../services/database';
import { identifyUser, resetAnalytics } from '../lib/analytics';
import { mapAuthError } from '../utils/authError';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        checkAndInitializeProfile(currentUser);
        identifyUser({
          id: currentUser.id,
          email: currentUser.email,
          createdAt: currentUser.created_at,
        });
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        checkAndInitializeProfile(currentUser);
        identifyUser({
          id: currentUser.id,
          email: currentUser.email,
          createdAt: currentUser.created_at,
        });
      } else {
        resetAnalytics();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        return { error: new Error(mapAuthError(error)) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: new Error(mapAuthError(err)) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error: new Error(mapAuthError(error)) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: new Error(mapAuthError(err)) };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://sumalyze.space/',
      });
      if (error) {
        return { error: new Error(mapAuthError(error)) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: new Error(mapAuthError(err)) };
    }
  };


  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
