
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, TicketStatus, TicketPriority, Client, TicketHistoryItem } from "@/types";
import { useClients } from "@/hooks/useClients";
import { Loader2 } from "lucide-react";
import { getTicketHistory } from "@/services/historyService";

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
  const { clients, isLoading: clientsLoading } = useClients();
  const [clientData, setClientData] = useState<Client | null>(null);
  const [historyItems, setHistoryItems] = useState<TicketHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (clients.length > 0 && ticket.userId) {
      const client = clients.find(c => c.id === ticket.userId);
      if (client) {
        setClientData(client);
      }
    }
  }, [clients, ticket.userId]);

  useEffect(() => {
    const fetchTicketHistory = async () => {
      if (!ticket.id) return;
      
      setLoadingHistory(true);
      try {
        const data = await getTicketHistory(ticket.id);
        setHistoryItems(data);
      } catch (error) {
        console.error('Error fetching ticket history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };
    
    fetchTicketHistory();
  }, [ticket.id]);

  const translateAction = (tipo: string): string => {
    const actionMap: Record<string, string> = {
      'criacao': 'Ticket criado',
      'status_alterado': 'Status alterado',
      'prioridade_alterada': 'Prioridade alterada',
      'agente_alterado': 'Atendente alterado'
    };
    
    return actionMap[tipo] || tipo;
  };

  const formatHistoryDate = (dateString: string): string => {
    return formatDate(new Date(dateString));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Detalhes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="details" className="flex-1">Detalhes</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
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
              <p className="mt-1">{ticket.category}</p>
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
              {clientsLoading ? (
                <div className="flex items-center mt-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Carregando...</span>
                </div>
              ) : clientData ? (
                <>
                  <p className="mt-1">{clientData.name}</p>
                  {/* Show additional contact information if available */}
                </>
              ) : (
                <p className="mt-1 text-muted-foreground">Cliente não encontrado</p>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Atendente</p>
              {ticket.agentId ? (
                <p className="mt-1">ID: {ticket.agentId}</p>
              ) : (
                <p className="mt-1 text-muted-foreground">Não atribuído</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            {loadingHistory ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Carregando histórico...</span>
              </div>
            ) : historyItems.length > 0 ? (
              <div className="space-y-4">
                {historyItems.map((item) => (
                  <div key={item.id} className="border-l-2 border-muted pl-4 py-2">
                    <p className="font-medium">{translateAction(item.tipo_acao)}</p>
                    {item.valor_anterior && item.valor_novo && (
                      <p className="text-sm text-muted-foreground">
                        De: {item.valor_anterior} → Para: {item.valor_novo}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatHistoryDate(item.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum histórico disponível
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TicketDetailsPanel;
