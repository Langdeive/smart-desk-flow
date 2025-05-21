
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/types';
import { getTicketById } from '@/services/ticketService';

interface UseRealtimeTicketUpdatesParams {
  ticketId: string;
  onUpdate?: (ticket: Ticket) => void;
}

export const useRealtimeTicketUpdates = ({ ticketId, onUpdate }: UseRealtimeTicketUpdatesParams) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    let mounted = true;

    // Initial fetch
    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        const fetchedTicket = await getTicketById(ticketId);
        if (mounted) {
          setTicket(fetchedTicket);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching ticket:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTicket();

    // Set up realtime subscription
    const channel = supabase
      .channel(`ticket-updates-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tickets',
          filter: `id=eq.${ticketId}`,
        },
        async (payload) => {
          console.log('Realtime ticket update received:', payload);
          
          try {
            // Fetch the updated ticket to get the complete data
            const updatedTicket = await getTicketById(ticketId);
            setTicket(updatedTicket);
            
            // Call onUpdate callback if provided
            if (onUpdate) {
              onUpdate(updatedTicket);
            }
          } catch (err) {
            console.error('Error fetching updated ticket:', err);
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [ticketId, onUpdate]);

  return { ticket, isLoading, error, setTicket };
};
