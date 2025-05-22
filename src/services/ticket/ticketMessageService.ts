
import { supabase } from "@/integrations/supabase/client";
import { Message, Attachment } from "@/types";
import { sendTicketToN8n } from "@/utils/supabaseEvents";
import { getSystemSetting } from "@/services/settingsService";
import { mapDbMessageToAppMessage, mapAppMessageToDbMessage, mapDbAttachmentToAppAttachment } from "./mappers";
import { getTicketById } from "./ticketCore";

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
  const attachmentData = {
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    file_url: publicUrl,
    ticket_id: ticketId,
    message_id: messageId
  };
  
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
