
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ContactDialog } from './ContactDialog';
import { ContactList } from './ContactList';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ClientFormValues, ContactFormValues } from '@/lib/validations/client';
import { ClientContact } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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
  const [contacts, setContacts] = useState<ClientFormValues['contacts']>([]);

  useEffect(() => {
    // Load existing contacts when editing a client
    if (existingContacts && existingContacts.length > 0 && clientId) {
      console.log("Loading existing contacts:", existingContacts);
      
      // Only update contacts if the local state is empty (no manually added contacts yet)
      // This prevents overwriting contacts that might have been added manually
      if (contacts.length === 0) {
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
      } else {
        console.log("Not overwriting local contacts as they already exist:", contacts);
      }
    }
  }, [existingContacts, clientId, form, contacts.length]);

  const handleAddContact = (contact: ContactFormValues) => {
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

  const handleEditContact = (index: number, updatedContact: ContactFormValues) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = updatedContact;
    setContacts(updatedContacts);
    form.setValue('contacts', updatedContacts);
    form.trigger('contacts');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Contatos</h3>
        <ContactDialog onSubmit={handleAddContact} />
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
  );
}
