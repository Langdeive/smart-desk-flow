-- Tabela para armazenar leads do formulário da landing page
CREATE TABLE public.landing_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  company TEXT NOT NULL,
  interest TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  contacted_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Habilita RLS
ALTER TABLE public.landing_leads ENABLE ROW LEVEL SECURITY;

-- Permite INSERT anônimo (formulário público)
CREATE POLICY "Allow anonymous insert" 
ON public.landing_leads 
FOR INSERT 
WITH CHECK (true);

-- Apenas usuários autenticados podem ver os leads (para o admin depois)
CREATE POLICY "Authenticated users can view leads" 
ON public.landing_leads 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Adiciona índice para busca por data
CREATE INDEX idx_landing_leads_created_at ON public.landing_leads(created_at DESC);