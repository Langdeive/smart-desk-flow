
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        // Check if email is verified (using app_metadata or other logic)
        const isEmailVerified = user?.email_confirmed_at || false;
        setEmailVerified(!!isEmailVerified);

        // Get user role if available
        const userRole = user?.app_metadata?.role || 'client';
        setRole(userRole);
        
        // Set companyId from the user's metadata if available
        if (user && user.app_metadata && user.app_metadata.company_id) {
          setCompanyId(user.app_metadata.company_id);
          console.log("Retrieved company ID from user metadata:", user.app_metadata.company_id);
        } else if (user) {
          // If not in app_metadata, try to get it from user_companies table
          const { data, error } = await supabase
            .from('user_companies')
            .select('company_id')
            .eq('user_id', user.id)
            .single();
          
          if (data && !error) {
            setCompanyId(data.company_id);
            console.log("Retrieved company ID from user_companies:", data.company_id);
          }

          // For testing, provide a fallback company ID - this is hardcoded
          // Remove this in production!
          if (!data || error) {
            // Hardcoded companyId for testing - remove in production
            const testCompanyId = '12b67065-5c0b-4bb7-ae71-93074e0bdd5d';
            setCompanyId(testCompanyId);
            console.log("Using test company ID:", testCompanyId);
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
        
        // Update role
        setRole(user?.app_metadata?.role || 'client');
        
        if (user && user.app_metadata && user.app_metadata.company_id) {
          setCompanyId(user.app_metadata.company_id);
        } else {
          // For testing - remove in production
          setCompanyId('12b67065-5c0b-4bb7-ae71-93074e0bdd5d');
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
    resendVerificationEmail,
  };
};
