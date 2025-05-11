
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ContactList } from './ContactList';
import { clientSchema, type ClientFormValues } from '@/lib/validations/client';
import { useClients } from '@/hooks/useClients';
import { ContactDialog } from './ContactDialog';
import { useClientContacts } from '@/hooks/useClientContacts';
import { Client, ClientFormData } from '@/types';

interface ClientDialogProps {
  clientId?: string | null;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ClientDialog({ clientId, onClose, open, onOpenChange }: ClientDialogProps) {
  const { clients, createClient, updateClient } = useClients();
  const { contacts: existingContacts, isLoading: contactsLoading } = useClientContacts(clientId || undefined);
  const client = clients?.find(c => c.id === clientId) as Client | undefined;

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
  }, [client, form, open]);

  useEffect(() => {
    if (existingContacts && existingContacts.length > 0 && clientId) {
      const mappedContacts = existingContacts.map(contact => ({
        name: contact.name || undefined,
        email: contact.email || undefined,
        phone: contact.phone || undefined,
        is_primary: contact.is_primary
      }));
      form.setValue('contacts', mappedContacts);
    } else {
      form.setValue('contacts', []);
    }
  }, [existingContacts, clientId, form]);

  const onSubmit = async (data: ClientFormValues) => {
    // Ensure data has a non-optional name property as required by ClientFormData
    const clientData: ClientFormData = {
      name: data.name, // This is required by the schema
      external_id: data.external_id,
      notes: data.notes,
      is_active: data.is_active,
      contacts: data.contacts || []
    };

    if (clientId) {
      await updateClient.mutateAsync({ 
        id: clientId, 
        ...clientData
      });
    } else {
      await createClient.mutateAsync(clientData);
    }
    onClose?.();
  };

  const isPending = createClient.isPending || updateClient.isPending;

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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="external_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Externo</FormLabel>
                  <FormControl>
                    <Input placeholder="ID do sistema externo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observações sobre o cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {clientId && (
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Cliente ativo
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Contatos</h3>
                <ContactDialog
                  onSubmit={(contact) => {
                    const contacts = form.getValues('contacts');
                    form.setValue('contacts', [...contacts, contact]);
                  }}
                />
              </div>
              <ContactList
                contacts={form.watch('contacts')}
                onDelete={(index) => {
                  const contacts = form.getValues('contacts');
                  contacts.splice(index, 1);
                  form.setValue('contacts', contacts);
                }}
                onEdit={(index, contact) => {
                  const contacts = form.getValues('contacts');
                  contacts[index] = contact;
                  form.setValue('contacts', contacts);
                }}
              />
            </div>

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
