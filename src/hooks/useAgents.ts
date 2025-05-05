
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
      
      // Query atualizada usando a tabela user_companies
      const { data, error } = await supabase
        .from('user_companies')
        .select(`
          id,
          role,
          user_id,
          company_id
        `)
        .eq('company_id', companyId);
      
      if (error) throw error;
      
      console.log('Raw agents data:', data);
      
      if (Array.isArray(data)) {
        // Since we don't have the users' name and email directly from the first query,
        // we'll need to fetch user data separately for each user_id
        const formattedAgents: Agent[] = [];
        
        for (const userCompany of data) {
          if (userCompany.user_id) {
            try {
              // Call the edge function with proper authentication
              const { data: userData, error: userError } = await supabase.functions.invoke('get_user_info', {
                body: { user_id: userCompany.user_id }
              });
              
              if (userError) {
                console.error('Error fetching user info:', userError);
                continue;
              }
              
              if (userData) {
                formattedAgents.push({
                  id: userCompany.id || '',
                  nome: userData.name || 'Unknown User',
                  email: userData.email || '',
                  funcao: userCompany.role === 'admin' ? 'admin' : 'agent',
                  status: 'active' // Default status since we don't have invitation_sent column
                });
              }
            } catch (err) {
              console.error('Failed to fetch user info:', err);
            }
          }
        }
        
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
