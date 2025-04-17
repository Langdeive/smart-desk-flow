export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "agent" | "client";
  companyId: string;
};

export type Company = {
  id: string;
  name: string;
  domain: string;
  supportEmail?: string;
  plan: "free" | "basic" | "premium";
  createdAt: Date;
};

export type TicketStatus = 
  | "new" 
  | "waiting_for_client" 
  | "waiting_for_agent" 
  | "in_progress" 
  | "resolved" 
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export type TicketCategory = 
  | "technical_issue" 
  | "feature_request" 
  | "billing" 
  | "general_inquiry" 
  | "other";

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  userId: string;
  agentId?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  source: "web" | "email" | "whatsapp";
  aiProcessed: boolean;
  needsHumanReview: boolean;
};

export type TicketHistoryItem = {
  id: string;
  ticket_id: string;
  user_id?: string | null;
  tipo_acao: string;
  valor_anterior?: string | null;
  valor_novo?: string | null;
  created_at: Date;
};

export type Attachment = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  ticketId: string;
  messageId?: string;
  createdAt: Date;
};

export type Message = {
  id: string;
  content: string;
  ticketId: string;
  userId: string;
  createdAt: Date;
  isFromClient: boolean;
  isAutomatic: boolean;
};

export type KnowledgeArticle = {
  id: string;
  title: string;
  content: string;
  ticketId?: string;
  keywords: string[];
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
};

export type Client = {
  id: string;
  empresa_id: string;
  nome: string;
  email: string;
  telefone?: string;
  documento?: string;
  observacoes?: string;
  status: 'ativo' | 'inativo';
  created_at: Date;
};

export type ClientFormData = Omit<Client, 'id' | 'empresa_id' | 'created_at' | 'status'>;
