
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Client, ClientFormData } from '@/types';

export const useClients = (search?: string) => {
  const queryClient = useQueryClient();
  const { companyId } = useAuth();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients', search, companyId],
    queryFn: async () => {
      if (!companyId) return [];

      let query = supabase
        .from('clients')
        .select('*')
        .order('name');
      
      // Apply company_id filter directly without using `.eq` to avoid potential RLS issues
      if (companyId) {
        query = query.filter('company_id', 'eq', companyId);
      }

      // Apply search filter if provided
      if (search) {
        query = query.or(`name.ilike.%${search}%,external_id.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      
      return data as Client[];
    },
    enabled: !!companyId
  });

  const createClient = useMutation({
    mutationFn: async (data: ClientFormData) => {
      if (!companyId) throw new Error('Company ID is required');

      const { data: client, error } = await supabase
        .from('clients')
        .insert({
          name: data.name,
          external_id: data.external_id,
          notes: data.notes,
          company_id: companyId
        })
        .select()
        .single();

      if (error) throw error;

      if (data.contacts && data.contacts.length > 0) {
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
      // Update client basic info
      const { error } = await supabase
        .from('clients')
        .update({
          name: data.name,
          external_id: data.external_id,
          notes: data.notes,
          is_active: data.is_active
        })
        .eq('id', id);

      if (error) throw error;

      // Handle contacts - first delete all existing contacts
      if (data.contacts && data.contacts.length > 0) {
        const { error: deleteError } = await supabase
          .from('client_contacts')
          .delete()
          .eq('client_id', id);
          
        if (deleteError) throw deleteError;
        
        // Then insert the new/updated contacts
        const { error: contactsError } = await supabase
          .from('client_contacts')
          .insert(
            data.contacts.map((contact, index) => ({
              ...contact,
              client_id: id,
              is_primary: index === 0 || contact.is_primary
            }))
          );
          
        if (contactsError) throw contactsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-contacts'] });
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

  // Add the deleteClient mutation
  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      // First delete all contacts associated with this client
      const { error: contactsError } = await supabase
        .from('client_contacts')
        .delete()
        .eq('client_id', id);
      
      if (contactsError) throw contactsError;

      // Then delete the client
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente excluído com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao excluir cliente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  });

  return {
    clients,
    isLoading,
    createClient,
    updateClient,
    toggleClientActive,
    deleteClient
  };
};
