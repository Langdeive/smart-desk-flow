const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Validation helpers
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s()+-]+$/;
  return phoneRegex.test(phone) && phone.length >= 8 && phone.length <= 20;
}

function sanitizeString(str: string, maxLength: number): string {
  return str.trim().slice(0, maxLength);
}

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_REQUESTS_PER_IP = 20;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_REQUESTS_PER_IP - 1 };
  }
  
  if (record.count >= MAX_REQUESTS_PER_IP) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_IP - record.count };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: 'Limite de envios atingido. Tente novamente em 1 hora.',
          code: 'RATE_LIMITED'
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '3600'
          } 
        }
      );
    }

    // Parse request body
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Honeypot check - if website field is filled, it's likely a bot
    if (body.website && typeof body.website === 'string' && body.website.trim() !== '') {
      console.log(`Bot detected via honeypot from IP: ${clientIP}`);
      // Return success to not alert the bot, but don't process
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    const errors: string[] = [];

    const nomeEmpresa = typeof body.nomeEmpresa === 'string' ? sanitizeString(body.nomeEmpresa, 100) : '';
    if (nomeEmpresa.length < 2) {
      errors.push('Nome da empresa deve ter pelo menos 2 caracteres');
    }

    const segmento = typeof body.segmento === 'string' ? sanitizeString(body.segmento, 50) : '';
    if (segmento.length < 2) {
      errors.push('Segmento deve ter pelo menos 2 caracteres');
    }

    const nomePessoa = typeof body.nomePessoa === 'string' ? sanitizeString(body.nomePessoa, 100) : '';
    if (nomePessoa.length < 2) {
      errors.push('Nome da pessoa deve ter pelo menos 2 caracteres');
    }

    const telefone = typeof body.telefone === 'string' ? sanitizeString(body.telefone, 20) : '';
    if (!isValidPhone(telefone)) {
      errors.push('Telefone inválido (mínimo 8 dígitos)');
    }

    // Optional fields with validation
    const funcao = typeof body.funcao === 'string' ? sanitizeString(body.funcao, 100) : '';
    
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 255) : '';
    if (email && !isValidEmail(email)) {
      errors.push('Email inválido');
    }

    const cidade = typeof body.cidade === 'string' ? sanitizeString(body.cidade, 100) : '';
    const comentario = typeof body.comentario === 'string' ? sanitizeString(body.comentario, 1000) : '';
    
    const validDecisor = ['sim', 'nao', 'talvez'];
    const decisor = typeof body.decisor === 'string' && validDecisor.includes(body.decisor) 
      ? body.decisor 
      : '';

    if (errors.length > 0) {
      console.log(`Validation errors for IP ${clientIP}:`, errors);
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos',
          details: errors
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get webhook URL from environment
    const webhookUrl = Deno.env.get('CRM_WEBHOOK_URL');
    if (!webhookUrl) {
      console.error('CRM_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor incompleta.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare payload for CRM
    const webhookPayload = {
      lead: {
        company: nomeEmpresa,
        segment: segmento,
        name: nomePessoa,
        role: funcao || null,
        phone: telefone,
        email: email || null,
        city: cidade || null,
        is_decision_maker: decisor || null
      },
      notes: comentario || null,
      metadata: {
        source: 'internal_form',
        submitted_at: new Date().toISOString(),
        ip_address: clientIP
      }
    };

    console.log(`Submitting lead for company: ${nomeEmpresa}`);

    // Forward to CRM webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });

    if (!webhookResponse.ok) {
      console.error(`CRM webhook failed with status: ${webhookResponse.status}`);
      return new Response(
        JSON.stringify({ error: 'Erro ao enviar para CRM. Tente novamente.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Lead submitted successfully for company: ${nomeEmpresa}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        remaining: rateLimitResult.remaining
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno. Tente novamente.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
