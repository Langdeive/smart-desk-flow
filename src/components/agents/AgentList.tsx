
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Agent } from '@/hooks/useAgents';

type AgentListProps = {
  agents: Agent[];
  loading: boolean;
  onEdit?: (agent: Agent) => void;
};

export default function AgentList({ agents, loading, onEdit }: AgentListProps) {
  // Function to get status display text and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active': 
        return { text: 'Ativo', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      case 'inactive': 
        return { text: 'Inativo', icon: <AlertCircle className="h-4 w-4 text-red-500" /> };
      case 'awaiting': 
        return { text: 'Aguardando Ativação', icon: <Clock className="h-4 w-4 text-amber-500" /> };
      default: 
        return { text: status, icon: null };
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando agentes...</div>;
  }

  if (agents.length === 0) {
    return <div className="text-center py-4">Nenhum agente cadastrado</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Função</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map(agent => {
          const status = getStatusDisplay(agent.status);
          return (
            <TableRow key={agent.id}>
              <TableCell>{agent.nome}</TableCell>
              <TableCell>{agent.email}</TableCell>
              <TableCell>{agent.funcao === 'admin' ? 'Administrador' : 'Agente'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {status.icon}
                  {status.text}
                </div>
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit && onEdit(agent)}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
