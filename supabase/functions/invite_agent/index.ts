
// Aqui só podemos verificar o conteúdo da função existente, já que não temos acesso ao código original
// Você pode solicitar ao usuário para compartilhar o arquivo se for necessário fazer mudanças

// Como não podemos editar diretamente, precisaremos criar uma versão atualizada
// Assumindo um template básico com as correções necessárias:

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
    
    // Verificar autenticação do usuário que está enviando o convite
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Criar cliente Supabase com a chave de serviço para operações admin
    const supabaseAdmin = createClient(url, serviceRoleKey);
    
    // Criar cliente com o token do usuário para verificar permissões
    const supabaseClient = createClient(
      url,
      serviceRoleKey,
      { global: { headers: { Authorization: authHeader } } }
    );
    
    // Verificar se o usuário atual está autenticado
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Valid authentication required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Obter dados do convite
    const { email, name, role, companyId } = await req.json();
    
    if (!email || !companyId) {
      return new Response(
        JSON.stringify({ error: 'Email and companyId are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verificar se o usuário atual tem permissão na empresa (role = owner ou admin)
    const { data: userPermission } = await supabaseClient
      .from('user_companies')
      .select('role')
      .eq('user_id', user.id)
      .eq('company_id', companyId)
      .single();
    
    if (!userPermission || (userPermission.role !== 'owner' && userPermission.role !== 'admin')) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - You do not have permission to invite users to this company' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Verificar se o email já está sendo usado
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === email);
    
    let userId;
    
    if (existingUser) {
      // O usuário já existe, vamos apenas associá-lo à empresa se ainda não estiver
      userId = existingUser.id;
      
      // Verificar se já existe associação
      const { data: existingRelation } = await supabaseClient
        .from('user_companies')
        .select('id')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .maybeSingle();
      
      if (existingRelation) {
        return new Response(
          JSON.stringify({ 
            message: 'User is already associated with this company',
            user_id: userId
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    } else {
      // Criar o usuário com senha temporária
      const tempPassword = Math.random().toString(36).slice(-8);
      const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: false,
        user_metadata: { name },
        app_metadata: { company_id: companyId, role: role || 'agent' }
      });
      
      if (createUserError) {
        throw createUserError;
      }
      
      userId = newUser.user.id;
    }

    // Criar a relação na tabela user_companies
    await supabaseAdmin
      .from('user_companies')
      .insert({
        user_id: userId,
        company_id: companyId,
        role: role || 'agent'
      });

    // Enviar email de convite/redefinição de senha
    await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${req.headers.get('origin')}/reset-password`
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation sent successfully',
        user_id: userId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in invite_agent function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
