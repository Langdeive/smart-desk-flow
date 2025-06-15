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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);

  // Função para buscar role da tabela user_companies
  const fetchUserCompanyRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_companies')
        .select('role, company_id')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.log('No user_companies record found:', error.message);
        return { role: null, companyId: null };
      }
      
      console.log('✅ User company data found:', data);
      return { role: data.role, companyId: data.company_id };
    } catch (error) {
      console.error('Error fetching user company role:', error);
      return { role: null, companyId: null };
    }
  };

  // Função para determinar o role com hierarquia de prioridade
  const determineUserRole = async (user: User) => {
    console.log('🔍 Determining user role for:', user.email);
    
    // 1. Primeira prioridade: user_companies (mais confiável)
    const { role: companyRole, companyId } = await fetchUserCompanyRole(user.id);
    
    if (companyRole) {
      console.log('✅ Role found in user_companies:', companyRole);
      setUserRole(companyRole);
      setUserCompanyId(companyId);
      return;
    }
    
    // 2. Segunda prioridade: user_metadata
    const userMetadataRole = user.user_metadata?.role;
    if (userMetadataRole) {
      console.log('✅ Role found in user_metadata:', userMetadataRole);
      setUserRole(userMetadataRole);
      setUserCompanyId(user.user_metadata?.company_id || null);
      return;
    }
    
    // 3. Terceira prioridade: app_metadata
    const appMetadataRole = user.app_metadata?.role;
    if (appMetadataRole) {
      console.log('✅ Role found in app_metadata:', appMetadataRole);
      setUserRole(appMetadataRole);
      setUserCompanyId(user.app_metadata?.company_id || null);
      return;
    }
    
    console.log('⚠️ No role found for user, defaulting to null');
    setUserRole(null);
    setUserCompanyId(null);
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) {
          return;
        }

        console.log('Auth state changed:', event);
        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);
        setError(null);

        if (currentUser) {
          // Deferir a busca de role para evitar deadlocks
          // Isso está alinhado com as melhores práticas do Supabase
          setTimeout(() => {
            if (mounted) {
              determineUserRole(currentUser).finally(() => {
                if (mounted) {
                  setLoading(false);
                }
              });
            }
          }, 0);
        } else {
          // Se não há usuário, limpamos os dados e paramos o loading
          setUserRole(null);
          setUserCompanyId(null);
          setLoading(false);
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
  
  // Log final role information for debugging
  useEffect(() => {
    if (user && userRole !== null) {
      console.log('👤 Current user role:', userRole);
      console.log('🏢 Current company ID:', userCompanyId);
      console.log('📧 User email:', user.email);
    }
  }, [user, userRole, userCompanyId]);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAuthenticated,
    emailVerified,
    role: userRole,
    companyId: userCompanyId,
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
