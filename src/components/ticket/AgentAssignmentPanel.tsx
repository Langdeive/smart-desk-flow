
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UserCheck } from "lucide-react";
import { useAgents } from "@/hooks/useAgents";
import { useToast } from "@/hooks/use-toast";
import { updateTicketAgent } from "@/services/ticketService";
import { addManualHistoryEntry } from "@/services/historyService";
import { Agent } from "@/types/agent.types";

interface AgentAssignmentPanelProps {
  ticketId: string;
  currentAgentId: string | undefined;
  companyId: string;
}

const AgentAssignmentPanel: React.FC<AgentAssignmentPanelProps> = ({
  ticketId,
  currentAgentId,
  companyId
}) => {
  const { agents, isLoading } = useAgents(companyId);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(currentAgentId);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentAgentId !== selectedAgentId) {
      setSelectedAgentId(currentAgentId);
    }
  }, [currentAgentId]);

  const handleAgentChange = async (agentId: string) => {
    if (agentId === currentAgentId) return;
    
    setIsSaving(true);
    try {
      const previousAgentName = currentAgentId 
        ? agents.find(a => a.id === currentAgentId)?.nome || currentAgentId 
        : "Não atribuído";
        
      const newAgentName = agents.find(a => a.id === agentId)?.nome || agentId;
      
      await updateTicketAgent(ticketId, agentId);
      
      // Register in the ticket history
      await addManualHistoryEntry(
        ticketId,
        "agente_alterado",
        previousAgentName,
        newAgentName
      );
      
      setSelectedAgentId(agentId);
      toast({
        title: "Atribuição atualizada",
        description: `Ticket atribuído para ${newAgentName}`,
      });
    } catch (err) {
      console.error("Error updating agent assignment:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a atribuição do ticket.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getAgentLabel = (agent: Agent) => {
    return `${agent.nome} (${agent.funcao === 'admin' ? 'Admin' : 'Agente'})`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <UserCheck className="h-5 w-5 mr-2" />
          Atribuição
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || isSaving ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <p>{isLoading ? "Carregando agentes..." : "Atualizando..."}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Agente Responsável
            </p>
            <Select 
              value={selectedAgentId || ""} 
              onValueChange={handleAgentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar agente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  Não atribuído
                </SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {getAgentLabel(agent)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentAssignmentPanel;
