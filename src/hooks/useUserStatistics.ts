
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserStatistics {
  total_tickets: number;
  resolved_tickets: number;
  avg_resolution_time_hours: number;
  tickets_this_month: number;
  response_rate: number;
  satisfaction_score: number;
}

export function useUserStatistics() {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadStatistics = async () => {
      try {
        // Primeiro busca o company_id do usuário
        const { data: userCompanyData, error: companyError } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id)
          .single();

        if (companyError || !userCompanyData) {
          throw new Error('Company not found for user');
        }

        const { data, error } = await supabase.rpc('get_user_role_statistics', {
          p_user_id: user.id,
          p_company_id: userCompanyData.company_id
        });

        if (error) throw error;

        if (data && data.length > 0) {
          setStatistics(data[0]);
        }
      } catch (error: any) {
        console.error('Erro ao carregar estatísticas:', error);
        setStatistics({
          total_tickets: 0,
          resolved_tickets: 0,
          avg_resolution_time_hours: 0,
          tickets_this_month: 0,
          response_rate: 0,
          satisfaction_score: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistics();
  }, [user]);

  return { statistics, isLoading };
}
