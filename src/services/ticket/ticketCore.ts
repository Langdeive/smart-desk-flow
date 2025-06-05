import { supabase } from '@/integrations/supabase/client';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '@/types';
import { 
  mapDbTicketToAppTicket, 
  mapAppTicketToDbTicket, 
  DbTicket 
} from './mappers';
import { sendTicketCreatedEvent } from './ticketEventService';

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

export interface CreateTicketParams {
  title: string;
  description: string;
  status?: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  userId: string;
  companyId: string;
  source?: string;
  contactId?: string;
}

/**
 * Creates a new ticket with anti-duplication webhook protection
 */
export const createTicket = async (params: CreateTicketParams): Promise<Ticket> => {
  const {
    title,
    description,
    status = 'new',
    priority,
    category,
    userId,
    companyId,
    source = 'web',
    contactId
  } = params;

  try {
    console.log('🎫 Criando ticket com proteção anti-duplicação...');
    
    const ticketData = {
      title,
      description,
      status,
      priority,
      category,
      user_id: userId,
      company_id: companyId,
      source,
      contact_id: contactId,
      ai_processed: false,
      needs_human_review: true,
    };

    const { data, error } = await supabase
      .from('tickets')
      .insert(ticketData)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar ticket:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Ticket criado mas dados não retornados');
    }

    console.log('✅ Ticket criado no banco:', data.id);
    
    // Converte para formato da aplicação
    const ticket = mapDbTicketToAppTicket(data as DbTicket);
    
    // Envia evento com proteção contra duplicação (sem aguardar)
    sendTicketCreatedEvent(data as DbTicket).catch(error => {
      console.error('❌ Erro ao enviar evento de criação:', error);
    });
    
    return ticket;
  } catch (error) {
    console.error('❌ Erro ao criar ticket:', error);
    throw error;
  }
};

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
  
  // Ticket update automatically triggers n8n integration via database trigger
  console.log('Ticket updated, n8n integration triggered automatically:', updatedTicket.id);
  
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
