
export type SuggestedResponse = {
  id: string;
  ticket_id: string;
  message: string;
  confidence: number;
  approved: boolean | null;
  applied: boolean | null;
  applied_at: string | null;
  applied_by: string | null;
  created_at: string;
};

export interface SuggestedResponseWithTicket extends SuggestedResponse {
  ticket: {
    title: string;
    status: string;
    priority: string;
  };
}

export interface SuggestedResponseMetrics {
  total: number;
  applied: number;
  approved: number;
  rejected: number;
  pending: number;
  avgConfidence: number;
  applicationRate: number;
  approvalRate: number;
}
