
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SessionManager } from '@/utils/sessionSecurity';
import { SecureLogger } from '@/utils/secureLogger';
import { toast } from 'sonner';

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

  // Inicializar SessionManager
  const sessionManager = SessionManager.getInstance();

  // Configurar SessionManager com callbacks
  useEffect(() => {
    sessionManager.setCallbacks(
      // onWarning
      () => {
        toast.warning('Sessão expirando', {
          description: 'Sua sessão expirará em 15 minutos. Clique aqui para estender.',
          action: {
            label: 'Estender',
            onClick: () => sessionManager.extendSession()
          }
        });
      },
      // onTimeout
      () => {
        toast.error('Sessão expirada', {
          description: 'Sua sessão expirou por motivos de segurança. Faça login novamente.'
        });
      }
    );

    // Configurar timeout de sessão baseado nas preferências do usuário
    sessionManager.configure({
      timeoutMinutes: 480, // 8 horas padrão
      warningMinutes: 15,
      maxInactivityMinutes: 30
    });
  }, []);

  // Função para buscar role da tabela user_companies
  const fetchUserCompanyRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_companies')
        .select('role, company_id')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        SecureLogger.warn('No user_companies record found', { userId: userId.substring(0, 8) });
        return { role: null, companyId: null };
      }
      
      SecureLogger.info('User company data found', { 
        userId: userId.substring(0, 8),
        role: data.role,
        companyId: data.company_id?.substring(0, 8)
      });
      return { role: data.role, companyId: data.company_id };
    } catch (error) {
      SecureLogger.error('Error fetching user company role', { userId: userId.substring(0, 8) }, error);
      return { role: null, companyId: null };
    }
  };

  // Função para determinar o role com hierarquia de prioridade
  const determineUserRole = async (user: User) => {
    SecureLogger.info('Determining user role', { 
      userId: user.id.substring(0, 8),
      email: user.email?.replace(/(.{2}).*(@.*)/, '$1***$2')
    });
    
    // 1. Primeira prioridade: user_companies (mais confiável)
    const { role: companyRole, companyId } = await fetchUserCompanyRole(user.id);
    
    if (companyRole) {
      SecureLogger.info('Role found in user_companies', { role: companyRole });
      setUserRole(companyRole);
      setUserCompanyId(companyId);
      return;
    }
    
    // 2. Segunda prioridade: user_metadata
    const userMetadataRole = user.user_metadata?.role;
    if (userMetadataRole) {
      SecureLogger.info('Role found in user_metadata', { role: userMetadataRole });
      setUserRole(userMetadataRole);
      setUserCompanyId(user.user_metadata?.company_id || null);
      return;
    }
    
    // 3. Terceira prioridade: app_metadata
    const appMetadataRole = user.app_metadata?.role;
    if (appMetadataRole) {
      SecureLogger.info('Role found in app_metadata', { role: appMetadataRole });
      setUserRole(appMetadataRole);
      setUserCompanyId(user.app_metadata?.company_id || null);
      return;
    }
    
    SecureLogger.warn('No role found for user, defaulting to null');
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

        SecureLogger.info('Auth state changed', { 
          event,
          hasSession: !!session,
          hasUser: !!session?.user
        });
        
        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);
        setError(null);

        if (currentUser && session) {
          // Iniciar gerenciamento de sessão
          sessionManager.startSession();
          
          // Registrar login seguro
          SecureLogger.info('User authenticated', {
            userId: currentUser.id.substring(0, 8),
            email: currentUser.email?.replace(/(.{2}).*(@.*)/, '$1***$2'),
            lastSignIn: currentUser.last_sign_in_at
          });

          // Deferir a busca de role para evitar deadlocks
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
          
          if (event === 'SIGNED_OUT') {
            SecureLogger.info('User signed out');
          }
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
      
      SecureLogger.info('Sign in attempt', {
        email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2')
      });

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        SecureLogger.warn('Sign in failed', { 
          error: error.message,
          email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2')
        });
        setError(error.message);
        throw error;
      }
      
      SecureLogger.info('Sign in successful');
    } catch (error: any) {
      SecureLogger.error('Sign in exception', undefined, error);
      setError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      
      SecureLogger.info('Sign out initiated');
      
      // Usar o SessionManager para logout seguro
      await sessionManager.endSession();
      
    } catch (error: any) {
      SecureLogger.error('Sign out error', undefined, error);
      setError(error.message);
      throw error;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      setError(null);
      
      SecureLogger.info('Resend verification email', {
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2')
      });

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        SecureLogger.warn('Resend verification failed', { error: error.message });
        setError(error.message);
        throw error;
      }
      
      SecureLogger.info('Verification email sent successfully');
    } catch (error: any) {
      SecureLogger.error('Resend verification exception', undefined, error);
      setError(error.message);
      throw error;
    }
  };

  // Derived values
  const isAuthenticated = !!user;
  const emailVerified = user?.email_confirmed_at != null;
  
  // Log final role information for debugging (apenas em desenvolvimento)
  useEffect(() => {
    if (!import.meta.env.PROD && user && userRole !== null) {
      SecureLogger.debug('Current user context', {
        role: userRole,
        companyId: userCompanyId?.substring(0, 8),
        email: user.email?.replace(/(.{2}).*(@.*)/, '$1***$2')
      });
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
