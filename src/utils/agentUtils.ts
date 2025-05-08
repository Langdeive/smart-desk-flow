
import { Agent } from '@/types/agent.types';

/**
 * Validates that the agent status is one of the allowed values
 */
export const validateAgentStatus = (status: string | null | undefined): Agent['status'] => {
  if (status === 'active' || status === 'inactive' || status === 'awaiting') {
    return status;
  }
  // Default to 'awaiting' if status is not one of the allowed values
  return 'awaiting';
};
