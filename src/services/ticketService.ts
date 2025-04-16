
import { supabase } from "@/integrations/supabase/client";
import { Ticket, Message, Attachment, TicketStatus, TicketPriority, TicketCategory } from "@/types";

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
    aiProcessed: dbTicket.ai_processed,
    needsHumanReview: dbTicket.needs_human_review
  };
};

// Helper function to convert app ticket to database ticket
const mapAppTicketToDbTicket = (appTicket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "aiProcessed" | "needsHumanReview">) => {
  return {
    title: appTicket.title,
    description: appTicket.description,
    status: appTicket.status,
    priority: appTicket.priority,
    category: appTicket.category,
    user_id: appTicket.userId,
    agent_id: appTicket.agentId,
    company_id: appTicket.companyId,
    source: appTicket.source
  };
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

// Helper function to convert app message to database message
const mapAppMessageToDbMessage = (appMessage: Omit<Message, "id" | "createdAt">) => {
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
export const createTicket = async (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "aiProcessed" | "needsHumanReview">): Promise<Ticket> => {
  const dbTicket = mapAppTicketToDbTicket(ticket);
  
  const { data, error } = await supabase
    .from('tickets')
    .insert([dbTicket])
    .select();
  
  if (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
  
  return mapDbTicketToAppTicket(data[0]);
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
    .insert([dbMessage])
    .select();
  
  if (error) {
    console.error('Error adding message:', error);
    throw error;
  }
  
  return mapDbMessageToAppMessage(data[0]);
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
  const attachmentData = {
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    file_url: publicUrl,
    ticket_id: ticketId,
    message_id: messageId || null
  };
  
  const { data, error } = await supabase
    .from('attachments')
    .insert([attachmentData])
    .select();
  
  if (error) {
    console.error('Error creating attachment record:', error);
    throw error;
  }
  
  return mapDbAttachmentToAppAttachment(data[0]);
};
