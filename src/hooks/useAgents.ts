
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
  const [isAdding, setIsAdding] = useState(false);

  const fetchAgents = async () => {
    if (!companyId) {
      console.error('Company ID is undefined, cannot fetch agents');
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agentes')
        .select('*')
        .eq('empresa_id', companyId)
        .returns<Agent[]>();
      
      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      toast.error('Erro ao carregar agentes', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAgent = async (agentData: Omit<Agent, 'id' | 'status'>) => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado, entre novamente no sistema.');
      return;
    }
    
    setIsAdding(true);
    try {
      const { data, error } = await supabase.rpc(
        'register_agent',
        {
          nome: agentData.nome,
          email: agentData.email,
          empresa_id: companyId,
          funcao: agentData.funcao
        }
      );

      if (error) {
        if (error.code === '23505') {
          throw new Error(`O email ${agentData.email} já está cadastrado no sistema.`);
        } else {
          throw error;
        }
      }
      
      toast.success('Agente adicionado com sucesso', {
        description: `Uma senha temporária foi gerada para ${agentData.email}`
      });
      
      // Refresh the agents list
      await fetchAgents();
      return true;
    } catch (error) {
      toast.error('Erro ao adicionar agente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      console.error('Error adding agent:', error);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  return { agents, loading, isAdding, fetchAgents, addAgent };
};
