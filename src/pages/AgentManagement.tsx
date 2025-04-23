
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { useAuth } from "@/hooks/useAuth";
import { useAgents, Agent } from '@/hooks/useAgents';
import AgentForm from '@/components/agents/AgentForm';
import AgentList from '@/components/agents/AgentList';

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
        <Input 
          placeholder="Buscar por nome ou e-mail" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Agente</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Agente</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar um novo agente.
              </DialogDescription>
            </DialogHeader>
            <AgentForm 
              onSubmit={handleAddAgent} 
              isAdding={isAdding}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AgentList 
        agents={filteredAgents} 
        loading={loading} 
        onEdit={(agent) => console.log('Edit agent:', agent)}
      />
    </div>
  );
}
