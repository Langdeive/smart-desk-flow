
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Ticket } from '@/types';
import { User, Calendar, Tag, AlertCircle, Clock } from 'lucide-react';
import { statusLabels, priorityLabels, formatDate } from '@/components/ticket/TicketUtils';

interface WorkspaceDetailsProps {
  ticket: Ticket;
  onTicketUpdate: () => void;
}

const WorkspaceDetails: React.FC<WorkspaceDetailsProps> = ({ ticket }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Informações do Ticket
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
              <Badge variant="outline">
                {statusLabels[ticket.status]}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Prioridade</p>
              <Badge variant="outline" className={
                ticket.priority === "high" || ticket.priority === "critical" 
                  ? "border-red-500 text-red-500" 
                  : ticket.priority === "medium" 
                    ? "border-orange-500 text-orange-500" 
                    : "border-blue-500 text-blue-500"
              }>
                {priorityLabels[ticket.priority]}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Categoria
            </p>
            <p className="text-sm">{ticket.category}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
              <User className="h-4 w-4" />
              Cliente
            </p>
            <p className="text-sm">{ticket.userId}</p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Criado em
              </p>
              <p className="text-sm">{formatDate(ticket.createdAt)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Atualizado em
              </p>
              <p className="text-sm">{formatDate(ticket.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </CardContent>
      </Card>

      {ticket.aiProcessed && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análise da IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ticket.aiClassification && (
              <div>
                <p className="text-sm font-medium text-gray-500">Classificação</p>
                <p className="text-sm">{ticket.aiClassification}</p>
              </div>
            )}
            
            {ticket.confidenceScore && (
              <div>
                <p className="text-sm font-medium text-gray-500">Nível de Confiança</p>
                <p className="text-sm">{Math.round(ticket.confidenceScore * 100)}%</p>
              </div>
            )}
            
            {ticket.needsAdditionalInfo && (
              <div>
                <Badge variant="outline" className="border-orange-500 text-orange-500">
                  Precisa de informações adicionais
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkspaceDetails;
