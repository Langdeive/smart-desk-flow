
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
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
import { Plus } from 'lucide-react';
import { ContactList } from './ContactList';
import { clientSchema, type ClientFormValues } from '@/lib/validations/client';
import { useClients } from '@/hooks/useClients';
import { ContactDialog } from './ContactDialog';

interface ClientDialogProps {
  clientId?: string | null;
  onClose?: () => void;
}

export function ClientDialog({ clientId, onClose }: ClientDialogProps) {
  const { clients, createClient, updateClient } = useClients();
  const client = clients?.find(c => c.id === clientId);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      external_id: '',
      notes: '',
      contacts: []
    }
  });

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        external_id: client.external_id || '',
        notes: client.notes || ''
      });
    }
  }, [client, form]);

  const onSubmit = async (data: ClientFormValues) => {
    if (clientId) {
      await updateClient.mutateAsync({ id: clientId, ...data });
    } else {
      await createClient.mutateAsync(data);
    }
    onClose?.();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {clientId ? 'Editar Cliente' : 'Novo Cliente'}
        </Button>
      </DialogTrigger>
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
              <Button type="submit" disabled={createClient.isPending || updateClient.isPending}>
                {clientId ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
