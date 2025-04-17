
import { supabase } from "@/integrations/supabase/client";

export interface TicketHistoryItem {
  id: string;
  ticket_id: string;
  user_id: string | null;
  tipo_acao: string;
  valor_anterior: string | null;
  valor_novo: string | null;
  created_at: string;
}

// Get history for a specific ticket
export const getTicketHistory = async (ticketId: string): Promise<TicketHistoryItem[]> => {
  // Using 'from' method with string parameter to handle tables that might not be in the types yet
  const { data, error } = await supabase
    .from('historico_tickets')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching ticket history:', error);
    throw error;
  }
  
  return data as TicketHistoryItem[];
};

// Add a manual history entry
export const addManualHistoryEntry = async (
  ticketId: string,
  tipoAcao: string,
  valorAnterior: string | null,
  valorNovo: string | null
): Promise<TicketHistoryItem> => {
  // Using 'from' method with string parameter to handle tables that might not be in the types yet
  const { data, error } = await supabase
    .from('historico_tickets')
    .insert([{
      ticket_id: ticketId,
      tipo_acao: tipoAcao,
      valor_anterior: valorAnterior,
      valor_novo: valorNovo
    }])
    .select();
  
  if (error) {
    console.error('Error adding history entry:', error);
    throw error;
  }
  
  return data[0] as TicketHistoryItem;
};
