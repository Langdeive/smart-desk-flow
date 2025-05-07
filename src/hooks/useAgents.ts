
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
      
      // Get all members of the company directly from user_companies
      // The RLS policy now allows owners to see all users
      const { data, error } = await supabase
        .from('user_companies')
        .select(`
          id,
          user_id,
          role,
          company_id,
          user:user_id (
            email,
            user_metadata
          )
        `)
        .eq('company_id', companyId);
      
      if (error) throw error;
      
      console.log('Raw agents data:', data);
      
      if (Array.isArray(data)) {
        // Format the data to match the Agent type
        const formattedAgents: Agent[] = data.map(userCompany => ({
          id: userCompany.id,
          nome: userCompany.user?.user_metadata?.name || 
                userCompany.user?.user_metadata?.full_name || 
                'Unknown User',
          email: userCompany.user?.email || '',
          funcao: userCompany.role === 'admin' ? 'admin' : 'agent',
          status: 'active' // We can determine this based on other factors if needed
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

  useEffect(() => {
    if (companyId) {
      fetchAgents();
    } else {
      // Clear agents list if there's no company ID
      setAgents([]);
    }
  }, [companyId, fetchAgents]);

  return { 
    agents, 
    loading, 
    isAdding, 
    error,
    fetchAgents, 
    addAgent 
  };
};
