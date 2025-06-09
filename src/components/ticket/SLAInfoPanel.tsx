
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { Ticket } from "@/types";
import { differenceInMinutes, differenceInHours, isPast } from "date-fns";

interface SLAInfoPanelProps {
  ticket: Ticket;
  formatDate: (date: Date) => string;
}

const SLAInfoPanel: React.FC<SLAInfoPanelProps> = ({ ticket, formatDate }) => {
  // Determine whether deadlines exist and their status
  const hasFirstResponseDeadline = !!ticket.firstResponseDeadline;
  const hasResolutionDeadline = !!ticket.resolutionDeadline;
  
  const isFirstResponseBreached = hasFirstResponseDeadline && 
    isPast(new Date(ticket.firstResponseDeadline));
  
  const isResolutionBreached = hasResolutionDeadline && 
    isPast(new Date(ticket.resolutionDeadline));
  
  // Calculate time remaining if deadlines exist
  const getTimeRemaining = (deadline: Date | undefined) => {
    if (!deadline) return null;
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    
    if (isPast(deadlineDate)) {
      const minutesLate = differenceInMinutes(now, deadlineDate);
      if (minutesLate < 60) {
        return `${minutesLate} minutos atrasado`;
      } else {
        const hoursLate = differenceInHours(now, deadlineDate);
        return `${hoursLate} hora${hoursLate !== 1 ? 's' : ''} atrasado`;
      }
    } else {
      const minutesRemaining = differenceInMinutes(deadlineDate, now);
      if (minutesRemaining < 60) {
        return `${minutesRemaining} minutos restantes`;
      } else {
        const hoursRemaining = differenceInHours(deadlineDate, now);
        return `${hoursRemaining} hora${hoursRemaining !== 1 ? 's' : ''} restantes`;
      }
    }
  };
  
  // Get status badge color
  const getSLAStatusBadge = (isBreached: boolean, deadline?: Date) => {
    if (!deadline) return null;
    
    if (isBreached) {
      return <Badge variant="destructive">SLA Violado</Badge>;
    }
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const minutesRemaining = differenceInMinutes(deadlineDate, now);
    
    if (minutesRemaining < 60) {
      return <Badge variant="destructive">Crítico</Badge>;
    } else if (minutesRemaining < 180) {
      return <Badge variant="warning">Em Risco</Badge>;
    } else {
      return <Badge variant="success">No Prazo</Badge>;
    }
  };

  if (!hasFirstResponseDeadline && !hasResolutionDeadline) {
    return null; // Don't render if no SLA info available
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          SLA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasFirstResponseDeadline && (
          <div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Primeira Resposta</p>
              {getSLAStatusBadge(isFirstResponseBreached, ticket.firstResponseDeadline)}
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-muted-foreground">
                {formatDate(new Date(ticket.firstResponseDeadline!))}
              </p>
              <p className="text-sm font-medium">
                {getTimeRemaining(ticket.firstResponseDeadline)}
              </p>
            </div>
            {isFirstResponseBreached && (
              <div className="mt-1 flex items-center text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>SLA de primeira resposta violado</span>
              </div>
            )}
          </div>
        )}
        
        {hasResolutionDeadline && (
          <div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Resolução</p>
              {getSLAStatusBadge(isResolutionBreached, ticket.resolutionDeadline)}
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-muted-foreground">
                {formatDate(new Date(ticket.resolutionDeadline!))}
              </p>
              <p className="text-sm font-medium">
                {getTimeRemaining(ticket.resolutionDeadline)}
              </p>
            </div>
            {isResolutionBreached && (
              <div className="mt-1 flex items-center text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>SLA de resolução violado</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SLAInfoPanel;
