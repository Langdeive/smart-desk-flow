
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

  const fetchAgents = async () => {
    if (!companyId) {
      console.log('Company ID is undefined, cannot fetch agents');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching agents for company ID:', companyId);
      
      // Using the more basic query pattern to avoid RLS issues
      const { data, error } = await supabase
        .from('agentes')
        .select('*')
        .eq('empresa_id', companyId);
      
      if (error) throw error;
      
      console.log('Raw agents data:', data);
      
      if (Array.isArray(data)) {
        const formattedAgents: Agent[] = data.map(agent => ({
          id: agent.id,
          nome: agent.nome || '',
          email: agent.email || '',
          funcao: (agent.funcao === 'admin' ? 'admin' : 'agent') as 'admin' | 'agent',
          status: (agent.status === 'active' || agent.status === 'inactive' || agent.status === 'awaiting') 
            ? agent.status as 'active' | 'inactive' | 'awaiting'
            : 'awaiting'
        }));
        
        setAgents(formattedAgents);
        console.log('Formatted agents:', formattedAgents);
      } else {
        console.error('Unexpected data format for agents:', data);
        setAgents([]);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Erro ao carregar agentes', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const addAgent = async (agentData: Omit<Agent, 'id' | 'status'>) => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado, entre novamente no sistema.');
      return false;
    }
    
    setIsAdding(true);
    try {
      console.log('Trying to add agent with data:', {
        nome: agentData.nome,
        email: agentData.email,
        empresa_id: companyId,
        funcao: agentData.funcao,
        status: 'awaiting'
      });

      // Check if email already exists
      const { data: existingAgents, error: checkError } = await supabase
        .from('agentes')
        .select('id')
        .eq('email', agentData.email);
      
      if (checkError) {
        console.error('Error checking existing agents:', checkError);
        throw checkError;
      }
      
      if (existingAgents && existingAgents.length > 0) {
        console.log('Agent with this email already exists:', existingAgents);
        toast.error(`O email ${agentData.email} já está cadastrado no sistema.`);
        return false;
      }

      // Direct insert using simplified approach
      const { data, error } = await supabase
        .from('agentes')
        .insert([{
          nome: agentData.nome,
          email: agentData.email,
          empresa_id: companyId,
          funcao: agentData.funcao,
          status: 'awaiting'
        }])
        .select();

      if (error) {
        console.error('Error inserting agent:', error);
        throw error;
      }
      
      console.log('Agent added successfully:', data);
      toast.success('Agente adicionado com sucesso', {
        description: `Um email foi enviado para ${agentData.email}`
      });
      
      // Refresh the agents list
      await fetchAgents();
      return true;
    } catch (error) {
      console.error('Error adding agent:', error);
      toast.error('Erro ao adicionar agente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  // Automatically fetch agents when companyId changes or component mounts
  useEffect(() => {
    if (companyId) {
      fetchAgents();
    }
  }, [companyId]);

  return { agents, loading, isAdding, fetchAgents, addAgent };
};
