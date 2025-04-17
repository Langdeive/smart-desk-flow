
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientFormData } from '@/types';
import { toast } from 'sonner';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .returns<Client[]>();
      
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      toast.error('Erro ao carregar clientes', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: ClientFormData) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert({ ...clientData, empresa_id: '', status: 'ativo' })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Cliente adicionado com sucesso');
      await fetchClients();
      return data;
    } catch (error) {
      toast.error('Erro ao adicionar cliente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  };

  const updateClient = async (id: string, clientData: Partial<ClientFormData>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Cliente atualizado com sucesso');
      await fetchClients();
      return data;
    } catch (error) {
      toast.error('Erro ao atualizar cliente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  };

  const deleteClient = async (id: string) => {
    try {
      // First, check if the client has active tickets
      const { count, error: ticketError } = await supabase
        .from('tickets')
        .select('id', { count: 'exact' })
        .eq('user_id', id)
        .eq('status', 'new');

      if (ticketError) throw ticketError;

      if (count && count > 0) {
        toast.error('Não é possível excluir cliente com tickets ativos');
        return false;
      }

      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Cliente excluído com sucesso');
      await fetchClients();
      return true;
    } catch (error) {
      toast.error('Erro ao excluir cliente', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      return false;
    }
  };

  return { 
    clients, 
    loading, 
    fetchClients, 
    addClient, 
    updateClient, 
    deleteClient 
  };
};
