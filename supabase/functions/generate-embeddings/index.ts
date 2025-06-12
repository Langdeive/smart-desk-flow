
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

  console.log('🚀 Edge Function called: generate-embeddings');

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { articleId, title, content } = await req.json();

    if (!articleId || !title || !content) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: articleId, title, content' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`📄 Processing article: ${articleId}`);

    // Create text embedding pipeline
    const extractor = await pipeline(
      'feature-extraction',
      'mixedbread-ai/mxbai-embed-xsmall-v1',
      { device: 'cpu' }
    );

    // Combine title and content for better semantic understanding
    const textToEmbed = `${title}\n\n${content}`;
    
    console.log(`🔄 Generating embedding for text: ${textToEmbed.substring(0, 100)}...`);

    // Generate embedding
    const embeddings = await extractor(textToEmbed, { 
      pooling: 'mean', 
      normalize: true 
    });

    const embeddingArray = embeddings.tolist()[0];
    
    console.log(`✅ Generated embedding with ${embeddingArray.length} dimensions`);

    // Store in documents table for semantic search
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .upsert({
        id: articleId,
        content: textToEmbed,
        embedding: embeddingArray,
        metadata: {
          type: 'knowledge_article',
          article_id: articleId,
          title: title,
          created_at: new Date().toISOString()
        }
      })
      .select();

    if (docError) {
      console.error('❌ Error storing document:', docError);
      throw docError;
    }

    console.log('📊 Document stored successfully:', docData);

    return new Response(JSON.stringify({
      success: true,
      articleId,
      embeddingDimensions: embeddingArray.length,
      documentId: docData[0]?.id
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
