
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = Deno.env.get('SUPABASE_URL') as string;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const authHeader = req.headers.get('Authorization')!;
    
    // Verificar se o usuário está autenticado
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Criar cliente Supabase com a chave de serviço para acessar auth.users
    const supabase = createClient(
      url,
      serviceRoleKey,
      { 
        global: { 
          headers: { Authorization: authHeader } 
        } 
      }
    );

    // Extrair o token JWT e verificar a sessão do usuário
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: sessionError } = await supabase.auth.getUser(token);
    
    if (sessionError || !user) {
      return new Response(
        JSON.stringify({ error: sessionError?.message || 'User not authenticated' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Agora que temos o usuário autenticado, vamos obter os dados do id que foi requisitado
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Obter dados do usuário solicitado
    const { data: requestedUser, error: userError } = await supabase.auth.admin.getUserById(user_id);

    if (userError) {
      return new Response(
        JSON.stringify({ error: userError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!requestedUser?.user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Obter dados da empresa e role do usuário solicitado
    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id, role')
      .eq('user_id', user_id)
      .single();

    // Retornar informações formatadas - Não falha se não encontrar vínculo com empresa
    return new Response(
      JSON.stringify({
        id: requestedUser.user.id,
        email: requestedUser.user.email,
        name: requestedUser.user.user_metadata?.name || 
              requestedUser.user.user_metadata?.full_name || 
              'Unknown',
        company_id: userCompany?.company_id || requestedUser.user.app_metadata?.company_id,
        role: userCompany?.role || requestedUser.user.app_metadata?.role || 'client'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error("Error in get_user_info:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
