
import React from "react";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TicketPriority } from "@/types";

interface TicketFormHeaderProps {
  slaText: string;
  priority: TicketPriority;
}

export const TicketFormHeader: React.FC<TicketFormHeaderProps> = ({ slaText, priority }) => {
  const priorityColors: Record<TicketPriority, string> = {
    low: "bg-slate-500",
    medium: "bg-blue-500",
    high: "bg-orange-500",
    critical: "bg-red-500"
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Abrir Novo Chamado</h1>
        <Badge className={`${priorityColors[priority]} hover:${priorityColors[priority]}`}>
          {slaText}
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-60">
                O SLA (Acordo de Nível de Serviço) define o tempo máximo para primeira resposta com base na prioridade do chamado.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-gray-500 mb-6">
        Preencha os detalhes do seu chamado. Nosso sistema analisará automaticamente sua solicitação.
      </p>
    </div>
  );
};
