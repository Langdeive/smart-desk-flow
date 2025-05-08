
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
    
    console.log("Authorization header present:", !!authHeader);
    
    // Verificar autenticação do usuário que está enviando o convite
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No valid bearer token provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Extrair o token JWT
    const token = authHeader.replace('Bearer ', '');
    
    // Criar cliente Supabase com a chave de serviço para operações admin
    const supabaseAdmin = createClient(url, serviceRoleKey);
    
    // Verificar se o usuário atual está autenticado usando o token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("User verification failed:", userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid user token', details: userError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    console.log("User authenticated:", user.id);

    // Obter dados do convite
    const { email, name, role, companyId } = await req.json();
    
    if (!email || !companyId) {
      return new Response(
        JSON.stringify({ error: 'Email and companyId are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Attempting to invite ${email} to company ${companyId} with role ${role}`);

    // Verificar se o usuário atual tem permissão na empresa (role = owner ou admin)
    const { data: userCompany, error: permissionError } = await supabaseAdmin
      .from('user_companies')
      .select('role')
      .eq('user_id', user.id)
      .eq('company_id', companyId)
      .single();
    
    console.log("User permission check result:", userCompany, permissionError);
    
    if (permissionError) {
      console.error("Permission check error:", permissionError);
      return new Response(
        JSON.stringify({ error: 'Error checking permissions', details: permissionError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    if (!userCompany || (userCompany.role !== 'owner' && userCompany.role !== 'admin')) {
      console.error("Permission denied. User role:", userCompany?.role);
      return new Response(
        JSON.stringify({ error: 'Forbidden - You do not have permission to invite users to this company', role: userCompany?.role }),
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
      const { data: existingRelation } = await supabaseAdmin
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
        console.error("Error creating user:", createUserError);
        throw createUserError;
      }
      
      userId = newUser.user.id;
    }

    console.log("Creating user_companies relation for user:", userId);

    // Criar a relação na tabela user_companies
    const { error: relationError } = await supabaseAdmin
      .from('user_companies')
      .insert({
        user_id: userId,
        company_id: companyId,
        role: role || 'agent'
      });
    
    if (relationError) {
      console.error("Error inserting user_companies relation:", relationError);
      throw relationError;
    }

    // Enviar email de convite/redefinição de senha
    const { error: passwordResetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${req.headers.get('origin')}/reset-password`
      }
    });
    
    if (passwordResetError) {
      console.error("Error sending password reset email:", passwordResetError);
      throw passwordResetError;
    }

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
