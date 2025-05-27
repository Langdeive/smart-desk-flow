import { supabase } from "@/integrations/supabase/client";
import { Ticket, TicketStatus, TicketPriority } from "@/types";
import { sendTicketToN8n } from "@/utils/supabaseEvents";
import { getSystemSetting } from "@/services/settingsService";
import { mapDbTicketToAppTicket } from "./mappers";

// Update ticket status
export const updateTicketStatus = async (id: string, status: TicketStatus): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
  
  return mapDbTicketToAppTicket(data[0]);
};

// Update ticket priority
export const updateTicketPriority = async (id: string, priority: TicketPriority): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('tickets')
    .update({ priority, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating ticket priority:', error);
    throw error;
  }
  
  return mapDbTicketToAppTicket(data[0]);
};

// Update ticket assigned agent
export const updateTicketAgent = async (id: string, agentId: string | null): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('tickets')
    .update({ 
      agent_id: agentId, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating ticket agent:', error);
    throw error;
  }
  
  const updatedTicket = mapDbTicketToAppTicket(data[0]);
  
  // Check if we should send updates to n8n using fallback configuration
  if (updatedTicket.companyId) {
    const events = await getSystemSetting<{
      ticketCreated: boolean;
      ticketUpdated: boolean;
      messageCreated: boolean;
      ticketAssigned: boolean;
    }>(updatedTicket.companyId, 'events_to_n8n');
    
    if (events?.ticketAssigned) {
      sendTicketToN8n(updatedTicket, updatedTicket.companyId)
        .catch(err => console.error('Failed to send ticket assign to n8n:', err));
    }
  }
  
  return updatedTicket;
};

// Update ticket AI processing status
export const updateTicketAIStatus = async (
  id: string,
  aiData: {
    aiProcessed?: boolean;
    aiClassification?: string;
    suggestedPriority?: TicketPriority;
    needsAdditionalInfo?: boolean;
    confidenceScore?: number;
    needsHumanReview?: boolean;
  }
): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('tickets')
    .update({
      ai_processed: aiData.aiProcessed,
      ai_classification: aiData.aiClassification,
      suggested_priority: aiData.suggestedPriority,
      needs_additional_info: aiData.needsAdditionalInfo,
      confidence_score: aiData.confidenceScore,
      needs_human_review: aiData.needsHumanReview,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating ticket AI status:', error);
    throw error;
  }
  
  return mapDbTicketToAppTicket(data[0]);
};
