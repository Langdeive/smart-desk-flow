
import { supabase } from '@/integrations/supabase/client';
import { Agent, NewAgentData } from '@/types/agent.types';
import { validateAgentStatus } from '@/utils/agentUtils';

/**
 * Fetches all agents for a specific company
 */
export const fetchAgentsForCompany = async (companyId: string): Promise<Agent[]> => {
  if (!companyId) {
    console.log('No company ID available, skipping agent fetch');
    return [];
  }
  
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
      status: validateAgentStatus(agent.status)
    }));
    
    console.log('Formatted agents:', formattedAgents);
    return formattedAgents;
  }
  
  return [];
};

/**
 * Invites a new agent to join the company
 */
export const inviteAgent = async (agentData: NewAgentData, companyId: string): Promise<boolean> => {
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
  
  return true;
};

/**
 * Resends an invitation to an existing agent
 */
export const resendAgentInvite = async (agent: Agent, companyId: string): Promise<boolean> => {
  console.log('Resending invitation for agent:', agent.id);
  
  // Call the edge function to resend invitation
  const { data, error } = await supabase.functions.invoke('invite_agent', {
    body: {
      email: agent.email,
      name: agent.nome,
      role: agent.funcao,
      companyId: companyId
    }
  });

  if (error) throw error;

  console.log('Resend invitation response:', data);
  return true;
};

/**
 * Removes an agent from the company
 */
export const removeAgentFromCompany = async (agentId: string, companyId: string): Promise<boolean> => {
  console.log('Removing agent:', agentId, 'from company:', companyId);
  
  // Use the SDK Supabase to make the operation DELETE
  const { error } = await supabase
    .from('user_companies')
    .delete()
    .eq('user_id', agentId)
    .eq('company_id', companyId);

  if (error) throw error;
  
  return true;
};

/**
 * Updates an agent's role or status
 */
export const updateAgentDetails = async (
  agentId: string, 
  companyId: string,
  data: { funcao?: 'admin' | 'agent', status?: 'active' | 'inactive' }
): Promise<boolean> => {
  console.log('Updating agent:', agentId, 'with data:', data);
  
  // Update in user_companies table
  const { error } = await supabase
    .from('user_companies')
    .update({
      role: data.funcao,
      // Add status when available in the table
      // status: data.status
    })
    .eq('user_id', agentId)
    .eq('company_id', companyId);

  if (error) throw error;

  return true;
};
