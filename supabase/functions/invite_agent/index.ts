
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

    // Create a new user in auth system
    const { data: userData, error: userError } = await supabase.auth.admin.inviteUserByEmail(email, {
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

    // Add the user to the user_companies table
    const { error: relationError } = await supabase
      .from('user_companies')
      .insert({
        user_id: userId,
        company_id: companyId,
        role: role
      });
    
    if (relationError) {
      throw relationError;
    }

    return new Response(
      JSON.stringify({ success: true }),
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
