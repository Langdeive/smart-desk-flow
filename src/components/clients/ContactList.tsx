
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { ContactDialog } from './ContactDialog';
import type { ContactFormValues } from '@/lib/validations/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ContactListProps {
  contacts: ContactFormValues[];
  onDelete: (index: number) => void;
  onEdit: (index: number, contact: ContactFormValues) => void;
  setContactDialogOpen?: (open: boolean) => void;
  isProcessingContact?: boolean;
}

export function ContactList({ 
  contacts, 
  onDelete, 
  onEdit, 
  setContactDialogOpen,
  isProcessingContact = false
}: ContactListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
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

  const handleStopPropagation = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleEditClick = (index: number, e: React.MouseEvent) => {
    handleStopPropagation(e);
    setEditingIndex(index);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-2">
      {contacts.map((contact, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 border rounded-lg"
          onClick={handleStopPropagation}
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
          <div className="flex gap-2" onClick={handleStopPropagation}>
            <Button
              variant="outline"
              type="button"
              onClick={(e) => handleEditClick(index, e)}
              disabled={isProcessingContact}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="text-destructive"
              onClick={(e) => {
                handleStopPropagation(e);
                onDelete(index);
              }}
              disabled={isProcessingContact}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Editing dialog */}
      {editingIndex !== null && (
        <ContactDialog
          contact={contacts[editingIndex]}
          onSubmit={(updatedContact) => {
            onEdit(editingIndex, updatedContact);
            setEditingIndex(null);
            setDialogOpen(false);
          }}
          openDialog={dialogOpen}
          setOpenDialog={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingIndex(null);
            }
          }}
          isProcessingContact={isProcessingContact}
        />
      )}
    </div>
  );
}
