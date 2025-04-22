import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

export type AuthError = {
  message: string;
  status?: number;
};

export interface SignUpData {
  email: string;
  password: string;
  company_name: string;
  plan?: 'free' | 'basic' | 'premium';
}

export interface SignInData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null);
          setSession(session);
          const isEmailVerified = session?.user?.email_confirmed_at != null;
          setEmailVerified(isEmailVerified);
          
          if (!isEmailVerified) {
            toast.error('E-mail não verificado', {
              description: 'Por favor, verifique seu e-mail antes de fazer login'
            });
            // Não vamos fazer signOut automático aqui para permitir que o usuário
            // veja a notificação e tenha chance de solicitar reenvio
          } else {
            toast.success('Login realizado com sucesso!');
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setEmailVerified(false);
          toast.success('Logout realizado com sucesso!');
        } else if (event === 'USER_UPDATED') {
          setUser(session?.user ?? null);
          setSession(session);
          const isEmailVerified = session?.user?.email_confirmed_at != null;
          setEmailVerified(isEmailVerified);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setEmailVerified(session.user.email_confirmed_at != null);
      }
      
      setLoading(false);
    };

    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({ email, password, company_name, plan = 'free' }: SignUpData) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name,
            plan
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`
        }
      });

      if (error) throw error;

      toast.success('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar sua conta.');
    } catch (err) {
      const error = err as Error;
      setError({ message: error.message });
      toast.error('Erro ao realizar cadastro', {
        description: error.message
      });
      throw error;
    }
  };

  const signIn = async ({ email, password }: SignInData) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Verificar se o e-mail foi confirmado
      if (data.user && !data.user.email_confirmed_at) {
        setEmailVerified(false);
        toast.error('E-mail não verificado', {
          description: 'Por favor, verifique seu e-mail antes de fazer login'
        });
        // Não faremos logout automático, usuário poderá solicitar reenvio da confirmação
      } else {
        setEmailVerified(true);
      }
    } catch (err) {
      const error = err as Error;
      setError({ message: error.message });
      toast.error('Erro ao realizar login', {
        description: error.message
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      const error = err as Error;
      setError({ message: error.message });
      toast.error('Erro ao realizar logout', {
        description: error.message
      });
      throw error;
    }
  };
  
  const resendVerificationEmail = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`
        }
      });

      if (error) throw error;

      toast.success('E-mail de verificação reenviado com sucesso!');
    } catch (err) {
      const error = err as Error;
      setError({ message: error.message });
      toast.error('Erro ao reenviar e-mail de verificação', {
        description: error.message
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast.success('E-mail de recuperação enviado!');
    } catch (err) {
      const error = err as Error;
      setError({ message: error.message });
      toast.error('Erro ao enviar e-mail de recuperação', {
        description: error.message
      });
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Senha atualizada com sucesso!');
    } catch (err) {
      const error = err as Error;
      setError({ message: error.message });
      toast.error('Erro ao atualizar senha', {
        description: error.message
      });
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    error,
    emailVerified,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendVerificationEmail,
    isAuthenticated: !!user && emailVerified,
    companyId: session?.user?.user_metadata?.company_id,
    role: session?.user?.user_metadata?.role
  };
};
