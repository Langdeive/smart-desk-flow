
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Ticket, TicketStatus, TicketPriority } from "@/types";

interface TicketDetailsPanelProps {
  ticket: Ticket;
  statusLabels: Record<TicketStatus, string>;
  priorityLabels: Record<TicketPriority, string>;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  formatDate: (date: Date) => string;
}

const TicketDetailsPanel: React.FC<TicketDetailsPanelProps> = ({
  ticket,
  statusLabels,
  priorityLabels,
  onStatusChange,
  onPriorityChange,
  formatDate,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Detalhes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <Select defaultValue={ticket.status} onValueChange={onStatusChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o status" />
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
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Prioridade</p>
          <Select defaultValue={ticket.priority} onValueChange={onPriorityChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione a prioridade" />
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
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Categoria</p>
          <p className="mt-1">Solicitação de Recurso</p>
        </div>
        
        <Separator />
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Fonte</p>
          <Badge variant="secondary" className="mt-1">
            {ticket.source.charAt(0).toUpperCase() + ticket.source.slice(1)}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
          <p className="mt-1">{formatDate(ticket.createdAt)}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
          <p className="mt-1">{formatDate(ticket.updatedAt)}</p>
        </div>
        
        <Separator />
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Cliente</p>
          <p className="mt-1">João Silva</p>
          <p className="text-sm text-muted-foreground">joao.silva@example.com</p>
          <p className="text-sm text-muted-foreground">Empresa ABC</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Atendente</p>
          <p className="mt-1">Maria Oliveira</p>
          <p className="text-sm text-muted-foreground">maria@suporte.com</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketDetailsPanel;
