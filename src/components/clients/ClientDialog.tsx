
import { useEffect, useState } from 'react';
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
import { ContactDialog } from './ContactDialog';
import { useClientContacts } from '@/hooks/useClientContacts';
import { Client, ClientFormData } from '@/types';
import { toast } from 'sonner';

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
  const [contacts, setContacts] = useState<ClientFormValues['contacts']>([]);

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
      // Reset the contacts state when the dialog opens
      if (!clientId) {
        setContacts([]);
        form.setValue('contacts', []);
      }
    }
  }, [client, form, open, clientId]);

  useEffect(() => {
    // Load existing contacts when editing a client
    if (existingContacts && existingContacts.length > 0 && clientId) {
      const mappedContacts = existingContacts.map(contact => ({
        name: contact.name || undefined,
        email: contact.email || undefined,
        phone: contact.phone || undefined,
        is_primary: contact.is_primary
      }));
      setContacts(mappedContacts);
      form.setValue('contacts', mappedContacts);
      // Trigger validation after setting contacts
      form.trigger('contacts');
    }
  }, [existingContacts, clientId, form]);

  const handleAddContact = (contact: ClientFormValues['contacts'][0]) => {
    console.log("Adding contact to ClientDialog:", contact);
    
    // Ensure we're working with a new array instance to trigger re-render
    const updatedContacts = [...contacts, contact];
    setContacts(updatedContacts);
    
    // Update the form value to ensure validation works correctly
    form.setValue('contacts', updatedContacts);
    
    // Trigger form validation to refresh error messages
    form.trigger('contacts');
  };

  const handleDeleteContact = (index: number) => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts);
    form.setValue('contacts', updatedContacts);
    form.trigger('contacts');
  };

  const handleEditContact = (index: number, updatedContact: ClientFormValues['contacts'][0]) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = updatedContact;
    setContacts(updatedContacts);
    form.setValue('contacts', updatedContacts);
    form.trigger('contacts');
  };

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

            {/* Contacts section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Contatos</h3>
                <ContactDialog
                  onSubmit={handleAddContact}
                />
              </div>
              <FormField
                control={form.control}
                name="contacts"
                render={() => (
                  <FormItem>
                    <ContactList
                      contacts={contacts}
                      onDelete={handleDeleteContact}
                      onEdit={handleEditContact}
                    />
                    <FormMessage />
                  </FormItem>
                )}
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
