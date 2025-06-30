
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
  const { user, userCompany } = useAuth();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !userCompany?.id) return;

    const loadStatistics = async () => {
      try {
        const { data, error } = await supabase.rpc('get_user_role_statistics', {
          p_user_id: user.id,
          p_company_id: userCompany.id
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
  }, [user, userCompany]);

  return { statistics, isLoading };
}
