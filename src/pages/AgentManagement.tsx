
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useAgents } from '@/hooks/useAgents';
import AgentList from '@/components/agents/AgentList';
import AgentSearch from '@/components/agents/AgentSearch';
import AddAgentDialog from '@/components/agents/AddAgentDialog';

export default function AgentManagement() {
  const { companyId } = useAuth();
  const { agents, loading, isAdding, fetchAgents, addAgent } = useAgents(companyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    console.log("Current company ID:", companyId);
    console.log("Current agents:", agents);
    console.log("Loading state:", loading);
  }, [companyId, agents, loading]);

  const handleAddAgent = async (data: Omit<Agent, 'id' | 'status'>) => {
    const success = await addAgent(data);
    if (success) {
      setDialogOpen(false);
    }
    return success;
  };

  const filteredAgents = agents.filter(agent => 
    agent.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Agentes</h1>
      
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <AgentSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        <AddAgentDialog 
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          onAddAgent={handleAddAgent}
          isAdding={isAdding}
        />
      </div>

      <AgentList 
        agents={filteredAgents} 
        loading={loading} 
        onEdit={(agent) => console.log('Edit agent:', agent)}
      />
    </div>
  );
}
