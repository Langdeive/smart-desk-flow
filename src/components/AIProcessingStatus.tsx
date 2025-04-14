
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Brain, Clock, CheckCircle2 } from "lucide-react";
import type { Ticket } from '@/types';

interface AIProcessingStatusProps {
  ticket: Ticket;
}

export const AIProcessingStatus: React.FC<AIProcessingStatusProps> = ({ ticket }) => {
  // Status visual com base no processamento da IA
  const renderStatus = () => {
    if (!ticket.aiProcessed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="h-3 w-3" />
                Aguardando IA
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ticket aguardando processamento pelo sistema de IA</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    if (ticket.needsHumanReview) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200">
                <Brain className="h-3 w-3" />
                Revisão Humana
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Processado pela IA, aguardando revisão humana</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-3 w-3" />
              Processado
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ticket processado automaticamente pelo sistema de IA</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="ai-processing-status">
      {renderStatus()}
    </div>
  );
};
