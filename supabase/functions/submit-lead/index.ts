import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Simple validation helpers
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function isValidPhone(phone: string): boolean {
  // Allow digits, spaces, parentheses, plus, dash
  const phoneRegex = /^[\d\s()+-]+$/;
  return phoneRegex.test(phone) && phone.length >= 8 && phone.length <= 20;
}

function sanitizeString(str: string, maxLength: number): string {
  return str.trim().slice(0, maxLength);
}

// In-memory rate limiting (resets on function cold start, but provides basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in ms
const MAX_REQUESTS_PER_IP = 5;

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
  rateLimitMap.set(ip, record);
  return { allowed: true, remaining: MAX_REQUESTS_PER_IP - record.count };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
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
    
    console.log(`📥 Lead submission from IP: ${clientIP.substring(0, 10)}...`);

    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      console.log(`⚠️ Rate limit exceeded for IP: ${clientIP.substring(0, 10)}...`);
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

    // Honeypot check (if website field is filled, it's a bot)
    if (body.website && typeof body.website === 'string' && body.website.trim() !== '') {
      console.log('🤖 Bot detected via honeypot');
      // Return fake success to not alert the bot
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    const errors: string[] = [];

    // Name validation
    const name = typeof body.name === 'string' ? sanitizeString(body.name, 100) : '';
    if (name.length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    // Email validation
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!isValidEmail(email)) {
      errors.push('Email inválido');
    }

    // WhatsApp validation
    const whatsapp = typeof body.whatsapp === 'string' ? sanitizeString(body.whatsapp, 20) : '';
    if (!isValidPhone(whatsapp)) {
      errors.push('WhatsApp inválido (mínimo 8 dígitos)');
    }

    // Company validation
    const company = typeof body.company === 'string' ? sanitizeString(body.company, 100) : '';
    if (company.length < 2) {
      errors.push('Empresa deve ter pelo menos 2 caracteres');
    }

    // Interest validation
    const interest = typeof body.interest === 'string' ? sanitizeString(body.interest, 50) : '';
    if (interest.length < 1) {
      errors.push('Selecione um interesse');
    }

    // Optional fields
    const role = typeof body.role === 'string' ? sanitizeString(body.role, 100) : null;
    const challenge = typeof body.challenge === 'string' ? sanitizeString(body.challenge, 2000) : null;

    // Return validation errors
    if (errors.length > 0) {
      console.log(`❌ Validation errors: ${errors.join(', ')}`);
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos',
          details: errors
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert lead
    const { error: insertError } = await supabase
      .from('landing_leads')
      .insert({
        name,
        email,
        whatsapp,
        company,
        interest,
        role,
        challenge
      });

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar. Tente novamente.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Lead saved successfully: ${email}`);

    // Return success with remaining submissions
    return new Response(
      JSON.stringify({ 
        success: true,
        remaining: rateLimitResult.remaining
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno. Tente novamente.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
