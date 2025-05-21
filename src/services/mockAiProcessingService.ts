
import { Ticket, TicketPriority } from "@/types";
import { updateTicketAIStatus } from "./ticketService";
import { createSuggestedResponse } from "./suggestedResponseService";

/**
 * Process a ticket with simulated AI - this will be replaced by n8n
 * but can serve as a fallback/demo mode
 */
export const processTicketWithAi = async (ticket: Ticket): Promise<boolean> => {
  console.log('[MOCK AI] Processing ticket:', ticket.id);
  
  try {
    // Simulate network delay (0.5 to 3 seconds)
    const delay = Math.floor(Math.random() * 2500) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Randomly determine ticket category based on title/description
    const categories = ['technical', 'billing', 'feature_request', 'general_inquiry', 'bug_report'];
    const categoryIndex = Math.floor(Math.random() * categories.length);
    const aiClassification = categories[categoryIndex];
    
    // Randomly determine priority
    const priorities: TicketPriority[] = ['low', 'medium', 'high'];
    const priorityIndex = Math.floor(Math.random() * priorities.length);
    const suggestedPriority = priorities[priorityIndex];
    
    // Determine if we need more info (20% chance)
    const needsAdditionalInfo = Math.random() < 0.2;
    
    // Set confidence score (0.5 to 1.0)
    const confidenceScore = 0.5 + (Math.random() * 0.5);
    
    // Determine if it needs human review (based on confidence)
    const needsHumanReview = confidenceScore < 0.8;
    
    // Update the ticket with AI classification
    await updateTicketAIStatus(ticket.id, {
      aiProcessed: true,
      aiClassification,
      suggestedPriority,
      needsAdditionalInfo,
      confidenceScore,
      needsHumanReview
    });
    
    // Generate AI suggested response (70% chance)
    if (Math.random() < 0.7) {
      const responses = [
        `Thank you for contacting us about your ${aiClassification} issue. Our team will look into this right away and get back to you as soon as possible.`,
        `We've received your ${aiClassification} request and have assigned it a ${suggestedPriority} priority. A support agent will contact you shortly.`,
        `I understand you're having a ${aiClassification} problem. Could you please provide more details about the specific error messages you're seeing?`,
        `Thank you for reporting this ${aiClassification} issue. We're currently investigating and will update you on our progress.`
      ];
      
      const responseIndex = Math.floor(Math.random() * responses.length);
      const suggestedMessage = responses[responseIndex];
      
      // Add suggested response
      await createSuggestedResponse({
        ticketId: ticket.id,
        message: suggestedMessage,
        confidence: confidenceScore
      });
    }
    
    console.log('[MOCK AI] Successfully processed ticket:', ticket.id);
    return true;
  } catch (error) {
    console.error('[MOCK AI] Error processing ticket:', error);
    return false;
  }
};
