import { supabase } from '@/integrations/supabase/client';
import { createTicket } from '@/services/ticketService';

/**
 * Função para testar a criação de tickets e validar integração n8n
 */
export const createTestTicket = async (companyId: string, userId: string) => {
  try {
    console.log('🧪 Criando ticket de teste com nova arquitetura Edge Function...');
    
    // Criar ticket de teste
    const testTicket = await createTicket({
      title: 'Ticket de Teste - Nova Arquitetura Edge Function',
      description: 'Este ticket foi criado para testar a nova arquitetura que usa Edge Function para resolver o problema "Out of memory" do pg_net. A integração agora usa uma Edge Function dedicada para processar requisições HTTP de forma mais confiável.',
      category: 'technical_issue',
      priority: 'medium',
      userId: userId,
      companyId,
      source: 'web',
    });
    
    console.log('✅ Ticket criado com nova arquitetura:', testTicket);
    
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
    
    console.log('📊 Logs da nova arquitetura encontrados:', logs);
    
    return { 
      success: true, 
      ticket: testTicket, 
      logs: logs || [],
      hasLogs: logs && logs.length > 0,
      hasSuccessfulLog: logs && logs.some(log => log.status === 'success'),
      hasFailedLog: logs && logs.some(log => log.status === 'failed'),
      latestLog: logs && logs.length > 0 ? logs[0] : null,
      architecture: 'edge_function' // Identificador da nova arquitetura
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
      architecture: 'edge_function'
    };
  } catch (error) {
    console.error('❌ Erro ao buscar logs recentes:', error);
    return { success: false, error };
  }
};

/**
 * Função para testar Edge Function diretamente
 */
export const testEdgeFunctionDirectly = async (companyId: string) => {
  try {
    console.log('🔧 Testando Edge Function n8n-webhook diretamente...');
    
    const testPayload = {
      webhookUrl: 'https://httpbin.org/post', // URL de teste que sempre responde
      payload: {
        eventType: 'test.edge_function',
        timestamp: new Date().toISOString(),
        source: 'debug-panel',
        message: 'Teste direto da Edge Function n8n-webhook - Nova Arquitetura'
      },
      logId: 'test-log-id-' + Date.now(),
      companyId: companyId,
      eventType: 'test.edge_function'
    };
    
    const { data, error } = await supabase.functions.invoke('n8n-webhook', {
      body: testPayload,
    });
    
    if (error) {
      console.error('❌ Erro na Edge Function:', error);
      return {
        success: false,
        error: error.message,
        details: error,
        architecture: 'edge_function'
      };
    }
    
    console.log('✅ Edge Function respondeu:', data);
    
    return {
      success: true,
      response: data,
      message: 'Edge Function n8n-webhook funcionando perfeitamente com nova arquitetura',
      architecture: 'edge_function'
    };
  } catch (error) {
    console.error('❌ Erro ao testar Edge Function:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      architecture: 'edge_function'
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
      message: 'Teste direto após migração para Edge Function'
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
 * Função para verificar status da migração para Edge Function
 */
export const checkEdgeFunctionMigration = async () => {
  try {
    console.log('🔍 Verificando status da migração para Edge Function...');
    
    // Testa se a Edge Function está disponível
    const { data, error } = await supabase.functions.invoke('n8n-webhook', {
      body: {
        webhookUrl: 'https://httpbin.org/post',
        payload: { test: true },
        logId: 'migration-check',
        companyId: 'test',
        eventType: 'migration.check'
      },
    });
    
    return {
      success: !error,
      edgeFunctionAvailable: !error,
      response: data,
      error: error?.message,
      migrationStatus: !error ? 'completed' : 'pending'
    };
  } catch (error) {
    return {
      success: false,
      edgeFunctionAvailable: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      migrationStatus: 'failed'
    };
  }
};
