
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { pipeline } from 'https://esm.sh/@huggingface/transformers@3.0.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🔍 Edge Function called: search-knowledge');

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { query, companyId, limit = 5, similarityThreshold = 0.7 } = await req.json();

    if (!query || !companyId) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: query, companyId' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`🔍 Searching for: "${query}" in company: ${companyId}`);

    // Generate embedding for the search query
    const extractor = await pipeline(
      'feature-extraction',
      'mixedbread-ai/mxbai-embed-xsmall-v1',
      { device: 'cpu' }
    );

    const queryEmbedding = await extractor(query, { 
      pooling: 'mean', 
      normalize: true 
    });

    const queryVector = queryEmbedding.tolist()[0];
    
    console.log(`🎯 Generated query embedding with ${queryVector.length} dimensions`);

    // Use the match_documents function with filters
    const { data: matches, error: searchError } = await supabase.rpc(
      'match_documents',
      {
        query_embedding: queryVector,
        match_count: limit,
        filter: { type: 'knowledge_article' }
      }
    );

    if (searchError) {
      console.error('❌ Search error:', searchError);
      throw searchError;
    }

    console.log(`🎉 Found ${matches?.length || 0} potential matches`);

    // Filter by similarity threshold and get article details
    const relevantMatches = matches?.filter(match => match.similarity >= similarityThreshold) || [];
    
    if (relevantMatches.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        results: [],
        message: 'No relevant articles found for this query'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get full article details from knowledge_articles table
    const articleIds = relevantMatches.map(match => match.metadata.article_id);
    
    const { data: articles, error: articlesError } = await supabase
      .from('knowledge_articles')
      .select('*')
      .in('id', articleIds)
      .eq('company_id', companyId);

    if (articlesError) {
      console.error('❌ Articles fetch error:', articlesError);
      throw articlesError;
    }

    // Combine articles with similarity scores
    const results = articles?.map(article => {
      const match = relevantMatches.find(m => m.metadata.article_id === article.id);
      return {
        ...article,
        similarity: match?.similarity || 0,
        relevanceScore: Math.round((match?.similarity || 0) * 100)
      };
    }).sort((a, b) => b.similarity - a.similarity) || [];

    console.log(`✅ Returning ${results.length} relevant articles`);

    return new Response(JSON.stringify({
      success: true,
      results,
      totalFound: matches?.length || 0,
      relevantCount: results.length,
      query,
      threshold: similarityThreshold
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Edge function error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
