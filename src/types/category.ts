
export interface Category {
  id: string;
  company_id: string;
  key: string;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryInput {
  key: string;
  name: string;
  description?: string;
  color?: string;
  is_active?: boolean;
}

export interface AgentCategory {
  id: string;
  agent_id: string;
  category_id: string;
  competence_level: number;
  created_at: string;
}

export interface CategoryWithCount extends Category {
  ticket_count?: number;
}
