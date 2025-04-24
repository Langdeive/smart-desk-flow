
import { useState, useEffect } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    if (!companyId) {
      console.log('Company ID is undefined, cannot fetch agents');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching agents for company ID:', companyId);
      
      const { data, error } = await supabase
        .from('user_companies')
        .select(`
          id,
          role,
          invitation_sent,
          users:user_id (
            email,
            raw_user_meta_data->>'name' as name
          )
        `)
        .eq('company_id', companyId);
      
      if (error) throw error;
      
      console.log('Raw agents data:', data);
      
      if (Array.isArray(data)) {
        const formattedAgents: Agent[] = data.map(agent => ({
          id: agent.id || '',
          nome: agent.users?.name || '',
          email: agent.users?.email || '',
          funcao: agent.role === 'admin' ? 'admin' : 'agent',
          status: agent.invitation_sent ? 'awaiting' : 'active'
        }));
        
        setAgents(formattedAgents);
        console.log('Formatted agents:', formattedAgents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch agents');
      toast.error('Erro ao carregar agentes', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    } finally {
      setLoading(false);
    }
  };

  const addAgent = async (agentData: Omit<Agent, 'id' | 'status'>) => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado');
      return false;
    }
    
    setIsAdding(true);
    setError(null);
    
    try {
      // We can't directly query the auth.users table, so we'll use the RPC function directly
      // Call the RPC function to invite the agent
      const { data, error } = await supabase.functions.invoke('invite_agent', {
        body: {
          email: agentData.email,
          name: agentData.nome,
          role: agentData.funcao,
          companyId: companyId
        }
      });

      if (error) throw error;

      // If successful, refresh the agents list
      await fetchAgents();
      
      toast.success('Agente convidado com sucesso', {
        description: `Um email foi enviado para ${agentData.email}`
      });
      
      return true;
    } catch (error) {
      console.error('Error adding agent:', error);
      toast.error('Erro ao convidar agente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchAgents();
    }
  }, [companyId]);

  return { 
    agents, 
    loading, 
    isAdding, 
    error,
    fetchAgents, 
    addAgent 
  };
};
