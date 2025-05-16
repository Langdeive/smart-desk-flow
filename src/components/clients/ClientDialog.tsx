import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { clientSchema, type ClientFormValues } from '@/lib/validations/client';
import { useClientContacts } from '@/hooks/useClientContacts';
import { Client, ClientFormData } from '@/types';
import { toast } from 'sonner';
import { ClientFormFields } from './ClientFormFields';
import { ClientContactsSection } from './ClientContactsSection';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

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

  // Reset form when opening the dialog or when client changes
  useEffect(() => {
    if (open) {
      console.log("Dialog opened, resetting form", client ? "with client data" : "for new client");
      
      // Reset the form with client data or default values
      form.reset({
        name: client?.name || '',
        external_id: client?.external_id || '',
        notes: client?.notes || '',
        is_active: client?.is_active !== false, // Default to true if undefined
        contacts: [] // Contacts will be set by ClientContactsSection from existingContacts
      });
    }
  }, [client, form, open, clientId]);

  const onSubmit = async (data: ClientFormValues) => {
    console.log("Form submitted with data:", data);
    
    // Check if there are contacts
    if (!data.contacts || data.contacts.length === 0) {
      toast.error("É necessário adicionar pelo menos um contato");
      return;
    }
    
    try {
      // Ensure data has a non-optional name property as required by ClientFormData
      const clientData: ClientFormData = {
        name: data.name, // This is required by the schema
        external_id: data.external_id,
        notes: data.notes,
        is_active: data.is_active,
        contacts: data.contacts.map(contact => ({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          is_primary: contact.is_primary || false
        }))
      };

      await onSave(clientData, clientId || undefined);
      
      // Only close the dialog after successful save
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Erro ao salvar cliente. Tente novamente.");
    }
  };

  // This prevents the dialog from closing when interacting with child components
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Using Sheet instead of Dialog for Contact Creation/Editing would be a better UX
  // But for now, let's keep with improved Dialog behavior

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" onClick={handleDialogClick}>
        <DialogHeader>
          <DialogTitle>
            {clientId ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" onClick={handleDialogClick}>
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation(); 
                  onClose?.();
                }}
              >
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
