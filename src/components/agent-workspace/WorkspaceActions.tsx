
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket, TicketStatus, TicketPriority } from '@/types';
import { CheckCircle, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { updateTicketStatus, updateTicketPriority } from '@/services/ticketService';
import { useToast } from '@/hooks/use-toast';
import { statusLabels, priorityLabels } from '@/components/ticket/TicketUtils';

interface WorkspaceActionsProps {
  ticket: Ticket;
  onTicketUpdate: () => void;
}

const WorkspaceActions: React.FC<WorkspaceActionsProps> = ({
  ticket,
  onTicketUpdate
}) => {
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: TicketStatus) => {
    try {
      await updateTicketStatus(ticket.id, newStatus);
      onTicketUpdate();
      toast({
        title: 'Status atualizado',
        description: `O status foi alterado para ${statusLabels[newStatus]}.`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      });
    }
  };

  const handlePriorityChange = async (newPriority: TicketPriority) => {
    try {
      await updateTicketPriority(ticket.id, newPriority);
      onTicketUpdate();
      toast({
        title: 'Prioridade atualizada',
        description: `A prioridade foi alterada para ${priorityLabels[newPriority]}.`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a prioridade.',
        variant: 'destructive',
      });
    }
  };

  const quickActions = [
    {
      label: 'Assumir Ticket',
      icon: ArrowRight,
      action: () => handleStatusChange('in_progress'),
      show: ticket.status === 'new' || ticket.status === 'waiting_for_agent',
      variant: 'default' as const
    },
    {
      label: 'Aguardar Cliente',
      icon: Clock,
      action: () => handleStatusChange('waiting_for_client'),
      show: ticket.status === 'in_progress',
      variant: 'outline' as const
    },
    {
      label: 'Resolver',
      icon: CheckCircle,
      action: () => handleStatusChange('resolved'),
      show: ticket.status === 'in_progress',
      variant: 'default' as const
    },
    {
      label: 'Marcar Urgente',
      icon: AlertTriangle,
      action: () => handlePriorityChange('high'),
      show: ticket.priority !== 'high' && ticket.priority !== 'critical',
      variant: 'destructive' as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Action Buttons */}
        <div className="space-y-2">
          {quickActions
            .filter(action => action.show)
            .map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                size="sm"
                onClick={action.action}
                className="w-full justify-start"
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
        </div>

        {/* Status Selector */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
          <Select 
            value={ticket.status} 
            onValueChange={(value) => handleStatusChange(value as TicketStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Selector */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Prioridade</p>
          <Select 
            value={ticket.priority} 
            onValueChange={(value) => handlePriorityChange(value as TicketPriority)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceActions;
