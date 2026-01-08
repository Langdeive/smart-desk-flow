-- Add new columns to landing_leads table
ALTER TABLE public.landing_leads 
ADD COLUMN role text,
ADD COLUMN challenge text;

-- Add comment for documentation
COMMENT ON COLUMN public.landing_leads.role IS 'User job role/function';
COMMENT ON COLUMN public.landing_leads.challenge IS 'Optional field for user to describe their current challenge (max 2000 chars)';