
import { supabase } from "@/integrations/supabase/client";
import { Ticket, Message, Attachment, TicketStatus, TicketPriority, TicketCategory } from "@/types";
import { sendTicketToN8n } from "@/utils/supabaseEvents";
import { getSystemSetting } from "@/services/settingsService";

// Helper function to convert database ticket to app ticket
const mapDbTicketToAppTicket = (dbTicket: any): Ticket => {
  return {
    id: dbTicket.id,
    title: dbTicket.title,
    description: dbTicket.description,
    status: dbTicket.status as TicketStatus,
    priority: dbTicket.priority as TicketPriority,
    category: dbTicket.category as TicketCategory,
    userId: dbTicket.user_id,
    agentId: dbTicket.agent_id,
    companyId: dbTicket.company_id,
    createdAt: new Date(dbTicket.created_at),
    updatedAt: new Date(dbTicket.updated_at),
    source: dbTicket.source as "web" | "email" | "whatsapp",
    aiProcessed: dbTicket.ai_processed || false,
    needsHumanReview: dbTicket.needs_human_review || true,
    contactId: dbTicket.contact_id,
    // AI classification fields
    aiClassification: dbTicket.ai_classification,
    suggestedPriority: dbTicket.suggested_priority as TicketPriority,
    needsAdditionalInfo: dbTicket.needs_additional_info || false,
    confidenceScore: dbTicket.confidence_score
  };
};

// Define the database ticket type to match what Supabase expects
type DbTicket = {
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  user_id: string;
  agent_id?: string;
  company_id: string;
  source: string;
  contact_id?: string;
  ai_processed?: boolean;
  needs_human_review?: boolean;
  ai_classification?: string;
  suggested_priority?: string;
  needs_additional_info?: boolean;
  confidence_score?: number;
  updated_at?: string; // Added this property to fix the error
};

// Helper function to convert app ticket to database ticket
const mapAppTicketToDbTicket = (appTicket: Partial<Ticket>): DbTicket => {
  const dbTicket: DbTicket = {
    title: appTicket.title!,
    description: appTicket.description!,
    status: appTicket.status!,
    priority: appTicket.priority!,
    category: appTicket.category!,
    user_id: appTicket.userId!,
    company_id: appTicket.companyId!,
    source: appTicket.source!,
  };
  
  // Add optional fields if they exist
  if (appTicket.agentId) dbTicket.agent_id = appTicket.agentId;
  if (appTicket.contactId) dbTicket.contact_id = appTicket.contactId;
  if ('aiProcessed' in appTicket) dbTicket.ai_processed = appTicket.aiProcessed;
  if ('needsHumanReview' in appTicket) dbTicket.needs_human_review = appTicket.needsHumanReview;
  if ('aiClassification' in appTicket) dbTicket.ai_classification = appTicket.aiClassification;
  if ('suggestedPriority' in appTicket) dbTicket.suggested_priority = appTicket.suggestedPriority;
  if ('needsAdditionalInfo' in appTicket) dbTicket.needs_additional_info = appTicket.needsAdditionalInfo;
  if ('confidenceScore' in appTicket) dbTicket.confidence_score = appTicket.confidenceScore;
  
  return dbTicket;
};

// Helper function to convert database message to app message
const mapDbMessageToAppMessage = (dbMessage: any): Message => {
  return {
    id: dbMessage.id,
    content: dbMessage.content,
    ticketId: dbMessage.ticket_id,
    userId: dbMessage.user_id,
    createdAt: new Date(dbMessage.created_at),
    isFromClient: dbMessage.is_from_client,
    isAutomatic: dbMessage.is_automatic
  };
};

// Define the database message type
type DbMessage = {
  content: string;
  ticket_id: string;
  user_id: string;
  is_from_client: boolean;
  is_automatic: boolean;
};

// Helper function to convert app message to database message
const mapAppMessageToDbMessage = (appMessage: Omit<Message, "id" | "createdAt">): DbMessage => {
  return {
    content: appMessage.content,
    ticket_id: appMessage.ticketId,
    user_id: appMessage.userId,
    is_from_client: appMessage.isFromClient,
    is_automatic: appMessage.isAutomatic
  };
};

