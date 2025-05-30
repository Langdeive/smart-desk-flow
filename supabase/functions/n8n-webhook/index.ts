
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookRequest {
  webhookUrl: string;
  payload: any;
  logId: string;
  companyId: string;
  eventType: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const requestData: WebhookRequest = await req.json();
    const { webhookUrl, payload, logId, companyId, eventType } = requestData;

    console.log(`🚀 Processing n8n webhook request for company ${companyId}, event ${eventType}`);
    console.log(`📡 Webhook URL: ${webhookUrl}`);
    console.log(`📋 Log ID: ${logId}`);

    // Validate required fields
    if (!webhookUrl || !payload || !logId) {
      console.error('❌ Missing required fields');
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: webhookUrl, payload, or logId' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Send webhook request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      console.log(`📤 Sending payload to n8n:`, JSON.stringify(payload, null, 2));
      
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await webhookResponse.text();
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
        logId: logId
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
      console.error('❌ Webhook request failed:', errorMessage);

      // Update log with failure
      const { error: updateError } = await supabase
        .from('n8n_integration_logs')
        .update({
          status: 'failed',
          error_message: errorMessage,
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
        logId: logId
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
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
