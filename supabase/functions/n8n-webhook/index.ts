
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Headers CORS mais robustos para resolver problemas de conectividade
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400', // Cache preflight por 24 horas
}

interface WebhookRequest {
  webhookUrl: string;
  payload: any;
  logId: string;
  companyId: string;
  eventType: string;
}

// Função para sanitizar e validar URL
function sanitizeWebhookUrl(url: string): string {
  if (!url) {
    throw new Error('URL is empty or null');
  }
  
  // Remove aspas extras que podem vir do parsing JSON
  let cleanUrl = url.toString().trim();
  
  // Remove aspas duplas no início e fim se existirem
  if (cleanUrl.startsWith('"') && cleanUrl.endsWith('"')) {
    cleanUrl = cleanUrl.slice(1, -1);
  }
  
  // Remove aspas simples no início e fim se existirem  
  if (cleanUrl.startsWith("'") && cleanUrl.endsWith("'")) {
    cleanUrl = cleanUrl.slice(1, -1);
  }
  
  // Valida se é uma URL válida
  try {
    new URL(cleanUrl);
  } catch (error) {
    throw new Error(`Invalid URL format after sanitization: ${cleanUrl}`);
  }
  
  return cleanUrl;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests com headers melhorados
  if (req.method === 'OPTIONS') {
    console.log('🔄 Handling CORS preflight request');
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  console.log(`🚀 Edge Function called: ${req.method} ${req.url}`);

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method);
      return new Response(JSON.stringify({ 
        error: 'Method not allowed',
        allowedMethods: ['POST', 'OPTIONS']
      }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body com melhor tratamento de erros
    let requestData: WebhookRequest;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        details: parseError.message
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { webhookUrl: rawWebhookUrl, payload, logId, companyId, eventType } = requestData;

    console.log(`📡 Processing request for company ${companyId}, event ${eventType}`);
    console.log(`🎯 Raw Webhook URL received: ${JSON.stringify(rawWebhookUrl)}`);

    // Sanitizar e validar a URL do webhook
    let cleanWebhookUrl: string;
    try {
      cleanWebhookUrl = sanitizeWebhookUrl(rawWebhookUrl);
      console.log(`✅ Sanitized Webhook URL: ${cleanWebhookUrl}`);
    } catch (urlError) {
      console.error('❌ URL sanitization failed:', urlError.message);
      return new Response(JSON.stringify({ 
        error: 'Invalid webhook URL',
        details: urlError.message,
        originalUrl: rawWebhookUrl
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`📋 Log ID: ${logId}`);

    // Validate required fields com mensagens mais claras
    if (!cleanWebhookUrl || !payload || !logId) {
      const missingFields = [];
      if (!cleanWebhookUrl) missingFields.push('webhookUrl');
      if (!payload) missingFields.push('payload');
      if (!logId) missingFields.push('logId');
      
      console.error('❌ Missing required fields:', missingFields.join(', '));
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        missingFields,
        received: { webhookUrl: !!cleanWebhookUrl, payload: !!payload, logId: !!logId }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Send webhook request com timeout e retry melhorados
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Request timeout after 15 seconds');
      controller.abort();
    }, 15000); // Aumentado para 15 segundos

    try {
      console.log(`📤 Sending payload to n8n:`, JSON.stringify(payload, null, 2));
      
      const webhookResponse = await fetch(cleanWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SolveFlow-EdgeFunction/1.0',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let responseText = '';
      try {
        responseText = await webhookResponse.text();
      } catch (textError) {
        console.warn('⚠️ Could not read response text:', textError.message);
        responseText = 'Response text could not be read';
      }

      console.log(`📥 n8n response status: ${webhookResponse.status}`);
      console.log(`📥 n8n response body: ${responseText}`);

      // Update log with success
      const { error: updateError } = await supabase
        .from('n8n_integration_logs')
        .update({
          status: 'success',
          response_status: webhookResponse.status,
          response_body: responseText,
          last_attempt_at: new Date().toISOString(),
        })
        .eq('id', logId);

      if (updateError) {
        console.error('❌ Error updating log:', updateError);
      } else {
        console.log('✅ Log updated successfully');
      }

      return new Response(JSON.stringify({
        success: true,
        status: webhookResponse.status,
        response: responseText,
        logId: logId,
        timestamp: new Date().toISOString(),
        architecture: 'edge_function_v2_fixed',
        sanitizedUrl: cleanWebhookUrl
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      let errorMessage = 'Unknown fetch error';
      let errorType = 'unknown';
      
      if (fetchError instanceof Error) {
        errorMessage = fetchError.message;
        if (fetchError.name === 'AbortError') {
          errorType = 'timeout';
          errorMessage = 'Request timed out after 15 seconds';
        } else if (fetchError.message.includes('network')) {
          errorType = 'network';
        }
      }
      
      console.error(`❌ Webhook request failed (${errorType}):`, errorMessage);

      // Update log with failure and more details
      const { error: updateError } = await supabase
        .from('n8n_integration_logs')
        .update({
          status: 'failed',
          error_message: `${errorType}: ${errorMessage}`,
          last_attempt_at: new Date().toISOString(),
          next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // retry in 5 minutes
        })
        .eq('id', logId);

      if (updateError) {
        console.error('❌ Error updating log with failure:', updateError);
      }

      return new Response(JSON.stringify({
        success: false,
        error: errorMessage,
        errorType,
        logId: logId,
        timestamp: new Date().toISOString(),
        architecture: 'edge_function_v2_fixed',
        sanitizedUrl: cleanWebhookUrl
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Edge function error:', errorMessage);
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      architecture: 'edge_function_v2_fixed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
