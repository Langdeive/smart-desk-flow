
import { supabase } from '@/integrations/supabase/client';
import { DbTicket } from './mappers';

/**
 * Service para gerenciar eventos de tickets e evitar duplicação de webhooks
 */

const WEBHOOK_COOLDOWN_MS = 5000; // 5 segundos de cooldown
const recentWebhooks = new Map<string, number>();

/**
 * Verifica se um webhook já foi enviado recentemente para evitar duplicação
 */
const isWebhookRecentlySent = (ticketId: string, eventType: string): boolean => {
  const key = `${ticketId}-${eventType}`;
  const lastSent = recentWebhooks.get(key);
  
  if (lastSent && Date.now() - lastSent < WEBHOOK_COOLDOWN_MS) {
    console.log(`🚫 Webhook bloqueado por cooldown: ${key}`);
    return true;
  }
  
  return false;
};

/**
 * Marca um webhook como enviado para controle de duplicação
 */
const markWebhookAsSent = (ticketId: string, eventType: string): void => {
  const key = `${ticketId}-${eventType}`;
  recentWebhooks.set(key, Date.now());
  
  // Limpa entradas antigas a cada 10 webhooks
  if (recentWebhooks.size > 10) {
    const cutoff = Date.now() - WEBHOOK_COOLDOWN_MS * 2;
    for (const [k, timestamp] of recentWebhooks.entries()) {
      if (timestamp < cutoff) {
        recentWebhooks.delete(k);
      }
    }
  }
};

/**
 * Verifica se existe um log de integração pendente ou recente para evitar duplicação
 */
const checkExistingWebhookLog = async (
  ticketId: string, 
  eventType: string, 
  companyId: string
): Promise<boolean> => {
  try {
    const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
    
    const { data: existingLogs, error } = await supabase
      .from('n8n_integration_logs')
      .select('id, status, created_at')
      .eq('resource_id', ticketId)
      .eq('event_type', eventType)
      .eq('company_id', companyId)
      .gte('created_at', fiveSecondsAgo)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('❌ Erro ao verificar logs existentes:', error);
      return false;
    }
    
    if (existingLogs && existingLogs.length > 0) {
      console.log(`🔍 Log existente encontrado para ${ticketId}-${eventType}:`, existingLogs[0]);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Erro na verificação de logs existentes:', error);
    return false;
  }
};

/**
 * Envia evento de ticket criado com proteção contra duplicação
 */
export const sendTicketCreatedEvent = async (ticket: DbTicket): Promise<void> => {
  const eventType = 'ticket.created';
  
  // Verifica se o ticket tem ID
  if (!ticket.id) {
    console.error('❌ Ticket sem ID - não é possível enviar webhook');
    return;
  }
  
  // Verificação 1: Cooldown em memória
  if (isWebhookRecentlySent(ticket.id, eventType)) {
    console.log(`⏱️ Webhook bloqueado por cooldown: ${ticket.id}-${eventType}`);
    return;
  }
  
  // Verificação 2: Logs no banco de dados
  const hasRecentLog = await checkExistingWebhookLog(ticket.id, eventType, ticket.company_id);
  if (hasRecentLog) {
    console.log(`📋 Webhook já existe no banco: ${ticket.id}-${eventType}`);
    return;
  }
  
  try {
    console.log(`🚀 Enviando webhook ticket.created para: ${ticket.id}`);
    
    // Marca como enviado antes de enviar para evitar race conditions
    markWebhookAsSent(ticket.id, eventType);
    
    // Monta payload
    const payload = {
      eventType,
      data: ticket,
      timestamp: new Date().toISOString(),
      companyId: ticket.company_id
    };
    
    // Chama função do Supabase para enviar webhook
    const { error } = await supabase.rpc('send_to_n8n_webhook', {
      p_company_id: ticket.company_id,
      p_event_type: eventType,
      p_resource_type: 'ticket',
      p_resource_id: ticket.id,
      p_payload: payload
    });
    
    if (error) {
      console.error('❌ Erro ao enviar webhook:', error);
      // Remove da cache em caso de erro para permitir retry
      const key = `${ticket.id}-${eventType}`;
      recentWebhooks.delete(key);
    } else {
      console.log(`✅ Webhook enviado com sucesso: ${ticket.id}-${eventType}`);
    }
  } catch (error) {
    console.error('❌ Erro inesperado ao enviar webhook:', error);
    // Remove da cache em caso de erro para permitir retry
    const key = `${ticket.id}-${eventType}`;
    recentWebhooks.delete(key);
  }
};

/**
 * Envia evento de ticket atualizado com proteção contra duplicação
 */
export const sendTicketUpdatedEvent = async (
  ticket: DbTicket, 
  oldTicket?: DbTicket
): Promise<void> => {
  // Verifica se o ticket tem ID
  if (!ticket.id) {
    console.error('❌ Ticket sem ID - não é possível enviar webhook');
    return;
  }
  
  // Determina o tipo de evento baseado nas mudanças
  let eventType = 'ticket.updated';
  if (oldTicket && oldTicket.agent_id !== ticket.agent_id && ticket.agent_id) {
    eventType = 'ticket.assigned';
  }
  
  // Verificação 1: Cooldown em memória
  if (isWebhookRecentlySent(ticket.id, eventType)) {
    console.log(`⏱️ Webhook bloqueado por cooldown: ${ticket.id}-${eventType}`);
    return;
  }
  
  // Verificação 2: Logs no banco de dados
  const hasRecentLog = await checkExistingWebhookLog(ticket.id, eventType, ticket.company_id);
  if (hasRecentLog) {
    console.log(`📋 Webhook já existe no banco: ${ticket.id}-${eventType}`);
    return;
  }
  
  try {
    console.log(`🚀 Enviando webhook ${eventType} para: ${ticket.id}`);
    
    // Marca como enviado antes de enviar para evitar race conditions
    markWebhookAsSent(ticket.id, eventType);
    
    // Monta payload
    const payload = {
      eventType,
      data: ticket,
      oldData: oldTicket,
      timestamp: new Date().toISOString(),
      companyId: ticket.company_id
    };
    
    // Chama função do Supabase para enviar webhook
    const { error } = await supabase.rpc('send_to_n8n_webhook', {
      p_company_id: ticket.company_id,
      p_event_type: eventType,
      p_resource_type: 'ticket',
      p_resource_id: ticket.id,
      p_payload: payload
    });
    
    if (error) {
      console.error('❌ Erro ao enviar webhook:', error);
      // Remove da cache em caso de erro para permitir retry
      const key = `${ticket.id}-${eventType}`;
      recentWebhooks.delete(key);
    } else {
      console.log(`✅ Webhook enviado com sucesso: ${ticket.id}-${eventType}`);
    }
  } catch (error) {
    console.error('❌ Erro inesperado ao enviar webhook:', error);
    // Remove da cache em caso de erro para permitir retry
    const key = `${ticket.id}-${eventType}`;
    recentWebhooks.delete(key);
  }
};
