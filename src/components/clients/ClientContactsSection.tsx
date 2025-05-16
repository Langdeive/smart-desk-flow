
import { useState, useEffect } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { ContactDialog } from './ContactDialog';
import { ContactList } from './ContactList';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ClientFormValues, ContactFormValues } from '@/lib/validations/client';
import { ClientContact } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientContactsSectionProps {
  form: UseFormReturn<ClientFormValues>;
  existingContacts: ClientContact[] | undefined;
  isLoading: boolean;
  clientId?: string | null;
}

export function ClientContactsSection({ 
  form, 
  existingContacts, 
  isLoading,
  clientId 
}: ClientContactsSectionProps) {
  // Use useFieldArray to manage contacts
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const [hasInitializedContacts, setHasInitializedContacts] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    // Load existing contacts when editing a client, but only once
    if (existingContacts && existingContacts.length > 0 && clientId && !hasInitializedContacts) {
      console.log("Loading existing contacts:", existingContacts);
      
      // Clear any existing fields first to avoid duplication
      fields.forEach((_, index) => remove(index));

      // Map and append contacts
      existingContacts.forEach(contact => {
        append({
          name: contact.name || undefined,
          email: contact.email || undefined,
          phone: contact.phone || undefined,
          is_primary: contact.is_primary
        });
      });
      
      // Mark as initialized to prevent reloading
      setHasInitializedContacts(true);
    }
  }, [existingContacts, clientId, append, remove, fields, hasInitializedContacts]);

  const handleAddContact = (contact: ContactFormValues) => {
    console.log("Adding contact to ClientDialog:", contact);
    
    // If this contact is marked as primary, update other contacts to not be primary
    if (contact.is_primary) {
      fields.forEach((_, index) => {
        update(index, { ...form.getValues(`contacts.${index}`), is_primary: false });
      });
    }
    
    // Add new contact
    append(contact);
    
    // Validate the contacts field after update
    form.trigger('contacts');
  };

  const handleDeleteContact = (index: number) => {
    remove(index);
    form.trigger('contacts');
  };

  const handleEditContact = (index: number, updatedContact: ContactFormValues) => {
    // If this contact is marked as primary, update other contacts to not be primary
    if (updatedContact.is_primary) {
      fields.forEach((_, fieldIndex) => {
        if (fieldIndex !== index) {
          update(fieldIndex, { ...form.getValues(`contacts.${fieldIndex}`), is_primary: false });
        }
      });
    }
    
    // Update the contact
    update(index, updatedContact);
    form.trigger('contacts');
  };

  const handleStopPropagation = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="space-y-4" onClick={handleStopPropagation}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Contatos</h3>
        <div onClick={handleStopPropagation}>
          <Button 
            variant="outline" 
            onClick={(e) => {
              handleStopPropagation(e);
              setContactDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        </div>
      </div>
      <FormField
        control={form.control}
        name="contacts"
        render={() => (
          <FormItem>
            <ContactList
              contacts={fields as ContactFormValues[]}
              onDelete={handleDeleteContact}
              onEdit={handleEditContact}
              setContactDialogOpen={setContactDialogOpen}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Renderizar ContactDialog apenas uma vez, controlado por estado */}
      <ContactDialog 
        onSubmit={handleAddContact}
        openDialog={contactDialogOpen}
        setOpenDialog={setContactDialogOpen}
      />
    </div>
  );
}
