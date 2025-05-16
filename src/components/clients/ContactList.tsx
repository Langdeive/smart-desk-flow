
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { ContactDialog } from './ContactDialog';
import type { ContactFormValues } from '@/lib/validations/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ContactListProps {
  contacts: ContactFormValues[];
  onDelete: (index: number) => void;
  onEdit: (index: number, contact: ContactFormValues) => void;
}

export function ContactList({ contacts, onDelete, onEdit }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive">
          É necessário adicionar pelo menos um contato para o cliente.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {contacts.map((contact, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 border rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {contact.name || 'Sem nome'}
              </span>
              {contact.is_primary && (
                <Badge>Principal</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {contact.email && (
                <div>{contact.email}</div>
              )}
              {contact.phone && (
                <div>{contact.phone}</div>
              )}
            </div>
          </div>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <div onClick={(e) => e.stopPropagation()}>
              <ContactDialog
                contact={contact}
                onSubmit={(updatedContact) => {
                  // Remove the reference to 'e' as it's not defined in this callback scope
                  onEdit(index, updatedContact);
                }}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                onDelete(index);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
