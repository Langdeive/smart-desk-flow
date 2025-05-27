import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useClientContacts } from '@/hooks/useClientContacts';
import { createTicket, uploadAttachment } from '@/services/ticketService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TicketCategory, TicketPriority } from '@/types';
import { getSLAConfig } from '@/services/ticketService';

export interface TicketFormData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  clientId: string;
  contactId?: string;
  name: string;
  email: string;
  agentId?: string;
  tags?: string;
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
  
  // Determine if the current user is an agent (admin/agent/owner/developer) or a client
  const isAgent = role === 'admin' || role === 'agent' || role === 'owner' || role === 'developer';
  
  // DEBUG: Log authentication and role information
  console.log("DEBUG TicketCreation - User:", user?.email);
  console.log("DEBUG TicketCreation - Role from useAuth:", role);
  console.log("DEBUG TicketCreation - isAgent determined as:", isAgent);
  console.log("DEBUG TicketCreation - User app_metadata:", user?.app_metadata);
  
  const { clients, isLoading: clientsLoading } = useClients();
  const { 
    contacts, 
    isLoading: contactsLoading, 
    addContact 
  } = useClientContacts(selectedClientId);
  
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
  
  const handleCreateContact = async ({ name, email, clientId }: { name: string; email: string; clientId: string }) => {
    if (!clientId || !name || !email) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos para criar um contato.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newContact = await addContact.mutateAsync({
        clientId,
        contact: {
          name,
          email,
          is_primary: false
        }
      });
      
      toast({
        title: "Contato criado",
        description: `Contato ${name} foi criado com sucesso.`,
      });
      
      return newContact;
    } catch (error) {
      console.error("Erro ao criar contato:", error);
      toast({
        title: "Erro ao criar contato",
        description: "Ocorreu um erro ao criar o contato. Por favor, tente novamente.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const submitTicket = async (formData: Partial<TicketFormData>) => {
    if (!formData.title || !formData.description || !formData.category || 
        !formData.priority || !formData.clientId) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the ticket with required fields
      const ticket = await createTicket({
        title: formData.title,
        description: formData.description,
        status: "new",
        priority: formData.priority,
        category: formData.category,
        userId: formData.clientId,
        companyId: companyId || "",
        source: "web",
        contactId: formData.contactId
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
    handleCreateContact,
    submitTicket,
    getSLAText,
  };
};
