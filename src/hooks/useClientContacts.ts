
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ClientContact, ContactInput } from '@/types';

export const useClientContacts = (clientId?: string) => {
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['client-contacts', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', clientId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ClientContact[];
    },
    enabled: !!clientId
  });

  const createContact = useMutation({
    mutationFn: async ({ clientId, ...data }: ContactInput & { clientId: string }) => {
      const { error } = await supabase
        .from('client_contacts')
        .insert({ ...data, client_id: clientId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-contacts'] });
      toast.success('Contato adicionado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar contato', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  });

  const updateContact = useMutation({
    mutationFn: async ({ id, ...data }: ContactInput & { id: string }) => {
      const { error } = await supabase
        .from('client_contacts')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-contacts'] });
      toast.success('Contato atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar contato', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-contacts'] });
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
    createContact,
    updateContact,
    deleteContact
  };
};
