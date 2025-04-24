
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
      
      // Updated query that doesn't reference non-existent columns
      const { data, error } = await supabase
        .from('user_companies')
        .select(`
          id,
          role,
          user_id
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
            // Call the edge function instead of RPC
            const { data: userData, error: userError } = await supabase.functions.invoke('get_user_info', {
              body: { user_id: userCompany.user_id }
            });
            
            if (userError) {
              console.error('Error fetching user info:', userError);
              continue;
            }
            
            if (userData) {
              // Properly type the response
              const typedUserData = userData as { id: string; name: string; email: string };
              
              formattedAgents.push({
                id: userCompany.id || '',
                nome: typedUserData.name || 'Unknown User',
                email: typedUserData.email || '',
                funcao: userCompany.role === 'admin' ? 'admin' : 'agent',
                status: 'active' // Default status since we don't have invitation_sent column
              });
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
  };

  const addAgent = async (agentData: Omit<Agent, 'id' | 'status'>) => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado');
      return false;
    }
    
    setIsAdding(true);
    setError(null);
    
    try {
      // Call the edge function instead of RPC
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
