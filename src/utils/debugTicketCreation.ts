import { supabase } from '@/integrations/supabase/client';
import { createTicket } from '@/services/ticketService';

/**
 * Função para testar a criação de tickets e validar integração n8n
 */
export const createTestTicket = async (companyId: string, userId: string) => {
  try {
    console.log('🧪 Criando ticket de teste com arquitetura Edge Function v2...');
    
    // Criar ticket de teste
    const testTicket = await createTicket({
      title: 'Ticket de Teste - Arquitetura Edge Function v2 Corrigida',
      description: 'Este ticket foi criado para testar a arquitetura Edge Function v2 com CORS e JWT corrigidos. A nova versão resolve definitivamente o problema "Out of memory" do pg_net.',
      category: 'technical_issue',
      priority: 'medium',
      userId: userId,
      companyId,
      source: 'web',
    });
    
    console.log('✅ Ticket criado com arquitetura v2:', testTicket);
    
    // Aguardar processamento da Edge Function
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar se foi criado log na tabela de integração
    const { data: logs, error } = await supabase
      .from('n8n_integration_logs')
      .select('*')
      .eq('resource_id', testTicket.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar logs:', error);
      return { success: false, error, ticket: testTicket };
    }
    
    console.log('📊 Logs da arquitetura v2 encontrados:', logs);
    
    return { 
      success: true, 
      ticket: testTicket, 
      logs: logs || [],
      hasLogs: logs && logs.length > 0,
      hasSuccessfulLog: logs && logs.some(log => log.status === 'success'),
      hasFailedLog: logs && logs.some(log => log.status === 'failed'),
      latestLog: logs && logs.length > 0 ? logs[0] : null,
      architecture: 'edge_function_v2_fixed'
    };
    
  } catch (error) {
    console.error('❌ Erro ao criar ticket de teste:', error);
    return { success: false, error };
  }
};

/**
 * Função para verificar configurações da empresa
 */
export const checkCompanySettings = async (companyId: string) => {
  try {
    console.log('🔍 Verificando configurações da empresa...');
    
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('company_id', companyId)
      .in('key', ['n8n_webhook_url', 'enable_ai_processing', 'events_to_n8n']);
    
    if (error) {
      console.error('❌ Erro ao buscar configurações:', error);
      return { success: false, error };
    }
    
    console.log('⚙️ Configurações encontradas:', settings);
    
    const settingsMap = settings?.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>) || {};
    
    return {
      success: true,
      settings: settingsMap,
      hasWebhookUrl: !!settingsMap.n8n_webhook_url,
      isProcessingEnabled: settingsMap.enable_ai_processing === true,
      eventsConfig: settingsMap.events_to_n8n || {},
      webhookUrl: settingsMap.n8n_webhook_url || ''
    };
    
  } catch (error) {
    console.error('❌ Erro ao verificar configurações:', error);
    return { success: false, error };
  }
};

/**
 * Função para verificar logs recentes
 */
export const getRecentLogs = async (companyId: string, limit: number = 10) => {
  try {
    const { data: logs, error } = await supabase
      .from('n8n_integration_logs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('❌ Erro ao buscar logs recentes:', error);
      return { success: false, error };
    }
    
    const successCount = logs?.filter(log => log.status === 'success').length || 0;
    const failedCount = logs?.filter(log => log.status === 'failed').length || 0;
    const pendingCount = logs?.filter(log => log.status === 'pending').length || 0;
    
    return { 
      success: true, 
      logs: logs || [],
      stats: {
        total: logs?.length || 0,
        success: successCount,
        failed: failedCount,
        pending: pendingCount,
        successRate: logs?.length ? (successCount / logs.length * 100).toFixed(1) : '0'
      },
      architecture: 'edge_function_v2_fixed'
    };
  } catch (error) {
    console.error('❌ Erro ao buscar logs recentes:', error);
    return { success: false, error };
  }
};

/**
 * Função CORRIGIDA para testar Edge Function com JWT desabilitado e headers apropriados
 */
