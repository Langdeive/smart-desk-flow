import { supabase } from '@/integrations/supabase/client';
import { TicketStatus, TicketPriority } from '@/types';
import { sendTicketUpdatedEvent } from './ticketEventService';
import { DbTicket } from './mappers';

// No interfaces or utility functions in this file

/**
 * Updates ticket status with anti-duplication webhook protection
 */
export const updateTicketStatus = async (
  ticketId: string, 
  status: TicketStatus
): Promise<boolean> => {
  try {
    console.log(`🔄 Atualizando status do ticket ${ticketId} para: ${status}`);
    
    // Busca dados atuais antes da atualização
    const { data: currentTicket } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) {
      console.error('❌ Erro ao atualizar status:', error);
      return false;
    }
    
    // Busca dados atualizados
    const { data: updatedTicket } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    if (updatedTicket && currentTicket) {
      // Envia evento com proteção contra duplicação (sem aguardar)
      sendTicketUpdatedEvent(
        updatedTicket as DbTicket, 
        currentTicket as DbTicket
      ).catch(error => {
        console.error('❌ Erro ao enviar evento de atualização:', error);
      });
    }

    console.log(`✅ Status atualizado: ${ticketId} -> ${status}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error);
    return false;
  }
};

/**
 * Updates ticket priority with anti-duplication webhook protection
 */
export const updateTicketPriority = async (
  ticketId: string, 
  priority: TicketPriority
): Promise<boolean> => {
  try {
    console.log(`📊 Atualizando prioridade do ticket ${ticketId} para: ${priority}`);
    
    // Busca dados atuais antes da atualização
    const { data: currentTicket } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    const { error } = await supabase
      .from('tickets')
      .update({ 
        priority,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) {
      console.error('❌ Erro ao atualizar prioridade:', error);
      return false;
    }
    
    // Busca dados atualizados
    const { data: updatedTicket } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    if (updatedTicket && currentTicket) {
      // Envia evento com proteção contra duplicação (sem aguardar)
      sendTicketUpdatedEvent(
        updatedTicket as DbTicket, 
        currentTicket as DbTicket
      ).catch(error => {
        console.error('❌ Erro ao enviar evento de atualização:', error);
      });
    }

    console.log(`✅ Prioridade atualizada: ${ticketId} -> ${priority}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar prioridade:', error);
    return false;
  }
};

/**
 * Updates ticket agent assignment with anti-duplication webhook protection
 */
export const updateTicketAgent = async (
  ticketId: string, 
  agentId: string | null
): Promise<boolean> => {
  try {
    console.log(`👤 Atribuindo ticket ${ticketId} ao agente: ${agentId || 'nenhum'}`);
    
    // Busca dados atuais antes da atualização
    const { data: currentTicket } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    const { error } = await supabase
      .from('tickets')
      .update({ 
        agent_id: agentId,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) {
      console.error('❌ Erro ao atribuir agente:', error);
      return false;
    }
    
    // Busca dados atualizados
    const { data: updatedTicket } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    if (updatedTicket && currentTicket) {
      // Envia evento com proteção contra duplicação (sem aguardar)
      sendTicketUpdatedEvent(
        updatedTicket as DbTicket, 
        currentTicket as DbTicket
      ).catch(error => {
        console.error('❌ Erro ao enviar evento de atualização:', error);
      });
    }

    console.log(`✅ Agente atribuído: ${ticketId} -> ${agentId || 'nenhum'}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao atribuir agente:', error);
    return false;
  }
};

/**
 * Updates the AI processing status of a ticket.
 */
export const updateTicketAIStatus = async (
  ticketId: string,
  aiProcessed: boolean,
  needsHumanReview: boolean,
  aiClassification?: string,
  suggestedPriority?: TicketPriority,
): Promise<boolean> => {
  try {
    console.log(`🤖 Atualizando status de IA do ticket ${ticketId}: processado=${aiProcessed}, revisão=${needsHumanReview}`);

    const updates: {
      ai_processed: boolean;
      needs_human_review: boolean;
      ai_classification?: string;
      suggested_priority?: TicketPriority;
      updated_at: string;
    } = {
      ai_processed: aiProcessed,
      needs_human_review: needsHumanReview,
      updated_at: new Date().toISOString(),
    };

    if (aiClassification) {
      updates.ai_classification = aiClassification;
    }

    if (suggestedPriority) {
      updates.suggested_priority = suggestedPriority;
    }

    const { error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', ticketId);

    if (error) {
      console.error('❌ Erro ao atualizar status de IA:', error);
      return false;
    }

    console.log(`✅ Status de IA atualizado: ${ticketId} -> processado=${aiProcessed}, revisão=${needsHumanReview}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar status de IA:', error);
    return false;
  }
};
