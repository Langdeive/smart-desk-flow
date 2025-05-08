
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useAgents } from '@/hooks/useAgents';
import AgentList from '@/components/agents/AgentList';
import AgentSearch from '@/components/agents/AgentSearch';
import AddAgentDialog from '@/components/agents/AddAgentDialog';
import { AgentEditDialog } from '@/components/agents/AgentEditDialog';
import { Loader2, AlertCircle, Building, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { Agent } from '@/hooks/useAgents';

export default function AgentManagement() {
  const navigate = useNavigate();
  const { user, companyId, role } = useAuth();
  const { 
    agents, 
    loading, 
    error, 
    isAdding, 
    isEmpty,
    fetchAgents, 
    addAgent, 
    resendInvite, 
    removeAgent,
    updateAgent 
  } = useAgents(companyId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
      setAddDialogOpen(false);
    }
    // If not successful, the modal stays open and error is shown via toast
    return success;
  };

  const handleEditAgent = async (data: { funcao: 'admin' | 'agent'; status: 'active' | 'inactive' }) => {
    if (!selectedAgent) return false;
    
    setIsUpdating(true);
    try {
      return await updateAgent(selectedAgent.id, {
        funcao: data.funcao,
        status: data.status
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResendInvite = (agent: Agent) => {
    resendInvite(agent);
  };

  const handleRemoveAgent = (agentId: string) => {
    removeAgent(agentId);
  };

  const handleOpenEditDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setEditDialogOpen(true);
  };

  // Filtrar agentes com base no termo de pesquisa
  const filteredAgents = agents.filter(agent => 
    agent.nome.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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
  if (loading && !agents.length) {
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
            onClick={() => setAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Adicionar Agente
          </Button>
        )}
      </div>

      {canManageAgents && (
        <>
          <AddAgentDialog 
            isOpen={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onAddAgent={handleAddAgent}
            isAdding={isAdding}
          />

          <AgentEditDialog
            agent={selectedAgent}
            isOpen={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSave={handleEditAgent}
            isSaving={isUpdating}
          />
        </>
      )}

      <AgentList 
        agents={filteredAgents}
        loading={loading}
        isEmpty={isEmpty && debouncedSearchTerm === ''}
        onEdit={canManageAgents ? handleOpenEditDialog : undefined}
        onResendInvite={canManageAgents ? handleResendInvite : undefined}
        onRemove={canManageAgents ? handleRemoveAgent : undefined}
      />
    </div>
  );
}
