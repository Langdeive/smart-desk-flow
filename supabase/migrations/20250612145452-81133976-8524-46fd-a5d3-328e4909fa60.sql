
-- Create RPC function to delete documents by article_id from metadata
CREATE OR REPLACE FUNCTION delete_documents_by_article_id(article_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.documents 
  WHERE metadata->>'article_id' = article_id;
END;
$$;
