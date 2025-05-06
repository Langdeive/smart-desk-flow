
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useAgents } from '@/hooks/useAgents';
import AgentList from '@/components/agents/AgentList';
import AgentSearch from '@/components/agents/AgentSearch';
import AddAgentDialog from '@/components/agents/AddAgentDialog';
import { Loader2, AlertCircle, Building, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export default function AgentManagement() {
  const navigate = useNavigate();
  const { user, companyId, role } = useAuth();
  const { agents, loading, error, isAdding, fetchAgents, addAgent } = useAgents(companyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Carregamos os dados apenas uma vez ao montar o componente
  useEffect(() => {
    // Log para debug apenas
    console.log("Agent Management - Current user:", user?.id);
    console.log("Agent Management - Current company ID:", companyId);
    console.log("Agent Management - Current user role:", role);
  }, [user, companyId, role]);

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

  // Show company creation alert if no company ID
  if (!companyId) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive" className="mb-4 shadow-card">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Empresa não encontrada</AlertTitle>
          <AlertDescription>
            É necessário criar uma empresa antes de gerenciar agentes.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button 
            onClick={() => navigate("/cadastro-empresa")}
            className="flex items-center gap-2 bg-primary-b hover:bg-primary-b-600"
          >
            <Building className="h-5 w-5" />
            Criar Empresa
          </Button>
        </div>
      </div>
    );
  }

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-a" />
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4 shadow-card">
        <AlertCircle className="h-5 w-5" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Check if user has the right permissions (owner or admin)
  const canManageAgents = role === 'owner' || role === 'admin';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-h1 font-manrope font-semibold tracking-heading mb-6 text-neutral-900">Gerenciamento de Agentes</h1>
      
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <AgentSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        {canManageAgents && (
          <Button 
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Adicionar Agente
          </Button>
        )}
      </div>

      {canManageAgents && (
        <AddAgentDialog 
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          onAddAgent={handleAddAgent}
          isAdding={isAdding}
        />
      )}

      <AgentList 
        agents={filteredAgents} 
        loading={loading} 
      />
    </div>
  );
}
