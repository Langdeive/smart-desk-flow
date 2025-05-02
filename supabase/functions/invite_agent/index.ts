
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
    
    // Create an admin client with the service role key to bypass RLS
    const supabaseAdmin = createClient(url, serviceRoleKey);
    
    // Create a regular client to get JWT claims
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      url,
      serviceRoleKey,
      { 
        global: { 
          headers: { Authorization: authHeader } 
        } 
      }
    );
    
    const { email, name, role, companyId } = await req.json();
    
    if (!email || !name || !role || !companyId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Inviting agent: ${name} (${email}) with role ${role} to company ${companyId}`);

    // First, check if the company exists
    let { data: companyData, error: companyError } = await supabaseAdmin
      .from('companies')
      .select('id')
      .eq('id', companyId)
      .maybeSingle(); // Using maybeSingle instead of single to avoid 406 errors
    
    // If company doesn't exist, create it
    if (!companyData && (!companyError || companyError.code === 'PGRST116')) {
      console.log(`Company ${companyId} not found. Attempting to create it.`);
      
      // Extract user information to use as company name
      const { data: userData } = await supabase.auth.getUser();
      const userName = userData?.user?.user_metadata?.full_name || 'New Company';
      
      const { data: newCompany, error: createError } = await supabaseAdmin
        .from('companies')
        .insert({
          id: companyId, // Use the provided ID
          name: `${userName}'s Company`,
          plan: 'free'
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating company:', createError);
        return new Response(
          JSON.stringify({ 
            error: `Failed to create company with ID ${companyId}.`,
            details: createError.message 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      companyData = newCompany;
      console.log(`Created new company: ${JSON.stringify(companyData)}`);
    } else if (companyError && companyError.code !== 'PGRST116') {
      return new Response(
        JSON.stringify({ 
          error: `Error checking company with ID ${companyId}.`,
          details: companyError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Create a new user in auth system using the admin client
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        name: name,
        company_id: companyId,
        role: role
      }
    });

    if (userError) {
      throw userError;
    }

    // Get the user ID from the created user
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error('User ID not returned from invitation');
    }

    // Add the user to the user_companies table using the admin client to bypass RLS
    const { data: relationData, error: relationError } = await supabaseAdmin
      .from('user_companies')
      .insert({
        user_id: userId,
        company_id: companyId,
        role: role
      })
      .select()
      .single();
    
    if (relationError) {
      throw relationError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: relationData.id, 
        email: email, 
        role: relationData.role 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error inviting agent:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
