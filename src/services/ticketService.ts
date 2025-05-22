
/**
 * Main ticket service entry point.
 * This file exports all ticket-related services from their specialized modules.
 */

// Export ticket core services
export {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  getTicketsNeedingAIProcessing,
} from './ticket/ticketCore';

// Export ticket property services
export {
  updateTicketStatus,
  updateTicketPriority,
  updateTicketAgent,
  updateTicketAIStatus,
} from './ticket/ticketPropertyService';

// Export ticket message services
export {
  getMessagesForTicket,
  addMessageToTicket,
  getAttachmentsForTicket,
  uploadAttachment,
} from './ticket/ticketMessageService';

// Export ticket SLA services
export {
  getSLAConfig,
  calculateSLADeadlines,
  updateTicketSLA,
} from './ticket/ticketSlaService';

// Export mapper utilities for testing or advanced use cases
export {
  mapDbTicketToAppTicket,
  mapDbMessageToAppMessage,
  mapAppTicketToDbTicket,
  mapAppMessageToDbMessage,
  mapDbAttachmentToAppAttachment,
} from './ticket/mappers';

// Export types with the 'export type' syntax to fix the error
export type { DbTicket, DbMessage, DbAttachment } from './ticket/mappers';
