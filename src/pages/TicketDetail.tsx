import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Message, Attachment, TicketStatus, TicketPriority } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getTicketById, updateTicketStatus, updateTicketPriority, getMessagesForTicket, getAttachmentsForTicket, addMessageToTicket, uploadAttachment } from "@/services/ticketService";
import { addManualHistoryEntry } from "@/services/historyService";

import TicketHeader from "@/components/ticket/TicketHeader";
import TicketConversation from "@/components/ticket/TicketConversation";
import TicketDetailsPanel from "@/components/ticket/TicketDetailsPanel";
import AttachmentsPanel from "@/components/ticket/AttachmentsPanel";
import AIAnalysisPanel from "@/components/ticket/AIAnalysisPanel";
import { statusColors, statusLabels, priorityLabels, formatDate } from "@/components/ticket/TicketUtils";

const TicketDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTicketData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const ticketData = await getTicketById(id);
        setTicket(ticketData);
        
        const messagesData = await getMessagesForTicket(id);
        setMessages(messagesData);
        
        const attachmentsData = await getAttachmentsForTicket(id);
        setAttachments(attachmentsData);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
        toast({
          title: "Erro ao carregar ticket",
          description: "Não foi possível carregar os dados do ticket. Por favor, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTicketData();
  }, [id, toast]);

  const handleStatusChange = async (status: string) => {
    if (!ticket || !id) return;
    
    try {
      const oldStatus = ticket.status;
      
      const updatedTicket = await updateTicketStatus(id, status as TicketStatus);
      setTicket(updatedTicket);
      
      await addManualHistoryEntry(
        id,
        'status_alterado',
        oldStatus,
        status
      );
      
      toast({
        title: "Status atualizado",
        description: `O status foi alterado para ${statusLabels[status as TicketStatus]}.`,
      });
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do ticket. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handlePriorityChange = async (priority: string) => {
    if (!ticket || !id) return;
    
    try {
      const oldPriority = ticket.priority;
      
      const updatedTicket = await updateTicketPriority(id, priority as TicketPriority);
      setTicket(updatedTicket);
      
      await addManualHistoryEntry(
        id,
        'prioridade_alterada',
        oldPriority,
        priority
      );
      
      toast({
        title: "Prioridade atualizada",
        description: `A prioridade foi alterada para ${priorityLabels[priority as TicketPriority]}.`,
      });
    } catch (error) {
      console.error("Error updating ticket priority:", error);
      toast({
        title: "Erro ao atualizar prioridade",
        description: "Não foi possível atualizar a prioridade do ticket. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (content: string, files: File[]) => {
    if (!ticket || !id) return;
    
    setIsSubmitting(true);
    try {
      const newMessage = await addMessageToTicket({
        content,
        ticketId: id,
        userId: "agent1",
        isFromClient: false,
        isAutomatic: false
      });
      
      const newAttachments: Attachment[] = [];
      
      for (const file of files) {
        const attachment = await uploadAttachment(file, id, newMessage.id);
        newAttachments.push(attachment);
      }
      
      setMessages(prev => [...prev, newMessage]);
      setAttachments(prev => [...prev, ...newAttachments]);
      
      toast({
        title: "Mensagem enviada",
        description: "Sua resposta foi enviada com sucesso.",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar sua resposta. Por favor, tente novamente.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReanalyzeWithAI = () => {
    toast({
      title: "Reanálise iniciada",
      description: "O ticket está sendo reanalisado pela IA.",
    });
    
    setTimeout(() => {
      toast({
        title: "Reanálise concluída",
        description: "O ticket foi reanalisado com sucesso.",
      });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="h-8 w-32 mb-4">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="h-16 w-full">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[150px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Ticket não encontrado</h2>
          <p className="text-muted-foreground mt-2">
            O ticket solicitado não foi encontrado ou você não tem permissão para acessá-lo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <TicketHeader 
        ticket={ticket} 
        statusColors={statusColors} 
        statusLabels={statusLabels} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
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
          
          <AttachmentsPanel attachments={attachments} />
          
          <AIAnalysisPanel 
            ticket={ticket} 
            onReanalyze={handleReanalyzeWithAI} 
          />
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
