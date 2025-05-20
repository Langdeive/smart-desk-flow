
import { supabase } from "@/integrations/supabase/client";
import { SuggestedResponse } from "@/types/suggested-response";

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
