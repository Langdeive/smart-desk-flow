
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

// Fallback category labels para compatibilidade
export const fallbackCategoryLabels: Record<string, string> = {
  technical_issue: "Problema Técnico",
  feature_request: "Solicitação de Recurso",
  billing: "Faturamento",
  general_inquiry: "Dúvida Geral",
  other: "Outro",
};

// Função helper para obter a label de uma categoria
export const getCategoryLabel = (categoryKey: string, categories?: { key: string; name: string }[]): string => {
  // Primeiro tenta encontrar na lista de categorias dinâmicas
  const dynamicCategory = categories?.find(cat => cat.key === categoryKey);
  if (dynamicCategory) {
    return dynamicCategory.name;
  }
  
  // Fallback para categorias hardcoded
  return fallbackCategoryLabels[categoryKey] || categoryKey;
};

// Função helper para obter a cor de uma categoria
export const getCategoryColor = (categoryKey: string, categories?: { key: string; color: string }[]): string => {
  // Primeiro tenta encontrar na lista de categorias dinâmicas
  const dynamicCategory = categories?.find(cat => cat.key === categoryKey);
  if (dynamicCategory) {
    return dynamicCategory.color;
  }
  
  // Fallback para cores padrão baseadas na categoria
  const defaultColors: Record<string, string> = {
    technical_issue: "#ef4444",
    feature_request: "#3b82f6",
    billing: "#f59e0b",
    general_inquiry: "#6b7280",
    other: "#8b5cf6",
  };
  
  return defaultColors[categoryKey] || "#6b7280";
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
