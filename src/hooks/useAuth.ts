
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
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

  return {
    user,
    loading,
    companyId,
    isAuthenticated: !!user
  };
};
