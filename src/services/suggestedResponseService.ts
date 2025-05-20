
import { supabase } from "@/integrations/supabase/client";
import { SuggestedResponse, SuggestedResponseWithTicket } from "@/types/suggested-response";
import { toast } from "sonner";

// Buscar sugestões para um ticket específico
export const getSuggestedResponsesForTicket = async (ticketId: string): Promise<SuggestedResponse[]> => {
  const { data, error } = await supabase
    .from('suggested_responses')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('confidence', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar sugestões de respostas:', error);
    throw error;
  }
  
  return data as SuggestedResponse[];
};

// Buscar sugestões pendentes para todos os tickets
export const getPendingSuggestedResponses = async (companyId?: string, limit: number = 20): Promise<SuggestedResponseWithTicket[]> => {
  let query = supabase
    .from('suggested_responses')
    .select(`
      *,
      ticket:ticket_id (
        title, 
        status,
        priority
      )
    `)
    .is('approved', null)
    .is('applied', null)
    .order('confidence', { ascending: false })
    .limit(limit);
  
  // Se informado company_id, filtra os tickets por empresa
  if (companyId) {
    query = query.eq('ticket.company_id', companyId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erro ao buscar sugestões pendentes:', error);
    throw error;
  }
  
  return data as unknown as SuggestedResponseWithTicket[];
};

// Aprovar uma sugestão de resposta
export const approveSuggestedResponse = async (
  id: string, 
  agentId: string
): Promise<SuggestedResponse> => {
  const { data, error } = await supabase
    .from('suggested_responses')
    .update({
      approved: true,
      applied: true,
      applied_at: new Date().toISOString(),
      applied_by: agentId
    })
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error('Erro ao aprovar sugestão:', error);
    throw error;
  }
  
  return data as SuggestedResponse;
};

// Rejeitar uma sugestão de resposta
export const rejectSuggestedResponse = async (id: string): Promise<SuggestedResponse> => {
  const { data, error } = await supabase
    .from('suggested_responses')
    .update({ approved: false })
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error('Erro ao rejeitar sugestão:', error);
    throw error;
  }
  
  return data as SuggestedResponse;
};

// Criar uma nova sugestão de resposta
export const createSuggestedResponse = async (
  ticketId: string,
  message: string,
  confidence: number
): Promise<SuggestedResponse> => {
  const { data, error } = await supabase
    .from('suggested_responses')
    .insert([{
      ticket_id: ticketId,
      message,
      confidence
    }])
    .select('*')
    .single();
  
  if (error) {
    console.error('Erro ao criar sugestão:', error);
    throw error;
  }
  
  return data as SuggestedResponse;
};

// Criar múltiplas sugestões de resposta
export const createMultipleSuggestedResponses = async (
  ticketId: string,
  suggestions: { message: string, confidence: number }[]
): Promise<SuggestedResponse[]> => {
  if (!suggestions || suggestions.length === 0) {
    return [];
  }
  
  const formattedSuggestions = suggestions.map(suggestion => ({
    ticket_id: ticketId,
    message: suggestion.message,
    confidence: suggestion.confidence
  }));
  
  const { data, error } = await supabase
    .from('suggested_responses')
    .insert(formattedSuggestions)
    .select('*');
  
  if (error) {
    console.error('Erro ao criar múltiplas sugestões:', error);
    throw error;
  }
  
  return data as SuggestedResponse[];
};

// Obter métricas de sugestões de resposta
export const getSuggestedResponseMetrics = async (companyId: string, timeRange?: { start: Date, end: Date }) => {
  try {
    let query = supabase
      .from('suggested_responses')
      .select(`
        id,
        approved,
        applied,
        confidence,
        ticket:ticket_id (company_id)
      `)
      .eq('ticket.company_id', companyId);
    
    if (timeRange) {
      query = query.gte('created_at', timeRange.start.toISOString())
        .lte('created_at', timeRange.end.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const total = data.length;
    const applied = data.filter(item => item.applied).length;
    const approved = data.filter(item => item.approved).length;
    const rejected = data.filter(item => item.approved === false).length;
    const pending = data.filter(item => item.approved === null).length;
    
    const avgConfidence = data.reduce((sum, item) => sum + (item.confidence || 0), 0) / (total || 1);
    
    return {
      total,
      applied,
      approved,
      rejected,
      pending,
      avgConfidence,
      applicationRate: total > 0 ? applied / total : 0,
      approvalRate: (approved + rejected) > 0 ? approved / (approved + rejected) : 0
    };
    
  } catch (error) {
    console.error('Erro ao obter métricas de sugestões:', error);
    toast.error('Não foi possível carregar as métricas de sugestões');
    throw error;
  }
};
