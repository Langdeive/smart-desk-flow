
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null);
          setSession(session);
          toast.success('Login realizado com sucesso!');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          toast.success('Logout realizado com sucesso!');
        }
        setLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
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
          }
        }
      });

      if (error) throw error;

      toast.success('Cadastro realizado com sucesso! Verifique seu e-mail.');
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
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
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user,
    companyId: session?.user?.user_metadata?.company_id,
    role: session?.user?.user_metadata?.role
  };
};
