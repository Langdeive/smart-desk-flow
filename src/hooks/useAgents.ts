
import { useState, useEffect, useCallback } from 'react';
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

  // Usar useCallback para evitar recriações desnecessárias da função
  const fetchAgents = useCallback(async () => {
    if (!companyId) {
      console.log('No company ID available, skipping agent fetch');
      setAgents([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching agents for company ID:', companyId);
      
      // Use agents_view which already has the correct join with auth.users
      const { data, error } = await supabase
        .from('agents_view')
        .select('*')
        .eq('company_id', companyId);
      
      if (error) throw error;
      
      console.log('Raw agents data:', data);
      
      if (Array.isArray(data)) {
        // Format the data to match the Agent type
        const formattedAgents: Agent[] = data.map(agent => ({
          id: agent.id,
          nome: agent.nome || 'Unknown User',
          email: agent.email || '',
          funcao: agent.funcao === 'admin' ? 'admin' : 'agent',
          // Ensure status is one of the allowed values
          status: validateAgentStatus(agent.status)
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
  }, [companyId]);

  // Helper function to validate status is one of the allowed values
  const validateAgentStatus = (status: string | null | undefined): Agent['status'] => {
    if (status === 'active' || status === 'inactive' || status === 'awaiting') {
      return status;
    }
    // Default to 'awaiting' if status is not one of the allowed values
    return 'awaiting';
  };

  const addAgent = async (agentData: Omit<Agent, 'id' | 'status'>) => {
    if (!companyId) {
      const errorMsg = 'ID da empresa não encontrado. Crie sua empresa primeiro.';
      setError(errorMsg);
      toast.error('ID da empresa não encontrado', {
        description: 'Crie sua empresa primeiro ou faça login novamente.'
      });
      return false;
    }
    
    setIsAdding(true);
    setError(null);
    
    try {
      console.log('Adding agent with company ID:', companyId);
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('invite_agent', {
        body: {
          email: agentData.email,
          name: agentData.nome,
          role: agentData.funcao,
          companyId: companyId
        }
      });

      if (error) throw error;

      // Log the response to help with debugging
      console.log('Invite agent response:', data);

      // If successful, refresh the agents list
      await fetchAgents();
      
      toast.success('Agente convidado com sucesso', {
        description: `Um email foi enviado para ${agentData.email}`
      });
      
      return true;
    } catch (error: any) {
      console.error('Error adding agent:', error);
      
      // Special handling for company not found error
      if (error.message && error.message.includes('violates foreign key constraint')) {
        toast.error('Erro ao convidar agente', {
          description: 'A empresa informada não existe no sistema. Contate o suporte.'
        });
      } else {
        toast.error('Erro ao convidar agente', {
          description: error instanceof Error ? error.message : 'Tente novamente'
        });
      }
      
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  // Função para reenviar convite para um agente existente
  const resendInvite = async (agent: Agent) => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado');
      return false;
    }

    try {
      // Call the edge function to resend invitation
      const { error } = await supabase.functions.invoke('invite_agent', {
        body: {
          email: agent.email,
          name: agent.nome,
          role: agent.funcao,
          companyId: companyId
        }
      });

      if (error) throw error;

      toast.success('Convite reenviado com sucesso', {
        description: `Um novo email foi enviado para ${agent.email}`
      });
      
      return true;
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast.error('Erro ao reenviar convite', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      return false;
    }
  };

  // Função para remover um agente
  const removeAgent = async (agentId: string) => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_companies')
        .delete()
        .eq('user_id', agentId)
        .eq('company_id', companyId);

      if (error) throw error;

      // Atualizar a lista de agentes após remoção
      await fetchAgents();
      
      toast.success('Agente removido com sucesso');
      return true;
    } catch (error) {
      console.error('Error removing agent:', error);
      toast.error('Erro ao remover agente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      return false;
    }
  };

  // Função para atualizar um agente
  const updateAgent = async (agentId: string, data: { funcao?: 'admin' | 'agent', status?: 'active' | 'inactive' }) => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado');
      return false;
    }

    try {
      // Atualizar na tabela user_companies
      const { error } = await supabase
        .from('user_companies')
        .update({
          role: data.funcao,
          // Podemos adicionar campo active no futuro se necessário
        })
        .eq('user_id', agentId)
        .eq('company_id', companyId);

      if (error) throw error;

      // Atualizar a lista de agentes
      await fetchAgents();
      
      toast.success('Agente atualizado com sucesso');
      return true;
    } catch (error) {
      console.error('Error updating agent:', error);
      toast.error('Erro ao atualizar agente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      return false;
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchAgents();
    } else {
      // Clear agents list if there's no company ID
      setAgents([]);
    }
  }, [companyId, fetchAgents]);

  const isEmpty = agents.length === 0 && !loading;

  return { 
    agents, 
    loading, 
    isAdding,
    isEmpty,
    error,
    fetchAgents, 
    addAgent,
    resendInvite,
    removeAgent,
    updateAgent
  };
};
