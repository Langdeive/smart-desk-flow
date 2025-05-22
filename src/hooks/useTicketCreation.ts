
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useClientContacts } from '@/hooks/useClientContacts';
import { createTicket, uploadAttachment } from '@/services/ticketService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TicketCategory, TicketPriority } from '@/types';
import { getSLAConfig } from '@/services/ticketService';

interface TicketFormData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  clientId: string;
  contactId: string;
  name: string;
  email: string;
}

export const useTicketCreation = () => {
  const { user, role, companyId } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    role === 'user' ? user?.id : undefined
  );
  
  const [slaInfo, setSlaInfo] = useState<{
    firstResponseHours: Record<TicketPriority, number>;
  } | null>(null);
  
  // Determine if the current user is an agent (admin/agent) or a client
  const isAgent = role === 'admin' || role === 'agent';
  
  const { clients, isLoading: clientsLoading } = useClients();
  const { contacts, isLoading: contactsLoading } = useClientContacts(selectedClientId);
  
  // Load SLA configuration on component mount
  useEffect(() => {
    const loadSLAConfig = async () => {
      if (companyId) {
        try {
          const config = await getSLAConfig(companyId);
          setSlaInfo({
            firstResponseHours: config.firstResponseHours,
          });
        } catch (error) {
          console.error('Error loading SLA config:', error);
        }
      }
    };
    
    loadSLAConfig();
  }, [companyId]);
  
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    return clientId;
  };
  
  const handleContactChange = (contactId: string, contacts: any[]) => {
    const selectedContact = contacts.find(contact => contact.id === contactId);
    return {
      contactId,
      contactName: selectedContact?.name || '',
      contactEmail: selectedContact?.email || '',
    };
  };
  
  const submitTicket = async (data: TicketFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create the ticket
      const ticket = await createTicket({
        title: data.title,
        description: data.description,
        status: "new",
        priority: data.priority,
        category: data.category,
        userId: data.clientId,
        companyId: companyId || "",
        source: "web",
        contactId: data.contactId || undefined
      });
      
      // Upload any attachments
      if (files.length > 0) {
        toast({
          title: "Enviando anexos",
          description: "Aguarde enquanto enviamos seus arquivos...",
        });
        
        await Promise.all(
          files.map(file => uploadAttachment(file, ticket.id))
        );
      }
      
      toast({
        title: `Chamado #${ticket.id.substring(0, 8)} criado com sucesso`,
        description: "IA está analisando seu chamado. Você será redirecionado para os detalhes.",
      });
      
      // Redirect to ticket details
      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      toast({
        title: "Erro ao criar ticket",
        description: "Ocorreu um erro ao enviar seu chamado. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getSLAText = (priority: TicketPriority): string => {
    if (!slaInfo) return "Carregando SLA...";
    
    const hours = slaInfo.firstResponseHours[priority];
    if (hours === 1) {
      return "1ª resposta em até 1 hora";
    } else {
      return `1ª resposta em até ${hours} horas`;
    }
  };
  
  return {
    isAgent,
    user,
    clients,
    contacts,
    clientsLoading,
    contactsLoading,
    selectedClientId,
    files,
    setFiles,
    isSubmitting,
    handleClientChange,
    handleContactChange,
    submitTicket,
    getSLAText,
  };
};
