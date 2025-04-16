
import { supabase } from "@/integrations/supabase/client";
import { Ticket, Message, Attachment, TicketStatus, TicketPriority } from "@/types";

// Get all tickets
export const getAllTickets = async () => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
  
  return data as Ticket[];
};

// Get a single ticket by ID
export const getTicketById = async (id: string) => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
  
  return data as Ticket;
};

// Create a new ticket
export const createTicket = async (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'aiProcessed' | 'needsHumanReview'>) => {
  const { data, error } = await supabase
    .from('tickets')
    .insert([ticket])
    .select();
  
  if (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
  
  return data[0] as Ticket;
};

// Update ticket status
export const updateTicketStatus = async (id: string, status: TicketStatus) => {
  const { data, error } = await supabase
    .from('tickets')
    .update({ status, updated_at: new Date() })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
  
  return data[0] as Ticket;
};

// Update ticket priority
export const updateTicketPriority = async (id: string, priority: TicketPriority) => {
  const { data, error } = await supabase
    .from('tickets')
    .update({ priority, updated_at: new Date() })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating ticket priority:', error);
    throw error;
  }
  
  return data[0] as Ticket;
};

// Get messages for a ticket
export const getMessagesForTicket = async (ticketId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
  
  return data as Message[];
};

// Add a message to a ticket
export const addMessageToTicket = async (message: Omit<Message, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select();
  
  if (error) {
    console.error('Error adding message:', error);
    throw error;
  }
  
  return data[0] as Message;
};

// Get attachments for a ticket
export const getAttachmentsForTicket = async (ticketId: string) => {
  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching attachments:', error);
    throw error;
  }
  
  return data as Attachment[];
};

// Upload attachment and create database entry
export const uploadAttachment = async (
  file: File, 
  ticketId: string, 
  messageId?: string
) => {
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
  
  return data[0] as Attachment;
};
