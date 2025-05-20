
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/types';
import { toast } from 'sonner';

export const useRealtimeTicketUpdates = (
  ticketId?: string, 
  onUpdate?: (ticket: Ticket) => void
) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  useEffect(() => {
    if (!ticketId) return;
    
    // Inscreve-se no canal para atualizações de tickets específicos
    const channel = supabase
      .channel(`ticket-updates-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tickets',
          filter: `id=eq.${ticketId}`
        },
        (payload) => {
          // Converte o payload para o formato do ticket
          const updatedTicket = {
            ...payload.new,
            id: payload.new.id,
            title: payload.new.title,
            description: payload.new.description,
            status: payload.new.status,
            priority: payload.new.priority,
            category: payload.new.category,
            userId: payload.new.user_id,
            agentId: payload.new.agent_id,
            companyId: payload.new.company_id,
            createdAt: new Date(payload.new.created_at),
            updatedAt: new Date(payload.new.updated_at),
            source: payload.new.source,
            aiProcessed: payload.new.ai_processed,
            needsHumanReview: payload.new.needs_human_review,
            contactId: payload.new.contact_id,
            // Novos campos de IA
            aiClassification: payload.new.ai_classification,
            suggestedPriority: payload.new.suggested_priority,
            needsAdditionalInfo: payload.new.needs_additional_info,
            confidenceScore: payload.new.confidence_score
          } as Ticket;
          
          // Notifica mudanças importantes
          const oldStatus = payload.old?.status;
          const newStatus = payload.new?.status;
          
          if (oldStatus && newStatus && oldStatus !== newStatus) {
            toast.info(`Status do ticket atualizado`, {
              description: `De: ${oldStatus} → Para: ${newStatus}`
            });
          }
          
          if (payload.new?.ai_processed && !payload.old?.ai_processed) {
            toast.success('Ticket processado pela IA', {
              description: 'A análise automática foi concluída'
            });
          }
          
          // Chama o callback com o ticket atualizado
          if (onUpdate) {
            onUpdate(updatedTicket);
          }
        }
      )
      .subscribe(() => {
        setIsSubscribed(true);
        console.log(`Inscrito nas atualizações do ticket ${ticketId}`);
      });
    
    // Limpeza ao desmontar o componente
    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
      console.log(`Cancelada inscrição nas atualizações do ticket ${ticketId}`);
    };
  }, [ticketId, onUpdate]);
  
  return { isSubscribed };
};
