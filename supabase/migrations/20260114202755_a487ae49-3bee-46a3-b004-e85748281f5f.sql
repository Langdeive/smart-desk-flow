-- Fix 1: Lock down landing_leads table - remove permissive SELECT policy
-- Keep INSERT for anonymous (will be handled by edge function with service role)
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.landing_leads;

-- Add explicit deny policies for SELECT, UPDATE, DELETE
-- Only service role (edge functions) can access this data
CREATE POLICY "Deny all reads via RLS" ON public.landing_leads
FOR SELECT USING (false);

CREATE POLICY "Deny all updates via RLS" ON public.landing_leads
FOR UPDATE USING (false);

CREATE POLICY "Deny all deletes via RLS" ON public.landing_leads
FOR DELETE USING (false);