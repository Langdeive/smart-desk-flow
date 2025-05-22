
import { supabase } from "@/integrations/supabase/client";
import { Ticket, SLAConfig } from "@/types";
import { addHours, isAfter } from "date-fns";
import { getSystemSetting } from "@/services/settingsService";
import { mapDbTicketToAppTicket } from "./mappers";
import { getTicketById } from "./ticketCore";

// Get default SLA configuration for a company
export const getSLAConfig = async (companyId: string): Promise<SLAConfig> => {
  try {
    const config = await getSystemSetting<SLAConfig>(companyId, 'sla_config');
    
    if (config) {
      return config;
    }
    
    // Return default SLA configuration if none is found
    return {
      firstResponseHours: {
        low: 24,
        medium: 8,
        high: 4,
        critical: 1
      },
      resolutionHours: {
        low: 72,
        medium: 48,
        high: 24,
        critical: 8
      },
      businessHours: {
        start: "09:00",
        end: "18:00",
        workDays: [1, 2, 3, 4, 5] // Monday to Friday
      }
    };
  } catch (err) {
    console.error('Error fetching SLA config:', err);
    throw err;
  }
};

// Calculate SLA deadlines for a ticket
export const calculateSLADeadlines = async (
  ticket: Ticket
): Promise<{ firstResponseDeadline: Date; resolutionDeadline: Date }> => {
  const slaConfig = await getSLAConfig(ticket.companyId);
  
  // For this MVP, we'll use a simple calculation without considering business hours
  const createdAt = new Date(ticket.createdAt);
  
  const firstResponseHours = slaConfig.firstResponseHours[ticket.priority];
  const resolutionHours = slaConfig.resolutionHours[ticket.priority];
  
  const firstResponseDeadline = addHours(createdAt, firstResponseHours);
  const resolutionDeadline = addHours(createdAt, resolutionHours);
  
  return { firstResponseDeadline, resolutionDeadline };
};

// Update ticket SLA information
export const updateTicketSLA = async (id: string): Promise<Ticket> => {
  // Get current ticket first
  const ticket = await getTicketById(id);
  
  // Calculate SLA deadlines
  const { firstResponseDeadline, resolutionDeadline } = await calculateSLADeadlines(ticket);
  
  // Determine SLA status
  let slaStatus: "on_track" | "at_risk" | "breached" = "on_track";
  
  const now = new Date();
  if (isAfter(now, firstResponseDeadline) || isAfter(now, resolutionDeadline)) {
    slaStatus = "breached";
  } else {
    // Consider "at risk" if within 1 hour of any deadline
    const oneHourFromNow = addHours(now, 1);
    if (isAfter(oneHourFromNow, firstResponseDeadline) || isAfter(oneHourFromNow, resolutionDeadline)) {
      slaStatus = "at_risk";
    }
  }
  
  // Update ticket with SLA information
  const { data, error } = await supabase
    .from('tickets')
    .update({
      first_response_deadline: firstResponseDeadline.toISOString(),
      resolution_deadline: resolutionDeadline.toISOString(),
      sla_status: slaStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating ticket SLA:', error);
    throw error;
  }
  
  return mapDbTicketToAppTicket(data[0]);
};
