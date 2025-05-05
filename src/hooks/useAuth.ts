
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the SignInData interface
export interface SignInData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const [emailVerified, setEmailVerified] = useState(false);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [refreshInProgress, setRefreshInProgress] = useState(false);

  // Função para atualizar o estado com os dados do usuário
  const updateUserState = (userData: any, sessionData: any = null) => {
    if (!userData) {
      setUser(null);
      setCompanyId(undefined);
      setEmailVerified(false);
      setRole(undefined);
      return;
    }

    setUser(userData);
    setEmailVerified(!!userData.email_confirmed_at);
    
    // Preferir app_metadata para companyId e role, pois são mais confiáveis
    if (userData.app_metadata) {
      if (userData.app_metadata.company_id) {
        setCompanyId(userData.app_metadata.company_id);
        console.log("Retrieved company ID from app_metadata:", userData.app_metadata.company_id);
      }
      
      if (userData.app_metadata.role) {
        setRole(userData.app_metadata.role);
        console.log("Retrieved role from app_metadata:", userData.app_metadata.role);
      }
    }
  };

  // Function to refresh session and reload user metadata with debounce
  const refreshSession = async () => {
    if (refreshInProgress) {
      console.log('Refresh already in progress, skipping...');
      return null;
    }
    
    try {
      setRefreshInProgress(true);
      console.log('Refreshing session...');
      
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      // Update user state with refreshed session data
      if (data.user) {
        updateUserState(data.user, data.session);
      }
      
      return data;
    } catch (error) {
      console.error("Error refreshing session:", error);
      return null;
    } finally {
      // Permitir nova tentativa após um intervalo
      setTimeout(() => {
        setRefreshInProgress(false);
      }, 5000); // Espera 5 segundos antes de permitir novos refreshes
    }
  };

  useEffect(() => {
    let isMounted = true;
    let authListener: any = null;
    
    const fetchUser = async () => {
      try {
        // Primeiro, obter a sessão existente
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        if (session?.user && isMounted) {
          updateUserState(session.user, session);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Configurar listener para mudança de estado de autenticação
    const setupAuthListener = () => {
      // Remover listener existente se houver
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
      
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        
        if (isMounted) {
          const user = session?.user || null;
          updateUserState(user, session);
        }
        
        // Não fazemos chamadas adicionais ao Supabase aqui para evitar recursão
      });
      
      authListener = data;
    };
    
    // Executar em ordem: configurar listener primeiro, depois buscar usuário
    setupAuthListener();
    fetchUser();

    return () => {
      isMounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign in function
  const signIn = async ({ email, password }: SignInData) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Não precisamos chamar refreshSession aqui, pois onAuthStateChange já atualiza o estado
      
      return data;
    } catch (error: any) {
      console.error("Error signing in:", error);
      setError(error.message || 'Failed to sign in');
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing out:", error);
      setError(error.message || 'Failed to sign out');
      toast.error('Error signing out', {
        description: error.message || 'Please try again',
      });
    }
  };

  // Resend verification email function
  const resendVerificationEmail = async (email: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      toast.success('Verification email sent', {
        description: `Check ${email} for the verification link`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      setError(error.message || 'Failed to send verification email');
      toast.error('Failed to send verification email', {
        description: error.message || 'Please try again',
      });
      return false;
    }
  };

  return {
    user,
    loading,
    companyId,
    isAuthenticated: !!user,
    emailVerified,
    role,
    error,
    signIn,
    signOut,
    refreshSession,
    resendVerificationEmail,
  };
};