export const testEdgeFunctionDirectly = async (companyId: string) => {
  try {
    console.log('🔧 Testando Edge Function n8n-webhook v2 com correções JWT/CORS...');
    
    const testPayload = {
      webhookUrl: 'https://httpbin.org/post',
      payload: {
        eventType: 'test.edge_function_v2_fixed',
        timestamp: new Date().toISOString(),
        source: 'debug-panel-corrected',
        message: 'Teste da Edge Function v2 com JWT desabilitado e CORS corrigido',
        architecture: 'edge_function_v2_fixed'
      },
      logId: 'test-log-v2-fixed-' + Date.now(),
      companyId: companyId,
      eventType: 'test.edge_function_v2_fixed'
    };
    
    console.log('📤 Enviando para Edge Function v2 (JWT desabilitado):', testPayload);
    
    try {
      // Primeira tentativa: usando supabase.functions.invoke com headers corretos
      const { data, error } = await supabase.functions.invoke('n8n-webhook', {
        body: testPayload,
      });
      
      if (error) {
        console.error('❌ Erro na chamada via invoke:', error);
        throw error;
      }
      
      console.log('✅ Edge Function v2 respondeu via invoke:', data);
      
      return {
        success: true,
        response: data,
        method: 'supabase_invoke',
        message: 'Edge Function v2 funcionando perfeitamente via invoke - JWT desabilitado!',
        architecture: 'edge_function_v2_fixed'
      };
    } catch (invokeError) {
      console.warn('⚠️ Falha na chamada via invoke, tentando HTTP direto:', invokeError);
      
      // Fallback: chamada HTTP direta
      const edgeFunctionUrl = 'https://jqtuzbldregwglevlhrw.supabase.co/functions/v1/n8n-webhook';
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'apikey': supabase.supabaseKey,
        },
        body: JSON.stringify(testPayload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('✅ Edge Function v2 respondeu via HTTP direto:', responseData);
      
      return {
        success: true,
        response: responseData,
        method: 'direct_http',
        message: 'Edge Function v2 funcionando via HTTP direto - JWT/CORS corrigidos!',
        architecture: 'edge_function_v2_fixed',
        fallbackUsed: true
      };
    }
  } catch (error) {
    console.error('❌ Erro completo ao testar Edge Function v2:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      architecture: 'edge_function_v2_fixed',
      troubleshooting: 'Verificar se Edge Function foi deployada e config.toml está correto',
      details: error
    };
  }
};

/**
 * Função para testar webhook diretamente
 */
export const testWebhookDirectly = async (webhookUrl: string) => {
  try {
    console.log('🔗 Testando webhook diretamente:', webhookUrl);
    
    const testPayload = {
      eventType: 'test.connection',
      timestamp: new Date().toISOString(),
      source: 'debug-panel',
      message: 'Teste direto após correção Edge Function v2'
    };
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });
    
    const responseData = await response.text();
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: responseData,
      url: webhookUrl
    };
  } catch (error) {
    console.error('❌ Erro ao testar webhook:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      url: webhookUrl
    };
  }
};

/**
 * Função CORRIGIDA para verificar status da Edge Function v2
 */
export const checkEdgeFunctionMigration = async () => {
  try {
    console.log('🔍 Verificando status da Edge Function v2 corrigida...');
    
    // Testa se a Edge Function v2 está disponível com JWT desabilitado
    const testResult = await testEdgeFunctionDirectly('test');
    
    return {
      success: testResult.success,
      edgeFunctionAvailable: testResult.success,
      isV2FixedArchitecture: testResult.success,
      response: testResult.response,
      method: testResult.method || 'unknown',
      error: testResult.error,
      migrationStatus: testResult.success ? 'completed_v2_fixed' : 'needs_debugging',
      features: testResult.success ? [
        'JWT desabilitado para testes',
        'CORS corrigido definitivamente',
        'Timeouts robustos', 
        'Logging detalhado',
        'Fallback HTTP direto'
      ] : [],
      troubleshooting: testResult.troubleshooting
    };
  } catch (error) {
    return {
      success: false,
      edgeFunctionAvailable: false,
      isV2FixedArchitecture: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      migrationStatus: 'failed_needs_review'
    };
  }
};
