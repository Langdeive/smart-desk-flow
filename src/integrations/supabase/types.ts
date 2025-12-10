export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agent_categories: {
        Row: {
          agent_id: string
          category_id: string
          competence_level: number | null
          created_at: string
          id: string
        }
        Insert: {
          agent_id: string
          category_id: string
          competence_level?: number | null
          created_at?: string
          id?: string
        }
        Update: {
          agent_id?: string
          category_id?: string
          competence_level?: number | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      agentes: {
        Row: {
          company_id: string
          created_at: string
          email: string
          funcao: string
          id: string
          nome: string
          status: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email: string
          funcao: string
          id?: string
          nome: string
          status?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string
          funcao?: string
          id?: string
          nome?: string
          status?: string
        }
        Relationships: []
      }
      article_generation_logs: {
        Row: {
          company_id: string
          created_at: string
          details: Json | null
          event_type: string
          helena_version: string | null
          id: string
          processing_time_ms: number | null
          ticket_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          details?: Json | null
          event_type: string
          helena_version?: string | null
          id?: string
          processing_time_ms?: number | null
          ticket_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          details?: Json | null
          event_type?: string
          helena_version?: string | null
          id?: string
          processing_time_ms?: number | null
          ticket_id?: string
        }
        Relationships: []
      }
      attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          message_id: string | null
          ticket_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          message_id?: string | null
          ticket_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_default: boolean
          key: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          key: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          key?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_contacts: {
        Row: {
          client_id: string
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string | null
          phone: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string | null
          phone?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          company_id: string
          created_at: string | null
          documento: string | null
          email: string
          id: string
          nome: string
          observacoes: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          documento?: string | null
          email: string
          id?: string
          nome: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          documento?: string | null
          email?: string
          id?: string
          nome?: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          company_id: string
          created_at: string | null
          external_id: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          id: string
          name: string
          plan: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          plan?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          plan?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_plan_fkey"
            columns: ["plan"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["nome"]
          },
        ]
      }
      developer_audit_logs: {
        Row: {
          action: string
          created_at: string
          developer_id: string
          id: string
          ip_address: unknown
          new_value: Json | null
          old_value: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string
          developer_id: string
          id?: string
          ip_address?: unknown
          new_value?: Json | null
          old_value?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          developer_id?: string
          id?: string
          ip_address?: unknown
          new_value?: Json | null
          old_value?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      historico_tickets: {
        Row: {
          created_at: string
          id: string
          ticket_id: string
          tipo_acao: string
          user_id: string | null
          valor_anterior: string | null
          valor_novo: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ticket_id: string
          tipo_acao: string
          user_id?: string | null
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ticket_id?: string
          tipo_acao?: string
          user_id?: string | null
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_tickets_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_articles: {
        Row: {
          company_id: string
          content: string
          created_at: string
          id: string
          is_public: boolean
          keywords: string[]
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string
          id?: string
          is_public?: boolean
          keywords?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean
          keywords?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_automatic: boolean
          is_from_client: boolean
          ticket_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_automatic?: boolean
          is_from_client?: boolean
          ticket_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_automatic?: boolean
          is_from_client?: boolean
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_integration_logs: {
        Row: {
          company_id: string
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          last_attempt_at: string | null
          max_retries: number
          next_retry_at: string | null
          request_payload: Json
          resource_id: string
          resource_type: string
          response_body: string | null
          response_status: number | null
          retry_count: number
          status: string
          webhook_url: string
        }
        Insert: {
          company_id: string
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          last_attempt_at?: string | null
          max_retries?: number
          next_retry_at?: string | null
          request_payload: Json
          resource_id: string
          resource_type: string
          response_body?: string | null
          response_status?: number | null
          retry_count?: number
          status?: string
          webhook_url: string
        }
        Update: {
          company_id?: string
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          last_attempt_at?: string | null
          max_retries?: number
          next_retry_at?: string | null
          request_payload?: Json
          resource_id?: string
          resource_type?: string
          response_body?: string | null
          response_status?: number | null
          retry_count?: number
          status?: string
          webhook_url?: string
        }
        Relationships: []
      }
      pending_articles: {
        Row: {
          analysis_summary: string | null
          approved_at: string | null
          approved_by: string | null
          company_id: string
          confidence_score: number
          content: string
          created_at: string
          id: string
          keywords: string[] | null
          published_article_id: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          similar_articles_found: Json | null
          status: string
          ticket_id: string
          title: string
        }
        Insert: {
          analysis_summary?: string | null
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          confidence_score?: number
          content: string
          created_at?: string
          id?: string
          keywords?: string[] | null
          published_article_id?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          similar_articles_found?: Json | null
          status?: string
          ticket_id: string
          title: string
        }
        Update: {
          analysis_summary?: string | null
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          confidence_score?: number
          content?: string
          created_at?: string
          id?: string
          keywords?: string[] | null
          published_article_id?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          similar_articles_found?: Json | null
          status?: string
          ticket_id?: string
          title?: string
        }
        Relationships: []
      }
      planos: {
        Row: {
          criado_em: string | null
          descricao: string | null
          eventos_por_semana: number | null
          id: string
          nome: string
        }
        Insert: {
          criado_em?: string | null
          descricao?: string | null
          eventos_por_semana?: number | null
          id?: string
          nome: string
        }
        Update: {
          criado_em?: string | null
          descricao?: string | null
          eventos_por_semana?: number | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      suggested_responses: {
        Row: {
          applied: boolean | null
          applied_at: string | null
          applied_by: string | null
          approved: boolean | null
          confidence: number
          created_at: string
          id: string
          message: string
          ticket_id: string
        }
        Insert: {
          applied?: boolean | null
          applied_at?: string | null
          applied_by?: string | null
          approved?: boolean | null
          confidence: number
          created_at?: string
          id?: string
          message: string
          ticket_id: string
        }
        Update: {
          applied?: boolean | null
          applied_at?: string | null
          applied_by?: string | null
          approved?: boolean | null
          confidence?: number
          created_at?: string
          id?: string
          message?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggested_responses_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          agent_id: string | null
          ai_classification: string | null
          ai_processed: boolean
          category: string
          company_id: string
          confidence_score: number | null
          contact_id: string | null
          created_at: string
          description: string
          first_response_deadline: string | null
          id: string
          needs_additional_info: boolean | null
          needs_human_review: boolean
          priority: string
          resolution_deadline: string | null
          sla_status: string | null
          source: string
          status: string
          suggested_priority: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          ai_classification?: string | null
          ai_processed?: boolean
          category: string
          company_id: string
          confidence_score?: number | null
          contact_id?: string | null
          created_at?: string
          description: string
          first_response_deadline?: string | null
          id?: string
          needs_additional_info?: boolean | null
          needs_human_review?: boolean
          priority?: string
          resolution_deadline?: string | null
          sla_status?: string | null
          source?: string
          status?: string
          suggested_priority?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          ai_classification?: string | null
          ai_processed?: boolean
          category?: string
          company_id?: string
          confidence_score?: number | null
          contact_id?: string | null
          created_at?: string
          description?: string
          first_response_deadline?: string | null
          id?: string
          needs_additional_info?: boolean | null
          needs_human_review?: boolean
          priority?: string
          resolution_deadline?: string | null
          sla_status?: string | null
          source?: string
          status?: string
          suggested_priority?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "client_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action: string
          company_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          company_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          company_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_companies: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          id: string
          language: string | null
          notifications: Json | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          id?: string
          language?: string | null
          notifications?: Json | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          id?: string
          language?: string | null
          notifications?: Json | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_security_settings: {
        Row: {
          account_locked_until: string | null
          allowed_ip_addresses: string[] | null
          created_at: string
          failed_login_attempts: number | null
          id: string
          login_notifications: boolean | null
          password_changed_at: string | null
          recovery_codes: string[] | null
          session_timeout: number | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_locked_until?: string | null
          allowed_ip_addresses?: string[] | null
          created_at?: string
          failed_login_attempts?: number | null
          id?: string
          login_notifications?: boolean | null
          password_changed_at?: string | null
          recovery_codes?: string[] | null
          session_timeout?: number | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_locked_until?: string | null
          allowed_ip_addresses?: string[] | null
          created_at?: string
          failed_login_attempts?: number | null
          id?: string
          login_notifications?: boolean | null
          password_changed_at?: string | null
          recovery_codes?: string[] | null
          session_timeout?: number | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          criado_em: string | null
          google_access_token: string | null
          google_refresh_token: string | null
          id: string
          nome: string | null
          plano_id: string | null
          token_expiration: string | null
          whatsapp_id: string
        }
        Insert: {
          criado_em?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          id?: string
          nome?: string | null
          plano_id?: string | null
          token_expiration?: string | null
          whatsapp_id: string
        }
        Update: {
          criado_em?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          id?: string
          nome?: string | null
          plano_id?: string | null
          token_expiration?: string | null
          whatsapp_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      agents_view: {
        Row: {
          company_id: string | null
          created_at: string | null
          email: string | null
          funcao: string | null
          id: string | null
          nome: string | null
          status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes_view: {
        Row: {
          company_id: string | null
          created_at: string | null
          documento: string | null
          id: string | null
          is_active: boolean | null
          nome: string | null
          observacoes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          documento?: string | null
          id?: string | null
          is_active?: boolean | null
          nome?: string | null
          observacoes?: string | null
          status?: never
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          documento?: string | null
          id?: string | null
          is_active?: boolean | null
          nome?: string | null
          observacoes?: string | null
          status?: never
          updated_at?: string | null
        }
        Relationships: []
      }
      n8n_integration_stats: {
        Row: {
          avg_retry_count: number | null
          company_id: string | null
          event_type: string | null
          failed_requests: number | null
          last_request_at: string | null
          max_retries_reached: number | null
          successful_requests: number | null
          total_requests: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_pending_article: {
        Args: {
          p_agent_id: string
          p_final_content?: string
          p_final_keywords?: string[]
          p_final_title?: string
          p_is_public?: boolean
          p_pending_article_id: string
        }
        Returns: string
      }
      belongs_to_company: { Args: { company_id: string }; Returns: boolean }
      cleanup_old_n8n_logs: { Args: never; Returns: number }
      delete_documents_by_article_id: {
        Args: { article_id: string }
        Returns: undefined
      }
      fix_inconsistent_user_companies: { Args: never; Returns: undefined }
      get_system_setting_value: {
        Args: { p_company_id: string; p_key: string }
        Returns: Json
      }
      get_user_role_in_company: {
        Args: { company_id: string; user_id: string }
        Returns: string
      }
      get_user_role_statistics: {
        Args: { p_company_id: string; p_user_id: string }
        Returns: {
          avg_resolution_time_hours: number
          resolved_tickets: number
          response_rate: number
          satisfaction_score: number
          tickets_this_month: number
          total_tickets: number
        }[]
      }
      has_role: { Args: { required_role: string }; Returns: boolean }
      is_event_enabled: {
        Args: { p_company_id: string; p_event_key: string }
        Returns: boolean
      }
      log_user_activity: {
        Args: {
          p_action: string
          p_company_id: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type?: string
          p_user_id: string
        }
        Returns: string
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      register_agent: {
        Args: {
          email: string
          empresa_id: string
          funcao?: string
          nome: string
        }
        Returns: Json
      }
      reject_pending_article: {
        Args: {
          p_agent_id: string
          p_pending_article_id: string
          p_rejection_reason: string
        }
        Returns: undefined
      }
      retry_failed_n8n_requests: { Args: never; Returns: number }
      send_to_n8n_webhook: {
        Args: {
          p_company_id: string
          p_event_type: string
          p_payload: Json
          p_resource_id: string
          p_resource_type: string
        }
        Returns: string
      }
      user_belongs_to_company: {
        Args: { company_id: string; user_id: string }
        Returns: boolean
      }
      user_belongs_to_company_safe: {
        Args: { company_id: string; user_id: string }
        Returns: boolean
      }
      user_is_admin_or_owner: {
        Args: { company_id: string; user_id: string }
        Returns: boolean
      }
      validate_company_setup: {
        Args: { user_email: string }
        Returns: {
          company_exists: boolean
          company_id: string
          user_company_link_exists: boolean
          user_exists: boolean
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
