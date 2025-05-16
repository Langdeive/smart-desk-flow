
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ClientContact } from '@/types';
import { ContactFormValues } from '@/lib/validations/client';

export const useClientContacts = (clientId?: string) => {
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['client-contacts', clientId],
    queryFn: async () => {
      if (!clientId) return [];

      const { data, error } = await supabase
        .from('client_contacts')
        .select('*')
        .filter('client_id', 'eq', clientId)
        .order('is_primary', { ascending: false });

      if (error) {
        console.error('Error fetching client contacts:', error);
        throw error;
      }
      console.log("Fetched contacts for client", clientId, ":", data);
      return data as ClientContact[];
    },
    enabled: !!clientId,
    staleTime: 300000, // Cache for 5 minutes to reduce excessive requests
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  const addContact = useMutation({
    mutationFn: async ({ 
      clientId, 
      contact 
    }: { 
      clientId: string, 
      contact: ContactFormValues 
    }) => {
      // If this contact is marked as primary, we first need to update the other contacts
      if (contact.is_primary) {
        const { error: updateError } = await supabase
          .from('client_contacts')
          .update({ is_primary: false })
          .filter('client_id', 'eq', clientId)
          .filter('is_primary', 'eq', true);

        if (updateError) throw updateError;
      }

      const { data, error } = await supabase
        .from('client_contacts')
        .insert({
          client_id: clientId,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          is_primary: contact.is_primary || false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      console.log("Contact added successfully");
      
      // Instead of invalidating the cache, update it directly with the new contact
      const currentContacts = queryClient.getQueryData<ClientContact[]>(
        ['client-contacts', variables.clientId]
      ) || [];
      
      queryClient.setQueryData(
        ['client-contacts', variables.clientId], 
        [...currentContacts, data]
      );
      
      toast.success('Contato adicionado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar contato', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  });

  const updateContact = useMutation({
    mutationFn: async ({ 
      contactId, 
      contact,
      clientId 
    }: { 
      contactId: string, 
      contact: ContactFormValues,
      clientId: string 
    }) => {
      // If this contact is marked as primary, we first need to update the other contacts
      if (contact.is_primary) {
        const { error: updateError } = await supabase
          .from('client_contacts')
          .update({ is_primary: false })
          .filter('client_id', 'eq', clientId)
          .filter('is_primary', 'eq', true)
          .neq('id', contactId);

        if (updateError) throw updateError;
      }

      const { data, error } = await supabase
        .from('client_contacts')
        .update({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          is_primary: contact.is_primary || false
        })
        .eq('id', contactId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (updatedContact, variables) => {
      console.log("Contact updated successfully");
      
      // Update the cache directly instead of invalidating
      const currentContacts = queryClient.getQueryData<ClientContact[]>(
        ['client-contacts', variables.clientId]
      ) || [];
      
      const updatedContacts = currentContacts.map(contact => 
        contact.id === variables.contactId ? updatedContact : contact
      );
      
      queryClient.setQueryData(
        ['client-contacts', variables.clientId], 
        updatedContacts
      );
      
      toast.success('Contato atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar contato', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  });

  const deleteContact = useMutation({
    mutationFn: async ({ contactId, clientId }: { contactId: string, clientId: string }) => {
      const { error } = await supabase
        .from('client_contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;
      return contactId;
    },
    onSuccess: (deletedContactId, variables) => {
      console.log("Contact deleted successfully");
      
      // Update the cache directly instead of invalidating
      const currentContacts = queryClient.getQueryData<ClientContact[]>(
        ['client-contacts', variables.clientId]
      ) || [];
      
      const updatedContacts = currentContacts.filter(
        contact => contact.id !== deletedContactId
      );
      
      queryClient.setQueryData(
        ['client-contacts', variables.clientId], 
        updatedContacts
      );
      
      toast.success('Contato removido com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao remover contato', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  });

  return {
    contacts,
    isLoading,
    addContact,
    updateContact,
    deleteContact
  };
};
