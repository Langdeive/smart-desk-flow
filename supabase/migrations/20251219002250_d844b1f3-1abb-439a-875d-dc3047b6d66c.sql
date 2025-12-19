-- =====================================================
-- LIMPEZA COMPLETA DO BANCO - MANTER APENAS landing_leads
-- =====================================================

-- 1. REMOVER TRIGGERS PRIMEIRO (para evitar dependências)
DROP TRIGGER IF EXISTS update_ticket_updated_at_trigger ON public.tickets;
DROP TRIGGER IF EXISTS trigger_ticket_created ON public.tickets;
DROP TRIGGER IF EXISTS trigger_ticket_updated ON public.tickets;
DROP TRIGGER IF EXISTS trigger_helena_article_generation ON public.tickets;
DROP TRIGGER IF EXISTS trigger_message_created ON public.messages;
DROP TRIGGER IF EXISTS trigger_suggested_response_applied ON public.suggested_responses;
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS update_knowledge_articles_updated_at ON public.knowledge_articles;
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON public.system_settings;
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
DROP TRIGGER IF EXISTS update_user_security_settings_updated_at ON public.user_security_settings;
DROP TRIGGER IF EXISTS ensure_single_primary_contact_trigger ON public.client_contacts;
DROP TRIGGER IF EXISTS create_default_categories_trigger ON public.companies;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. REMOVER VIEWS
DROP VIEW IF EXISTS public.agents_view CASCADE;
DROP VIEW IF EXISTS public.clientes_view CASCADE;
DROP VIEW IF EXISTS public.n8n_integration_stats CASCADE;

-- 3. REMOVER TABELAS (ordem específica por dependências)
DROP TABLE IF EXISTS public.agent_categories CASCADE;
DROP TABLE IF EXISTS public.attachments CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.suggested_responses CASCADE;
DROP TABLE IF EXISTS public.historico_tickets CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.client_contacts CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.agentes CASCADE;
DROP TABLE IF EXISTS public.pending_articles CASCADE;
DROP TABLE IF EXISTS public.article_generation_logs CASCADE;
DROP TABLE IF EXISTS public.knowledge_articles CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.n8n_integration_logs CASCADE;
DROP TABLE IF EXISTS public.n8n_chat_histories CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.user_activity_logs CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.user_security_settings CASCADE;
DROP TABLE IF EXISTS public.developer_audit_logs CASCADE;
DROP TABLE IF EXISTS public.user_companies CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.planos CASCADE;

-- 4. REMOVER FUNÇÕES CUSTOMIZADAS
DROP FUNCTION IF EXISTS public.fix_inconsistent_user_companies() CASCADE;
DROP FUNCTION IF EXISTS public.delete_documents_by_article_id(text) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role_in_company(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_system_setting_value(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.ensure_single_primary_contact() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at_user_security_settings() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(text) CASCADE;
DROP FUNCTION IF EXISTS public.is_event_enabled(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at_user_preferences() CASCADE;
DROP FUNCTION IF EXISTS public.send_to_n8n_webhook(uuid, text, text, uuid, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.trigger_helena_article_generation() CASCADE;
DROP FUNCTION IF EXISTS public.user_belongs_to_company_safe(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.update_ticket_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.validate_company_setup(text) CASCADE;
DROP FUNCTION IF EXISTS public.user_is_admin_or_owner(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.trigger_suggested_response_applied() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.user_belongs_to_company(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.belongs_to_company(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_old_n8n_logs() CASCADE;
DROP FUNCTION IF EXISTS public.create_company_on_signup() CASCADE;
DROP FUNCTION IF EXISTS public.approve_pending_article(uuid, uuid, text, text, text[], boolean) CASCADE;
DROP FUNCTION IF EXISTS public.create_default_categories_for_company() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role_statistics(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.log_user_activity(uuid, uuid, text, text, uuid, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.match_documents(vector, integer, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.register_agent(text, text, uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.reject_pending_article(uuid, uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.retry_failed_n8n_requests() CASCADE;
DROP FUNCTION IF EXISTS public.trigger_message_created() CASCADE;
DROP FUNCTION IF EXISTS public.trigger_ticket_created() CASCADE;
DROP FUNCTION IF EXISTS public.trigger_ticket_updated() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 5. REMOVER EXTENSÃO PGVECTOR (não utilizada pela landing page)
DROP EXTENSION IF EXISTS vector CASCADE;