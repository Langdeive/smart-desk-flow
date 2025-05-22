
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "@/types";
import { sendTicketToN8n } from "@/utils/supabaseEvents";
import { getSystemSetting } from "@/services/settingsService";
import { mapDbTicketToAppTicket, mapAppTicketToDbTicket } from "./mappers";

// Get all tickets
export const getAllTickets = async (): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
  
  return data.map(mapDbTicketToAppTicket);
};

// Get a single ticket by ID
export const getTicketById = async (id: string): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
  
  return mapDbTicketToAppTicket(data);
};

// Create a new ticket
export const createTicket = async (ticket: Partial<Ticket>): Promise<Ticket> => {
  const dbTicket = mapAppTicketToDbTicket(ticket);
  
  const { data, error } = await supabase
    .from('tickets')
    .insert(dbTicket)
    .select();
  
  if (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
  
  const createdTicket = mapDbTicketToAppTicket(data[0]);
  
  // Send the new ticket to n8n for processing
  if (createdTicket.companyId) {
    sendTicketToN8n(createdTicket, createdTicket.companyId)
      .catch(err => console.error('Failed to send ticket to n8n:', err));
  }
  
  return createdTicket;
};

// Update ticket
export const updateTicket = async (id: string, ticketData: Partial<Ticket>): Promise<Ticket> => {
  const dbTicket = mapAppTicketToDbTicket(ticketData);
  dbTicket.updated_at = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('tickets')
    .update(dbTicket)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
  
  const updatedTicket = mapDbTicketToAppTicket(data[0]);
  
  // Check if we should send updates to n8n
  if (updatedTicket.companyId) {
    getSystemSetting<{
      ticketCreated: boolean;
      ticketUpdated: boolean;
      messageCreated: boolean;
      ticketAssigned: boolean;
    }>(updatedTicket.companyId, 'events_to_n8n')
      .then(events => {
        if (events && events.ticketUpdated) {
          sendTicketToN8n(updatedTicket, updatedTicket.companyId)
            .catch(err => console.error('Failed to send ticket update to n8n:', err));
        }
      })
      .catch(err => console.error('Failed to check event settings:', err));
  }
  
  return updatedTicket;
};

// Get tickets that need AI processing
export const getTicketsNeedingAIProcessing = async (): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('ai_processed', false)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching tickets needing AI processing:', error);
    throw error;
  }
  
  return data.map(mapDbTicketToAppTicket);
};
