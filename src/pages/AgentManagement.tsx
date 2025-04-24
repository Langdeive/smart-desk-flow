
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useAgents } from '@/hooks/useAgents';
import AgentList from '@/components/agents/AgentList';
import AgentSearch from '@/components/agents/AgentSearch';
import AddAgentDialog from '@/components/agents/AddAgentDialog';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AgentManagement() {
  const { user, companyId } = useAuth();
  const { agents, loading, error, isAdding, fetchAgents, addAgent } = useAgents(companyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    console.log("Current company ID:", companyId);
    console.log("Current agents:", agents);
    console.log("Loading state:", loading);
  }, [companyId, agents, loading]);

  const handleAddAgent = async (data: {
    nome: string;
    email: string;
    funcao: 'admin' | 'agent';
  }) => {
    const success = await addAgent(data);
    if (success) {
      setDialogOpen(false);
    }
    // If not successful, the modal stays open and error is shown via toast
    return success;
  };

  const filteredAgents = agents.filter(agent => 
    agent.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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
      />
    </div>
  );
}
