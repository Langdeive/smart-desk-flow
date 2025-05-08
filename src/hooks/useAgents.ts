
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Agent, NewAgentData } from '@/types/agent.types';
import { 
  fetchAgentsForCompany, 
  inviteAgent, 
  resendAgentInvite, 
  removeAgentFromCompany, 
  updateAgentDetails 
} from '@/services/agentService';

export type { Agent } from '@/types/agent.types';

export const useAgents = (companyId: string | undefined) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch agents using useCallback to avoid unnecessary re-renders
  const fetchAgents = useCallback(async () => {
    if (!companyId) {
      console.log('No company ID available, skipping agent fetch');
      setAgents([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const agentData = await fetchAgentsForCompany(companyId);
      setAgents(agentData);
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

  // Add a new agent
  const addAgent = async (agentData: NewAgentData) => {
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
      await inviteAgent(agentData, companyId);
      
      // Refresh the agents list
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

  // Resend invitation to an existing agent
  const resendInvite = async (agent: Agent) => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado');
      return false;
    }

    try {
      await resendAgentInvite(agent, companyId);
      
      toast.success('Convite reenviado com sucesso', {
        description: `Um novo email foi enviado para ${agent.email}`
      });
      
      return true;
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toast.error('Erro ao reenviar convite', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      return false;
    }
  };

  // Remove an agent
  const removeAgent = async (agentId: string) => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado');
      return false;
    }

    try {
      await removeAgentFromCompany(agentId, companyId);

      // Update the agents list after removal
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

  // Update agent details
  const updateAgent = async (agentId: string, data: { funcao?: 'admin' | 'agent', status?: 'active' | 'inactive' }) => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado');
      return false;
    }

    try {
      await updateAgentDetails(agentId, companyId, data);

      // Update the agents list
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

  // Load agents on component mount or when companyId changes
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
