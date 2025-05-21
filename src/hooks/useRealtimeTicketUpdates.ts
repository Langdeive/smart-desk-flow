
import { useState, useEffect, useRef } from 'react';
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
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Use refs to prevent infinite loops and track local updates
  const channelRef = useRef<any>(null);
  const localUpdateInProgressRef = useRef<boolean>(false);
  const previousTicketRef = useRef<Ticket | null>(null);

  // Fetch ticket initially or when ticketId changes
  useEffect(() => {
    let mounted = true;

    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        const fetchedTicket = await getTicketById(ticketId);
        
        if (mounted) {
          setTicket(fetchedTicket);
          previousTicketRef.current = fetchedTicket;
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

    return () => {
      mounted = false;
    };
  }, [ticketId]);

  // Set up realtime subscription separately from data fetching
  useEffect(() => {
    // Skip subscription setup if no valid ticketId
    if (!ticketId) return;
    
    console.log(`[WebSocket] Setting up subscription for ticket: ${ticketId}`);

    // Clear any existing subscription
    if (channelRef.current) {
      console.log('[WebSocket] Removing existing channel before creating new one');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create new subscription
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
          console.log('[WebSocket] Received update:', payload);
          
          // Skip processing if we initiated this update
          if (localUpdateInProgressRef.current) {
            console.log('[WebSocket] Ignoring update - local change in progress');
            return;
          }
          
          try {
            // Fetch the updated ticket to get the complete data
            const updatedTicket = await getTicketById(ticketId);
            
            // Compare with previous ticket data to avoid unnecessary updates
            const hasChanged = JSON.stringify(previousTicketRef.current) !== JSON.stringify(updatedTicket);
            
            if (hasChanged) {
              console.log('[WebSocket] Ticket data changed, updating state');
              setTicket(updatedTicket);
              previousTicketRef.current = updatedTicket;
              
              // Call onUpdate callback if provided
              if (onUpdate) {
                onUpdate(updatedTicket);
              }
            } else {
              console.log('[WebSocket] No meaningful changes detected');
            }
          } catch (err) {
            console.error('[WebSocket] Error fetching updated ticket:', err);
          }
        }
      )
      .subscribe((status) => {
        console.log('[WebSocket] Subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    // Store reference to channel for cleanup
    channelRef.current = channel;

    // Cleanup function
    return () => {
      console.log('[WebSocket] Cleaning up subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [ticketId]); // Only recreate subscription when ticketId changes

  // Custom setTicket function that marks updates as local
  const updateTicket = (newTicket: Ticket) => {
    // Set the flag to ignore the websocket event this will trigger
    localUpdateInProgressRef.current = true;
    setTicket(newTicket);
    previousTicketRef.current = newTicket;
    
    // Reset the flag after a short delay (after the DB update likely completes)
    setTimeout(() => {
      localUpdateInProgressRef.current = false;
    }, 1000);
  };

  return { ticket, isLoading, error, setTicket: updateTicket, isSubscribed };
};
