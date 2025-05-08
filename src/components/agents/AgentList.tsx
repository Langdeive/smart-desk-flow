
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
import { AlertCircle, CheckCircle, Clock, Edit, SendHorizonal, Trash2 } from 'lucide-react';
import { Agent } from '@/hooks/useAgents';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

type AgentListProps = {
  agents: Agent[];
  loading: boolean;
  isEmpty: boolean;
  onEdit?: (agent: Agent) => void;
  onResendInvite?: (agent: Agent) => void;
  onRemove?: (agentId: string) => void;
};

export default function AgentList({ agents, loading, isEmpty, onEdit, onResendInvite, onRemove }: AgentListProps) {
  // Function to get status display text and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active': 
        return { 
          text: 'Ativo', 
          icon: <CheckCircle className="h-4 w-4" />,
          variant: 'success' as const
        };
      case 'inactive': 
        return { 
          text: 'Inativo', 
          icon: <AlertCircle className="h-4 w-4" />,
          variant: 'destructive' as const
        };
      case 'awaiting': 
        return { 
          text: 'Aguardando Ativação', 
          icon: <Clock className="h-4 w-4" />,
          variant: 'secondary' as const
        };
      default: 
        return { 
          text: status, 
          icon: null,
          variant: 'default' as const
        };
    }
  };

  if (loading) {
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
          {[1, 2, 3].map((item) => (
            <TableRow key={item}>
              <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-8 w-[200px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center p-8 border rounded-lg bg-card">
        <p className="text-muted-foreground mb-4">Nenhum agente ainda – clique em Adicionar Agente</p>
      </div>
    );
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
                <Badge variant={status.variant} className="flex items-center gap-2 w-fit">
                  {status.icon}
                  {status.text}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit && onEdit(agent)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  
                  {agent.status === 'awaiting' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onResendInvite && onResendInvite(agent)}
                    >
                      <SendHorizonal className="h-4 w-4 mr-2" />
                      Reenviar
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover agente</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover este agente? Esta ação não poderá ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onRemove && onRemove(agent.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
