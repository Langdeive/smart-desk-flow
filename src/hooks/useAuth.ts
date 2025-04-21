
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
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

  // Para fins de desenvolvimento, vamos definir um valor fixo para company_id
  // Isso é temporário até que a autenticação completa seja implementada
  const tempCompanyId = '123e4567-e89b-12d3-a456-426614174000';

  return { 
    user, 
    session, 
    loading,
    signOut: () => supabase.auth.signOut(),
    // Usar um ID de empresa temporário para desenvolvimento
    companyId: user?.user_metadata?.company_id || tempCompanyId
  };
};
