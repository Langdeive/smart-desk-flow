
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Agent = {
  id: string;
  nome: string;
  email: string;
  funcao: 'admin' | 'agent';
  status: 'active' | 'inactive' | 'awaiting';
};

export const useAgents = (companyId: string | undefined) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agentes' as any)
        .select('*')
        .returns<Agent[]>();
      
      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      toast.error('Erro ao carregar agentes', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    } finally {
      setLoading(false);
    }
  };

  const addAgent = async (agentData: Omit<Agent, 'id' | 'status'>) => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado, entre novamente no sistema.');
      return;
    }
    try {
      const { data: userData, error } = await supabase.rpc(
        'register_agent' as any,
        {
          nome: agentData.nome,
          email: agentData.email,
          empresa_id: companyId,
          funcao: agentData.funcao
        }
      );

      if (error) throw error;
      
      toast.success('Agente adicionado com sucesso', {
        description: `Senha temporária gerada para ${agentData.email}`
      });
      
      await fetchAgents();
    } catch (error) {
      toast.error('Erro ao adicionar agente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  };

  return { agents, loading, fetchAgents, addAgent };
};

