
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket, TicketStatus, TicketPriority } from '@/types';
import { Clock, User, AlertCircle, Filter, Flame, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { statusLabels, priorityLabels, statusColors } from '@/components/ticket/TicketUtils';

interface TicketQueueProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  onTicketSelect: (ticket: Ticket) => void;
  onTicketUpdate: () => void;
}

const TicketQueue: React.FC<TicketQueueProps> = ({
  tickets,
  selectedTicket,
  onTicketSelect,
  onTicketUpdate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: TicketPriority) => {
    if (priority === 'critical' || priority === 'high') {
      return <Flame className="h-3 w-3 text-red-500" />;
    }
    if (priority === 'medium') {
      return <TrendingUp className="h-3 w-3 text-orange-500" />;
    }
    return null;
  };

  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };

  const getTicketAgeColor = (createdAt: Date) => {
    const hoursOld = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursOld > 24) return 'text-red-600';
    if (hoursOld > 8) return 'text-orange-600';
    return 'text-gray-500';
  };

  // Quick stats
  const criticalCount = tickets.filter(t => t.priority === 'critical').length;
  const highCount = tickets.filter(t => t.priority === 'high').length;
  const oldTickets = tickets.filter(t => (Date.now() - t.createdAt.getTime()) > (24 * 60 * 60 * 1000)).length;

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header with stats */}
      <div className="p-4 border-b bg-gray-50">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {filteredTickets.length} tickets
              </span>
            </div>
            
            {/* Quick priority indicators */}
            <div className="flex gap-1">
              {criticalCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {criticalCount} críticos
                </Badge>
              )}
              {highCount > 0 && (
                <Badge variant="secondary" className="text-xs border-orange-500 text-orange-700">
                  {highCount} altos
                </Badge>
              )}
            </div>
          </div>
          
          <Input
            placeholder="Buscar por título ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm"
          />
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="waiting_for_agent">Aguardando</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Warning for old tickets */}
          {oldTickets > 0 && (
            <div className="text-xs text-orange-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {oldTickets} ticket{oldTickets > 1 ? 's' : ''} com mais de 24h
            </div>
          )}
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTickets.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Nenhum ticket encontrado</p>
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchTerm('')}
                className="mt-2 text-xs"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 ${getPriorityColor(ticket.priority)} ${
                  selectedTicket?.id === ticket.id ? 'ring-2 ring-blue-500 shadow-md bg-blue-50' : ''
                }`}
                onClick={() => onTicketSelect(ticket)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        {getPriorityIcon(ticket.priority)}
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          #{ticket.id.slice(-6)} - {ticket.title}
                        </h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${statusColors[ticket.status]} text-white text-xs ml-2 flex-shrink-0`}
                      >
                        {statusLabels[ticket.status]}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={
                          ticket.priority === "critical" 
                            ? "border-red-500 text-red-500" 
                            : ticket.priority === "high"
                              ? "border-orange-500 text-orange-500"
                              : ticket.priority === "medium" 
                                ? "border-yellow-500 text-yellow-500" 
                                : "border-blue-500 text-blue-500"
                        }>
                          {priorityLabels[ticket.priority]}
                        </Badge>
                      </div>
                      
                      <div className={`flex items-center gap-1 ${getTicketAgeColor(ticket.createdAt)}`}>
                        <Clock className="h-3 w-3" />
                        <span>{getTimeAgo(ticket.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>Cliente: {ticket.userId}</span>
                      <span>•</span>
                      <span className="truncate">{ticket.category}</span>
                    </div>

                    {ticket.aiProcessed && (
                      <div className="flex items-center gap-1 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600">IA processada</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketQueue;
