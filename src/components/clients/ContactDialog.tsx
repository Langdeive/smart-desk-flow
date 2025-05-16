
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
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
import { Switch } from '@/components/ui/switch';
import { Edit2, Plus } from 'lucide-react';
import { contactSchema, type ContactFormValues } from '@/lib/validations/client';

interface ContactDialogProps {
  contact?: ContactFormValues;
  onSubmit: (contact: ContactFormValues) => void;
  openDialog?: boolean;
  setOpenDialog?: (open: boolean) => void;
  isProcessingContact?: boolean;
}

export function ContactDialog({ 
  contact, 
  onSubmit, 
  openDialog, 
  setOpenDialog,
  isProcessingContact = false
}: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Control open state from either internal or external state
  const isOpen = openDialog !== undefined ? openDialog : open;
  const setIsOpen = (newOpen: boolean) => {
    if (setOpenDialog) {
      setOpenDialog(newOpen);
    } else {
      setOpen(newOpen);
    }
  };

  // Set up the form with default values or existing contact values
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact || {
      name: '',
      email: '',
      phone: '',
      is_primary: false
    }
  });

  // Reset form when dialog opens with a different contact
  useEffect(() => {
    if (isOpen) {
      console.log("ContactDialog: Dialog opened, resetting form");
      form.reset(contact || {
        name: '',
        email: '',
        phone: '',
        is_primary: false
      });
      setIsSubmitting(false);
    }
  }, [contact, form, isOpen]);

  const handleSubmit = (data: ContactFormValues) => {
    console.log("ContactDialog: handleSubmit FIRING with data:", data);
    
    // Prevent multiple submissions
    if (isSubmitting || isProcessingContact) {
      console.log("ContactDialog: Preventing duplicate submission");
      return;
    }
    
    setIsSubmitting(true);
    
    // Use a small delay to prevent event propagation issues
    setTimeout(() => {
      onSubmit(data);
      form.reset();
      // The parent component will handle closing the dialog after processing
    }, 50);
  };

  // Only use this for the trigger button, not inside the dialog
  const preventPropagation = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(newOpen) => {
      console.log("ContactDialog: onOpenChange called with", newOpen);
      
      preventPropagation({ preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent);
      
      // Prevent closing when clicking outside to improve UX
      if (isOpen && !newOpen) {
        // Confirm before closing if form has been modified
        if (form.formState.isDirty) {
          const confirmClose = window.confirm("Deseja descartar as alterações?");
          if (!confirmClose) return;
        }
      }
      
      if (!isProcessingContact) {
        setIsOpen(newOpen);
      }
    }}>
      {!openDialog && (
        <Button 
          type="button" // Explicitly set type to button
          variant="outline" 
          onClick={(e) => {
            preventPropagation(e);
            setIsOpen(true);
          }}
        >
          {contact ? (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Editar Contato
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Novo Contato
            </>
          )}
        </Button>
      )}
      <DialogContent 
        className="z-[60]"
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking outside the dialog
          if (form.formState.isDirty || isProcessingContact) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {contact ? 'Editar Contato' : 'Novo Contato'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("ContactDialog: Form submit event triggered");
              if (!isSubmitting && !isProcessingContact) {
                form.handleSubmit(handleSubmit)(e);
              } else {
                console.log("ContactDialog: Prevented duplicate form submission");
              }
            }} 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do contato" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="E-mail do contato" 
                      {...field}
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Telefone do contato" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_primary"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Contato principal
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                disabled={isProcessingContact || isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                onClick={(e) => {
                  console.log("ContactDialog: Submit button clicked");
                  e.stopPropagation();
                }}
                disabled={isProcessingContact || isSubmitting}
              >
                {contact ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
