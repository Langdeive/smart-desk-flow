
import { Ticket } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { getSystemSetting } from '@/services/settingsService';

/**
 * Sends a ticket to n8n for AI processing
 */
export const sendTicketToN8n = async (payload: Ticket | { ticket: Ticket, message: any }, companyId: string): Promise<{success: boolean, error?: any}> => {
  try {
    // Get webhook URL from settings
    const n8nWebhookUrl = await getSystemSetting<string>(companyId, 'n8n_webhook_url');
    const enableProcessing = await getSystemSetting<boolean>(companyId, 'enable_ai_processing');
    
    if (!n8nWebhookUrl || !enableProcessing) {
      console.log('N8n processing not configured or disabled for company:', companyId);
      return { success: false, error: 'N8n webhook not configured or processing disabled' };
    }
    
    console.log('Enviando dados para processamento n8n');
    
    // Determine event type based on payload structure
    let eventType = 'ticket.created';
    let data = payload;
    
    if ('message' in payload) {
      eventType = 'message.created';
      data = payload;
    } else if (('agentId' in payload) && payload.agentId) {
      eventType = 'ticket.assigned';
    } else {
      eventType = 'ticket.updated';
    }
    
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        data,
        timestamp: new Date().toISOString(),
        companyId
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar para n8n: ${response.statusText}`);
    }

    console.log('Dados enviados com sucesso para n8n');
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar dados para n8n:', error);
    return { success: false, error };
  }
};

/**
 * Processes an update received from n8n
 */
export const processN8nUpdate = async (updateData: {
  ticketId: string;
  aiClassification?: string;
  suggestedPriority?: string;
  suggestedKnowledgeArticles?: any[];
  aiResponse?: string;
  needsHumanReview?: boolean;
  confidenceScore?: number;
}) => {
  // Destructure the update data
  const { 
    ticketId, 
    aiClassification, 
    suggestedPriority, 
    suggestedKnowledgeArticles,
    aiResponse,
    needsHumanReview,
    confidenceScore
  } = updateData;
  
  try {
    // Update the ticket with the AI processed data
    const { error } = await supabase
      .from('tickets')
      .update({
        ai_processed: true,
        ai_classification: aiClassification,
        suggested_priority: suggestedPriority,
        needs_human_review: needsHumanReview ?? true,
        confidence_score: confidenceScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) throw error;
    
    // If there's an AI response, create a suggested response
    if (aiResponse) {
      const { error: responseError } = await supabase
        .from('suggested_responses')
        .insert({
          ticket_id: ticketId,
          message: aiResponse,
          confidence: confidenceScore || 0.7,
        });
      
      if (responseError) throw responseError;
    }
    
    // Publish event internally
    console.log('Ticket AI processed successfully:', ticketId);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao processar atualização do n8n:', error);
    return { success: false, error };
  }
};
