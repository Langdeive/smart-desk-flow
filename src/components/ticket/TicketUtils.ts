
import { TicketStatus, TicketPriority } from "@/types";

export const statusColors: Record<TicketStatus, string> = {
  new: "bg-blue-500",
  waiting_for_client: "bg-yellow-500",
  waiting_for_agent: "bg-purple-500",
  in_progress: "bg-orange-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
};

export const statusLabels: Record<TicketStatus, string> = {
  new: "Novo",
  waiting_for_client: "Aguardando Cliente",
  waiting_for_agent: "Aguardando Agente",
  in_progress: "Em Progresso",
  resolved: "Resolvido",
  closed: "Fechado",
};

export const priorityLabels: Record<TicketPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};

export const priorityColors: Record<TicketPriority, string> = {
  low: "border-blue-500 text-blue-500",
  medium: "border-orange-500 text-orange-500",
  high: "border-red-500 text-red-500",
  critical: "border-red-700 text-red-700",
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
