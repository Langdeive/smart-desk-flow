
-- Criar tabela para artigos pendentes de aprovação da Helena
CREATE TABLE public.pending_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  ticket_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  confidence_score NUMERIC(3,2) NOT NULL DEFAULT 0.0,
  analysis_summary TEXT,
  similar_articles_found JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'editing')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejected_by UUID,
  rejection_reason TEXT,
  published_article_id UUID
);

-- Criar tabela para logs de geração de artigos pela Helena
CREATE TABLE public.article_generation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  ticket_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'analysis_started', 'similar_found', 'article_generated', 'approval_sent', etc
  details JSONB,
  processing_time_ms INTEGER,
  helena_version TEXT DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar trigger para detectar tickets resolvidos e enviar para Helena
CREATE OR REPLACE FUNCTION trigger_helena_article_generation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
  is_enabled BOOLEAN;
BEGIN
  -- Verifica se o status mudou para 'resolved'
  IF OLD.status != 'resolved' AND NEW.status = 'resolved' THEN
    -- Verifica se processamento está habilitado
    is_enabled := public.is_event_enabled(NEW.company_id, 'helenaArticleGeneration');
    
    IF NOT is_enabled THEN
      RETURN NEW;
    END IF;
    
    -- Monta payload para Helena
    payload := jsonb_build_object(
      'eventType', 'ticket.resolved_for_helena',
      'data', jsonb_build_object(
        'ticket', row_to_json(NEW),
        'previousTicket', row_to_json(OLD)
      ),
      'timestamp', now(),
      'companyId', NEW.company_id
    );
    
    -- Envia para n8n Helena workflow
    PERFORM public.send_to_n8n_webhook(
      NEW.company_id,
      'ticket.resolved_for_helena',
      'ticket',
      NEW.id,
      payload
    );
    
    -- Log do evento
    INSERT INTO public.article_generation_logs (
      company_id,
      ticket_id,
      event_type,
      details
    ) VALUES (
      NEW.company_id,
      NEW.id,
      'helena_trigger_sent',
      jsonb_build_object('webhook_triggered', true)
    );
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to trigger Helena article generation: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Aplicar trigger na tabela tickets
DROP TRIGGER IF EXISTS helena_article_generation_trigger ON public.tickets;
CREATE TRIGGER helena_article_generation_trigger
  AFTER UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION trigger_helena_article_generation();

-- Adicionar configuração padrão para Helena no system_settings
INSERT INTO public.system_settings (key, value, company_id)
SELECT 
  'helenaArticleGeneration',
  'true'::jsonb,
  NULL  -- Configuração global padrão
WHERE NOT EXISTS (
  SELECT 1 FROM public.system_settings 
  WHERE key = 'helenaArticleGeneration' AND company_id IS NULL
);

-- Criar função para aprovar artigo pendente
CREATE OR REPLACE FUNCTION approve_pending_article(
  p_pending_article_id UUID,
  p_agent_id UUID,
  p_final_title TEXT DEFAULT NULL,
  p_final_content TEXT DEFAULT NULL,
  p_final_keywords TEXT[] DEFAULT NULL,
  p_is_public BOOLEAN DEFAULT TRUE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  pending_article RECORD;
  new_article_id UUID;
BEGIN
  -- Busca o artigo pendente
  SELECT * INTO pending_article
  FROM public.pending_articles
  WHERE id = p_pending_article_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending article not found or already processed';
  END IF;
  
  -- Cria o artigo na base de conhecimento
  INSERT INTO public.knowledge_articles (
    company_id,
    title,
    content,
    keywords,
    is_public
  ) VALUES (
    pending_article.company_id,
    COALESCE(p_final_title, pending_article.title),
    COALESCE(p_final_content, pending_article.content),
    COALESCE(p_final_keywords, pending_article.keywords),
    p_is_public
  ) RETURNING id INTO new_article_id;
  
  -- Atualiza o artigo pendente
  UPDATE public.pending_articles
  SET 
    status = 'approved',
    approved_at = now(),
    approved_by = p_agent_id,
    published_article_id = new_article_id
  WHERE id = p_pending_article_id;
  
  -- Log da aprovação
  INSERT INTO public.article_generation_logs (
    company_id,
    ticket_id,
    event_type,
    details
  ) VALUES (
    pending_article.company_id,
    pending_article.ticket_id,
    'article_approved',
    jsonb_build_object(
      'pending_article_id', p_pending_article_id,
      'published_article_id', new_article_id,
      'approved_by', p_agent_id
    )
  );
  
  RETURN new_article_id;
END;
$$;

-- Criar função para rejeitar artigo pendente
CREATE OR REPLACE FUNCTION reject_pending_article(
  p_pending_article_id UUID,
  p_agent_id UUID,
  p_rejection_reason TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  pending_article RECORD;
BEGIN
  -- Busca o artigo pendente
  SELECT * INTO pending_article
  FROM public.pending_articles
  WHERE id = p_pending_article_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending article not found or already processed';
  END IF;
  
  -- Atualiza o artigo pendente
  UPDATE public.pending_articles
  SET 
    status = 'rejected',
    rejected_at = now(),
    rejected_by = p_agent_id,
    rejection_reason = p_rejection_reason
  WHERE id = p_pending_article_id;
  
  -- Log da rejeição
  INSERT INTO public.article_generation_logs (
    company_id,
    ticket_id,
    event_type,
    details
  ) VALUES (
    pending_article.company_id,
    pending_article.ticket_id,
    'article_rejected',
    jsonb_build_object(
      'pending_article_id', p_pending_article_id,
      'rejected_by', p_agent_id,
      'rejection_reason', p_rejection_reason
    )
  );
END;
$$;
