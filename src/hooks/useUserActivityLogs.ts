
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ActivityLog {
  id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export function useUserActivityLogs(limit = 10) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadActivityLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('user_activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        // Transformar dados para match da interface ActivityLog
        const transformedLogs: ActivityLog[] = (data || []).map(log => ({
          id: log.id,
          action: log.action,
          resource_type: log.resource_type || undefined,
          resource_id: log.resource_id || undefined,
          details: log.details || undefined,
          ip_address: log.ip_address ? String(log.ip_address) : undefined,
          user_agent: log.user_agent || undefined,
          created_at: log.created_at
        }));

        setLogs(transformedLogs);
      } catch (error: any) {
        console.error('Erro ao carregar logs de atividade:', error);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivityLogs();
  }, [user, limit]);

  return { logs, isLoading };
}
