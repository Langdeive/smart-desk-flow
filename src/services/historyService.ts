
import { supabase } from "@/integrations/supabase/client";
import { TicketHistoryItem } from "@/types";
import { Tables } from "@/integrations/supabase/types";

// Get history for a specific ticket
export const getTicketHistory = async (ticketId: string): Promise<TicketHistoryItem[]> => {
  const { data, error } = await supabase
    .from('historico_tickets')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching ticket history:', error);
    throw error;
  }
  
  return (data || []) as TicketHistoryItem[];
};

// Add a manual history entry
export const addManualHistoryEntry = async (
  ticketId: string,
  tipoAcao: string,
  valorAnterior: string | null,
  valorNovo: string | null
): Promise<TicketHistoryItem> => {
  const { data, error } = await supabase
    .from('historico_tickets')
    .insert({
      ticket_id: ticketId,
      tipo_acao: tipoAcao,
      valor_anterior: valorAnterior,
      valor_novo: valorNovo
    })
    .select();
  
  if (error) {
    console.error('Error adding history entry:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    throw new Error('No data returned after inserting history entry');
  }
  
  return data[0] as TicketHistoryItem;
};
