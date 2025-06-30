
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/types';
import { Search, Filter, Clock, AlertCircle, CheckCircle, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-3 w-3" />;
      case 'in_progress': return <Clock className="h-3 w-3" />;
      case 'resolved': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'waiting_for_agent': return 'bg-amber-100 text-amber-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Compact Search and Filters */}
      <div className="p-3 bg-white border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Buscar tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 py-1.5 text-sm h-8"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
            className="h-7 px-2.5 text-xs"
          >
            Todos ({tickets.length})
          </Button>
          <Button
            variant={filterStatus === 'new' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('new')}
            className="h-7 px-2.5 text-xs"
          >
            Novos ({tickets.filter(t => t.status === 'new').length})
          </Button>
          <Button
            variant={filterStatus === 'waiting_for_agent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('waiting_for_agent')}
            className="h-7 px-2.5 text-xs"
          >
            Aguardando ({tickets.filter(t => t.status === 'waiting_for_agent').length})
          </Button>
        </div>
      </div>

      {/* Compact Ticket List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTickets.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs">Nenhum ticket encontrado</p>
            {searchTerm && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setSearchTerm('')}
                className="mt-1 text-xs"
              >
                Limpar busca
              </Button>
            )}
          </div>
        ) : (
          <div className="p-1.5 space-y-1.5">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-sm border-l-2",
                  selectedTicket?.id === ticket.id 
                    ? "ring-1 ring-blue-500 bg-blue-50 border-l-blue-500" 
                    : "hover:bg-gray-50 border-l-transparent"
                )}
                onClick={() => onTicketSelect(ticket)}
              >
                <CardContent className="p-2.5">
                  <div className="space-y-1.5">
                    {/* Compact Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            #{ticket.id.slice(-6)}
                          </span>
                          <Badge className={cn("text-xs px-1 py-0", getPriorityColor(ticket.priority))}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-xs text-gray-900 line-clamp-1 leading-tight">
                          {ticket.title}
                        </h3>
                      </div>
                    </div>

                    {/* Compact Description */}
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {ticket.description}
                    </p>

                    {/* Compact Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="truncate max-w-16">
                            {ticket.userId || 'Cliente'}
                          </span>
                        </div>
                        <Badge className={cn("text-xs px-1 py-0", getStatusColor(ticket.status))}>
                          <div className="flex items-center gap-0.5">
                            {getStatusIcon(ticket.status)}
                            <span className="hidden sm:inline">
                              {ticket.status === 'new' ? 'Novo' :
                               ticket.status === 'waiting_for_agent' ? 'Aguardando' :
                               ticket.status === 'in_progress' ? 'Em Progresso' :
                               'Resolvido'}
                            </span>
                          </div>
                        </Badge>
                      </div>
                      <span className="whitespace-nowrap text-xs">
                        {formatDistanceToNow(new Date(ticket.createdAt), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>
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
