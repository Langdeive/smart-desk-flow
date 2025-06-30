
-- Tabela para logs de atividade do usuário
CREATE TABLE public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_created_at ON public.user_activity_logs(created_at DESC);
CREATE INDEX idx_user_activity_logs_company_id ON public.user_activity_logs(company_id);

-- Habilitar RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own activity logs" ON public.user_activity_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity logs" ON public.user_activity_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tabela para configurações de segurança do usuário
CREATE TABLE public.user_security_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  login_notifications BOOLEAN DEFAULT true,
  session_timeout INTEGER DEFAULT 480, -- em minutos (8 horas)
  allowed_ip_addresses TEXT[],
  password_changed_at TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE,
  recovery_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own security settings" ON public.user_security_settings
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security settings" ON public.user_security_settings
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own security settings" ON public.user_security_settings
FOR UPDATE USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at_user_security_settings()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at_user_security_settings
  BEFORE UPDATE ON public.user_security_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at_user_security_settings();

-- Função para obter estatísticas por role
CREATE OR REPLACE FUNCTION public.get_user_role_statistics(p_user_id UUID, p_company_id UUID)
RETURNS TABLE(
  total_tickets INTEGER,
  resolved_tickets INTEGER,
  avg_resolution_time_hours NUMERIC,
  tickets_this_month INTEGER,
  response_rate NUMERIC,
  satisfaction_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(t.id)::INTEGER as total_tickets,
    COUNT(CASE WHEN t.status = 'resolved' THEN 1 END)::INTEGER as resolved_tickets,
    COALESCE(AVG(EXTRACT(EPOCH FROM (t.updated_at - t.created_at)) / 3600), 0)::NUMERIC as avg_resolution_time_hours,
    COUNT(CASE WHEN t.created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END)::INTEGER as tickets_this_month,
    CASE 
      WHEN COUNT(t.id) > 0 THEN (COUNT(CASE WHEN t.status = 'resolved' THEN 1 END)::NUMERIC / COUNT(t.id)::NUMERIC * 100)
      ELSE 0
    END as response_rate,
    85.5::NUMERIC as satisfaction_score -- Placeholder - seria calculado com dados reais de feedback
  FROM public.tickets t
  WHERE (t.user_id = p_user_id OR t.agent_id = p_user_id)
    AND t.company_id = p_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para registrar atividade do usuário
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_company_id UUID,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.user_activity_logs (
    user_id,
    company_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    p_user_id,
    p_company_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
