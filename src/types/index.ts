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
  contactId?: string;
};

export type TicketHistoryItem = {
  id: string;
  ticket_id: string;
  user_id?: string | null;
  tipo_acao: string;
  valor_anterior?: string | null;
  valor_novo?: string | null;
  created_at: string;
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
  company_id: string;
  name: string;
  external_id?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string; // Changed from Date to string to match Supabase response
};

export type ClientContact = {
  id: string;
  client_id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  is_primary: boolean;
  created_at: string; // Changed from Date to string to match Supabase response
};

export type ContactInput = {
  name?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
};

export type ClientFormData = {
  name: string;
  external_id?: string;
  notes?: string;
  is_active?: boolean;
  contacts: ContactInput[];
};
