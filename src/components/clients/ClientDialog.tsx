
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { clientSchema, type ClientFormValues } from '@/lib/validations/client';
import { useClientContacts } from '@/hooks/useClientContacts';
import { Client, ClientFormData } from '@/types';
import { toast } from 'sonner';
import { ClientFormFields } from './ClientFormFields';
import { ClientContactsSection } from './ClientContactsSection';

interface ClientDialogProps {
  clientId?: string | null;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  clients: Client[];
  onSave: (data: ClientFormData, id?: string) => Promise<void>;
  isPending?: boolean;
}

export function ClientDialog({ 
  clientId, 
  onClose, 
  open, 
  onOpenChange, 
  clients,
  onSave,
  isPending = false
}: ClientDialogProps) {
  const { contacts: existingContacts, isLoading: contactsLoading } = useClientContacts(clientId || undefined);
  const client = clients.find(c => c.id === clientId) as Client | undefined;

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      external_id: '',
      notes: '',
      is_active: true,
      contacts: []
    }
  });

  useEffect(() => {
    // Reset form when opening the dialog
    if (open) {
      if (client) {
        form.reset({
          name: client.name,
          external_id: client.external_id || '',
          notes: client.notes || '',
          is_active: client.is_active !== false, // Default to true if undefined
          contacts: []
        });
      } else {
        // Reset form when opening for a new client
        form.reset({
          name: '',
          external_id: '',
          notes: '',
          is_active: true,
          contacts: []
        });
      }
    }
  }, [client, form, open]);

  const onSubmit = async (data: ClientFormValues) => {
    // Check if there are contacts
    if (!data.contacts || data.contacts.length === 0) {
      toast.error("É necessário adicionar pelo menos um contato");
      return;
    }
    
    // Ensure data has a non-optional name property as required by ClientFormData
    const clientData: ClientFormData = {
      name: data.name, // This is required by the schema
      external_id: data.external_id,
      notes: data.notes,
      is_active: data.is_active,
      contacts: data.contacts || []
    };

    try {
      await onSave(clientData, clientId || undefined);
      onClose?.();
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Erro ao salvar cliente. Tente novamente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {clientId ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic client information fields */}
            <ClientFormFields 
              form={form} 
              isEditing={!!clientId} 
            />

            {/* Contacts section */}
            <ClientContactsSection 
              form={form} 
              existingContacts={existingContacts} 
              isLoading={contactsLoading}
              clientId={clientId}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
              >
                {isPending ? 'Salvando...' : clientId ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
