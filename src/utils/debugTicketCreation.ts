
import { supabase } from '@/integrations/supabase/client';
import { createTicket } from '@/services/ticketService';

/**
 * Função para testar a criação de tickets e validar integração n8n
 */
export const createTestTicket = async (companyId: string, userId: string) => {
  try {
    console.log('🧪 Criando ticket de teste...');
    
    // Criar ticket de teste
    const testTicket = await createTicket({
      title: 'Ticket de Teste - Integração N8N CORRIGIDA',
      description: 'Este é um ticket criado para testar a integração corrigida com n8n. A função send_to_n8n_webhook foi atualizada para usar tipos corretos (jsonb ao invés de text).',
      category: 'technical_issue',
      priority: 'medium',
      userId: userId,
      companyId,
      source: 'web',
    });
    
    console.log('✅ Ticket criado:', testTicket);
    
    // Aguardar um pouco mais para os triggers processarem
    await new Promise(resolve => setTimeout(resolve, 5000));
    
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
    
    console.log('📊 Logs encontrados:', logs);
    
    return { 
      success: true, 
      ticket: testTicket, 
      logs: logs || [],
      hasLogs: logs && logs.length > 0,
      hasSuccessfulLog: logs && logs.some(log => log.status === 'success'),
      hasFailedLog: logs && logs.some(log => log.status === 'failed'),
      latestLog: logs && logs.length > 0 ? logs[0] : null
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
      }
    };
  } catch (error) {
    console.error('❌ Erro ao buscar logs recentes:', error);
    return { success: false, error };
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
      message: 'Teste direto da correção da função send_to_n8n_webhook'
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
