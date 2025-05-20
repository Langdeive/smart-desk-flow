import React, { useState, useEffect } from "react";
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

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usar o hook de atualizações em tempo real
  const { isSubscribed } = useRealtimeTicketUpdates(id, (updatedTicket) => {
    setTicket(prevTicket => {
      if (!prevTicket) return updatedTicket;
      return { ...prevTicket, ...updatedTicket };
    });
  });

  useEffect(() => {
    const fetchTicketData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const [ticketData, messagesData, attachmentsData] = await Promise.all([
          getTicketById(id),
          getMessagesForTicket(id),
          getAttachmentsForTicket(id)
        ]);
        
        setTicket(ticketData);
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
      const updatedTicket = await updateTicketStatus(id, status as any);
      setTicket(updatedTicket);
      toast({
        title: "Status atualizado",
        description: `O status do ticket foi alterado para ${statusLabels[status as any]}.`,
      });
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
      const updatedTicket = await updateTicketPriority(id, priority as any);
      setTicket(updatedTicket);
      toast({
        title: "Prioridade atualizada",
        description: `A prioridade do ticket foi alterada para ${priorityLabels[priority as any]}.`,
      });
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

  if (loading) {
    return <AppLayout>Carregando...</AppLayout>;
  }

  if (error || !ticket) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Ticket não encontrado"}
          </h2>
          <Button onClick={() => navigate("/tickets")}>Voltar para a lista de tickets</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
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
    </AppLayout>
  );
};

export default TicketDetail;
