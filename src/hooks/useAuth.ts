
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

  // Function to refresh session and reload user metadata
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      // Update user state with refreshed session data
      if (data.user) {
        setUser(data.user);
        
        // Update email verification status
        setEmailVerified(!!data.user.email_confirmed_at);
        
        // Get company ID from app_metadata
        if (data.user.app_metadata && data.user.app_metadata.company_id) {
          setCompanyId(data.user.app_metadata.company_id);
          console.log("Retrieved company ID from app_metadata:", data.user.app_metadata.company_id);
        }
        
        // Get role from app_metadata
        if (data.user.app_metadata && data.user.app_metadata.role) {
          setRole(data.user.app_metadata.role);
          console.log("Retrieved role from app_metadata:", data.user.app_metadata.role);
        }
      }
      
      return data;
    } catch (error) {
      console.error("Error refreshing session:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        // Check if email is verified
        const isEmailVerified = user?.email_confirmed_at || false;
        setEmailVerified(!!isEmailVerified);

        // Get user role and company ID from app_metadata
        if (user && user.app_metadata) {
          if (user.app_metadata.role) {
            setRole(user.app_metadata.role);
          }
          
          if (user.app_metadata.company_id) {
            setCompanyId(user.app_metadata.company_id);
            console.log("Retrieved company ID from app_metadata:", user.app_metadata.company_id);
          } else {
            // If not in app_metadata, try refreshing the session
            await refreshSession();
          }
        } else if (user) {
          // If no app_metadata, try refreshing the session
          await refreshSession();
          
          // If still no company ID, try to get it from user_companies table
          if (!companyId) {
            const { data, error } = await supabase
              .from('user_companies')
              .select('company_id')
              .eq('user_id', user.id)
              .single();
            
            if (data && !error) {
              setCompanyId(data.company_id);
              console.log("Retrieved company ID from user_companies:", data.company_id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user || null;
        setUser(user);
        
        // Update email verification status
        setEmailVerified(!!user?.email_confirmed_at);
        
        // Update role and company ID from app_metadata
        if (user && user.app_metadata) {
          setRole(user.app_metadata.role || 'client');
          setCompanyId(user.app_metadata.company_id);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
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
      
      // After sign in, refresh the session to get latest metadata
      await refreshSession();
      
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
