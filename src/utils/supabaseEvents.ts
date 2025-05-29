
import { supabase } from '@/integrations/supabase/client';

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
    
    console.log('Ticket AI processed successfully:', ticketId);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao processar atualização do n8n:', error);
    return { success: false, error };
  }
};

/**
 * Get n8n integration logs for monitoring
 */
export const getN8nIntegrationLogs = async (companyId: string, limit: number = 50) => {
  try {
    const { data, error } = await supabase
      .from('n8n_integration_logs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar logs de integração n8n:', error);
    return { success: false, error };
  }
};

/**
 * Get n8n integration statistics
 */
export const getN8nIntegrationStats = async (companyId: string) => {
  try {
    const { data, error } = await supabase
      .from('n8n_integration_stats')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar estatísticas de integração n8n:', error);
    return { success: false, error };
  }
};
