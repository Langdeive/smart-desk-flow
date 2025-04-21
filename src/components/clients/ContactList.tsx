
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { ContactDialog } from './ContactDialog';
import type { ContactFormValues } from '@/lib/validations/client';

interface ContactListProps {
  contacts: ContactFormValues[];
  onDelete: (index: number) => void;
  onEdit: (index: number, contact: ContactFormValues) => void;
}

export function ContactList({ contacts, onDelete, onEdit }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Nenhum contato adicionado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {contacts.map((contact, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 border rounded-lg"
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
          <div className="flex gap-2">
            <ContactDialog
              contact={contact}
              onSubmit={(updatedContact) => onEdit(index, updatedContact)}
            />
            <Button
              variant="outline"
              size="icon"
              className="text-destructive"
              onClick={() => onDelete(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
