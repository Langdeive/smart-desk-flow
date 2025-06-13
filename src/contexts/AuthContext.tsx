
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface SignInData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  emailVerified: boolean;
  role: string | null;
  companyId: string | null;
  error: string | null;
  resendVerificationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        }
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          setError(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (data: SignInData) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        setError(error.message);
        throw error;
      }
    } catch (error: any) {
      console.error('Error in signOut:', error);
      setError(error.message);
      throw error;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      setError(error.message);
      throw error;
    }
  };

  // Derived values
  const isAuthenticated = !!user;
  const emailVerified = user?.email_confirmed_at != null;
  const role = user?.app_metadata?.role || user?.user_metadata?.role || null;
  const companyId = user?.app_metadata?.company_id || user?.user_metadata?.company_id || null;

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAuthenticated,
    emailVerified,
    role,
    companyId,
    error,
    resendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
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

export { AuthContext };
