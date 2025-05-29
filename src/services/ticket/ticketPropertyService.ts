
import { supabase } from "@/integrations/supabase/client";
import { Ticket, TicketStatus, TicketPriority } from "@/types";
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
  
  // Status update automatically triggers n8n integration via database trigger
  console.log('Ticket status updated, n8n integration triggered automatically:', id);
  
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
  
  // Priority update automatically triggers n8n integration via database trigger
  console.log('Ticket priority updated, n8n integration triggered automatically:', id);
  
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
  
  // Agent assignment automatically triggers n8n integration via database trigger
  console.log('Ticket agent assigned, n8n integration triggered automatically:', id);
  
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
  
  // AI status update automatically triggers n8n integration via database trigger
  console.log('Ticket AI status updated, n8n integration triggered automatically:', id);
  
  return mapDbTicketToAppTicket(data[0]);
};
