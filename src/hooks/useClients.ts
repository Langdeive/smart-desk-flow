
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Client, ClientFormData } from '@/types';
import { useAuth } from '@/hooks/useAuth'; // Assuming this hook exists for getting company_id

export const useClients = (search?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Assuming this hook provides user data with company_id
  const companyId = user?.companyId;

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients', search],
    queryFn: async () => {
      const query = supabase
        .from('clients')
        .select('*')
        .order('name');

      if (search) {
        query.or(`name.ilike.%${search}%,external_id.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Client[];
    }
  });

  const createClient = useMutation({
    mutationFn: async (data: ClientFormData) => {
      // First create the client
      const { data: client, error } = await supabase
        .from('clients')
        .insert({
          name: data.name,
          external_id: data.external_id,
          notes: data.notes,
          company_id: companyId // Use the company_id from auth context
        })
        .select()
        .single();

      if (error) throw error;

      if (data.contacts.length > 0) {
        const { error: contactsError } = await supabase
          .from('client_contacts')
          .insert(
            data.contacts.map((contact, index) => ({
              ...contact,
              client_id: client.id,
              is_primary: index === 0 || contact.is_primary
            }))
          );

        if (contactsError) throw contactsError;
      }

      return client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente criado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao criar cliente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  });

  const updateClient = useMutation({
    mutationFn: async ({ id, ...data }: ClientFormData & { id: string }) => {
      const { error } = await supabase
        .from('clients')
        .update({
          name: data.name,
          external_id: data.external_id,
          notes: data.notes
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar cliente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  });

  const toggleClientActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('clients')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, { is_active }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(
        is_active ? 'Cliente ativado com sucesso' : 'Cliente desativado com sucesso'
      );
    },
    onError: (error) => {
      toast.error('Erro ao alterar status do cliente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  });

  return {
    clients,
    isLoading,
    createClient,
    updateClient,
    toggleClientActive
  };
};