// Helper function to convert database attachment to app attachment
const mapDbAttachmentToAppAttachment = (dbAttachment: any): Attachment => {
  return {
    id: dbAttachment.id,
    fileName: dbAttachment.file_name,
    fileType: dbAttachment.file_type,
    fileSize: dbAttachment.file_size,
    fileUrl: dbAttachment.file_url,
    ticketId: dbAttachment.ticket_id,
    messageId: dbAttachment.message_id,
    createdAt: new Date(dbAttachment.created_at)
  };
};

// Define the database attachment type
type DbAttachment = {
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  ticket_id: string;
  message_id?: string;
};

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
  
  // Check if we should send updates to n8n
  if (updatedTicket.companyId) {
    getSystemSetting<{
      ticketCreated: boolean;
      ticketUpdated: boolean;
      messageCreated: boolean;
      ticketAssigned: boolean;
    }>(updatedTicket.companyId, 'events_to_n8n')
      .then(events => {
        if (events && events.ticketAssigned) {
          sendTicketToN8n(updatedTicket, updatedTicket.companyId)
            .catch(err => console.error('Failed to send ticket assign to n8n:', err));
        }
      })
      .catch(err => console.error('Failed to check event settings:', err));
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

// Get messages for a ticket
export const getMessagesForTicket = async (ticketId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
  
  return data.map(mapDbMessageToAppMessage);
};

// Add a message to a ticket
export const addMessageToTicket = async (message: Omit<Message, "id" | "createdAt">): Promise<Message> => {
  const dbMessage = mapAppMessageToDbMessage(message);
  
  const { data, error } = await supabase
    .from('messages')
    .insert(dbMessage)
    .select();
  
  if (error) {
    console.error('Error adding message:', error);
    throw error;
  }
  
  const createdMessage = mapDbMessageToAppMessage(data[0]);
  
  // Get the ticket for this message
  const ticket = await getTicketById(message.ticketId);
  
  // Check if we should send message updates to n8n
  if (ticket.companyId) {
    getSystemSetting<{
      ticketCreated: boolean;
      ticketUpdated: boolean;
      messageCreated: boolean;
      ticketAssigned: boolean;
    }>(ticket.companyId, 'events_to_n8n')
      .then(events => {
        if (events && events.messageCreated) {
          // Clone the ticket and attach message information
          const ticketWithMessage = {
            ...ticket
          };
          
          // Send event with ticket and message information
          sendTicketToN8n({
            ticket: ticketWithMessage,
            message: createdMessage
          }, ticket.companyId)
            .catch(err => console.error('Failed to send message event to n8n:', err));
        }
      })
      .catch(err => console.error('Failed to check event settings:', err));
  }
  
  return createdMessage;
};

// Get attachments for a ticket
export const getAttachmentsForTicket = async (ticketId: string): Promise<Attachment[]> => {
  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching attachments:', error);
    throw error;
  }
  
  return data.map(mapDbAttachmentToAppAttachment);
};

// Upload attachment and create database entry
export const uploadAttachment = async (
  file: File, 
  ticketId: string, 
  messageId?: string
): Promise<Attachment> => {
  // Generate a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `attachments/${ticketId}/${fileName}`;
  
  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from('ticket-attachments')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }
  
  // Get the public URL for the file
  const { data: { publicUrl } } = supabase.storage
    .from('ticket-attachments')
    .getPublicUrl(filePath);
  
  // Create attachment record in database
  const attachmentData: DbAttachment = {
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    file_url: publicUrl,
    ticket_id: ticketId,
  };
  
  if (messageId) {
    attachmentData.message_id = messageId;
  }
  
  const { data, error } = await supabase
    .from('attachments')
    .insert(attachmentData)
    .select();
  
  if (error) {
    console.error('Error creating attachment record:', error);
    throw error;
  }
  
  return mapDbAttachmentToAppAttachment(data[0]);
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
