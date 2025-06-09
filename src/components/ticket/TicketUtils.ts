
import { TicketStatus, TicketPriority } from "@/types";

export const statusLabels: Record<TicketStatus, string> = {
  new: "Novo",
  open: "Aberto",
  waiting_for_client: "Aguardando Cliente",
  waiting_for_agent: "Aguardando Agente",
  in_progress: "Em Progresso",
  resolved: "Resolvido",
  closed: "Fechado",
  triaged: "Triado",
};

export const priorityLabels: Record<TicketPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};

export const getStatusColor = (status: TicketStatus): string => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "open":
      return "bg-cyan-100 text-cyan-800 border-cyan-300";
    case "waiting_for_client":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "waiting_for_agent":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "in_progress":
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-300";
    case "closed":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "triaged":
      return "bg-teal-100 text-teal-800 border-teal-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getPriorityColor = (priority: TicketPriority): string => {
  switch (priority) {
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "medium":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "high":
      return "bg-red-100 text-red-800 border-red-300";
    case "critical":
      return "bg-red-200 text-red-900 border-red-400";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Create statusColors for backward compatibility with SolveFlow palette
export const statusColors: Record<TicketStatus, string> = {
  new: "bg-blue-deep",
  open: "bg-turquoise-vibrant",
  waiting_for_client: "bg-orange-500",
  waiting_for_agent: "bg-purple-intense",
  in_progress: "bg-blue-600",
  resolved: "bg-green-success",
  closed: "bg-gray-medium",
  triaged: "bg-turquoise-vibrant",
};
