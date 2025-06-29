import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import TicketHeader from "@/components/ticket/TicketHeader";
import TicketDetailsPanel from "@/components/ticket/TicketDetailsPanel";
import TicketConversation from "@/components/ticket/TicketConversation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Message, Attachment } from "@/types";
import { 
  getTicketById, 
  updateTicketStatus, 
  updateTicketPriority,
  getMessagesForTicket, 
  addMessageToTicket, 
  getAttachmentsForTicket, 
  uploadAttachment
} from "@/services/ticketService";
import { useAuth } from "@/hooks/useAuth";
import { statusLabels, priorityLabels, formatDate, statusColors } from "@/components/ticket/TicketUtils";
import AISuggestedResponses from "@/components/ticket/AISuggestedResponses";
import { useRealtimeTicketUpdates } from "@/hooks/useRealtimeTicketUpdates";
import AIAnalysisPanel from "@/components/ticket/AIAnalysisPanel";
import AttachmentsPanel from "@/components/ticket/AttachmentsPanel";
import AgentAssignmentPanel from "@/components/ticket/AgentAssignmentPanel";
import SLAInfoPanel from "@/components/ticket/SLAInfoPanel";

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the onUpdate callback to prevent it from causing re-renders
  const handleTicketUpdate = useCallback((updatedTicket: Ticket) => {
    console.log('Ticket updated via realtime:', updatedTicket);
    // No state updates here - the hook will handle the ticket state
  }, []);

  // Use the optimized hook with the memoized callback
  const { 
    ticket, 
    isLoading: ticketLoading, 
    error: ticketError, 
    setTicket,
    isSubscribed 
  } = useRealtimeTicketUpdates({
    ticketId: id || '',
    onUpdate: handleTicketUpdate
  });

  // Load messages and attachments only when needed
  useEffect(() => {
    const fetchTicketData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const [messagesData, attachmentsData] = await Promise.all([
          getMessagesForTicket(id),
          getAttachmentsForTicket(id)
        ]);
        
        setMessages(messagesData);
        setAttachments(attachmentsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching ticket data:", err);
        setError("Não foi possível carregar os dados do ticket.");
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os dados do ticket.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [id, toast]);

  const handleStatusChange = async (status: string) => {
    if (!id || !ticket) return;
    
    try {
      const success = await updateTicketStatus(id, status as any);
      if (success) {
        // Ticket será atualizado via realtime subscription
        toast({
          title: "Status atualizado",
          description: `O status do ticket foi alterado para ${statusLabels[status as any]}.`,
        });
      } else {
        throw new Error('Falha ao atualizar status');
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do ticket.",
        variant: "destructive",
      });
    }
  };

  const handlePriorityChange = async (priority: string) => {
    if (!id || !ticket) return;
    
    try {
      const success = await updateTicketPriority(id, priority as any);
      if (success) {
        // Ticket será atualizado via realtime subscription
        toast({
          title: "Prioridade atualizada",
          description: `A prioridade do ticket foi alterada para ${priorityLabels[priority as any]}.`,
        });
      } else {
        throw new Error('Falha ao atualizar prioridade');
      }
    } catch (err) {
      console.error("Error updating priority:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a prioridade do ticket.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (content: string, files: File[]) => {
    if (!id || !ticket || !user) return;
    
    try {
      // Adicionar mensagem
      const newMessage = await addMessageToTicket({
        ticketId: id,
        content,
        userId: user.id,
        isFromClient: false,
        isAutomatic: false,
      });
      
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // Fazer upload dos anexos (se houver)
      if (files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const attachment = await uploadAttachment(file, id, newMessage.id);
          return attachment;
        });
        
        const newAttachments = await Promise.all(uploadPromises);
        setAttachments((prevAttachments) => [...prevAttachments, ...newAttachments]);
      }
      
      toast({
        title: "Mensagem enviada",
        description: "Sua resposta foi enviada com sucesso.",
      });
    } catch (err) {
      console.error("Error sending message:", err);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua resposta.",
        variant: "destructive",
      });
    }
  };

  const handleApplySuggestion = async (message: string) => {
    return handleSendMessage(message, []);
  };

  // Render the content without AppLayout, which will be handled by the router
  const renderContent = () => {
    if (loading || ticketLoading) {
      return <div>Carregando...</div>;
    }

    if (error || ticketError || !ticket) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Ticket não encontrado"}
          </h2>
          <Button onClick={() => navigate("/tickets")}>Voltar para a lista de tickets</Button>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-6">
        <TicketHeader 
          ticket={ticket} 
          statusColors={statusColors} 
          statusLabels={statusLabels} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            {ticket.aiProcessed && (
              <AISuggestedResponses 
                ticketId={ticket.id} 
                agentId={user?.id || ''} 
                onApply={handleApplySuggestion}
              />
            )}
            
            <TicketConversation
              ticket={ticket}
              messages={messages}
              attachments={attachments}
              onSendMessage={handleSendMessage}
            />
          </div>
          
          <div className="space-y-6">
            <TicketDetailsPanel
              ticket={ticket}
              statusLabels={statusLabels}
              priorityLabels={priorityLabels}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              formatDate={formatDate}
            />
            
            {/* Add the new AgentAssignmentPanel component */}
            {user && (
              <AgentAssignmentPanel
                ticketId={ticket.id}
                currentAgentId={ticket.agentId}
                companyId={ticket.companyId}
              />
            )}
            
            {/* Add the SLA info panel */}
            {(ticket.firstResponseDeadline || ticket.resolutionDeadline) && (
              <SLAInfoPanel 
                ticket={ticket}
                formatDate={formatDate}
              />
            )}
            
            {ticket.aiProcessed && (
              <AIAnalysisPanel 
                ticket={ticket}
                aiClassification={ticket.aiClassification}
                suggestedPriority={ticket.suggestedPriority}
                needsAdditionalInfo={ticket.needsAdditionalInfo}
                confidenceScore={ticket.confidenceScore}
              />
            )}
            
            <AttachmentsPanel attachments={attachments} />
          </div>
        </div>
      </div>
    );
  };

  // Return only the content, as the AppLayout will be provided by the router
  return renderContent();
};

export default TicketDetail;
