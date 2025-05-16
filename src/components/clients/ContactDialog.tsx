
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
}

export function ContactDialog({ 
  contact, 
  onSubmit, 
  openDialog, 
  setOpenDialog 
}: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  
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
      form.reset(contact || {
        name: '',
        email: '',
        phone: '',
        is_primary: false
      });
    }
  }, [contact, form, isOpen]);

  const handleSubmit = (data: ContactFormValues) => {
    console.log("ContactDialog submitting:", data);
    onSubmit(data);
    form.reset();
    setIsOpen(false);
  };

  // Prevent event propagation to parent elements - but not for form submission
  const preventPropagation = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(newOpen) => {
      // Prevent closing when clicking outside to improve UX
      if (isOpen && !newOpen) {
        // Confirm before closing if form has been modified
        if (form.formState.isDirty) {
          const confirmClose = window.confirm("Deseja descartar as alterações?");
          if (!confirmClose) return;
        }
      }
      setIsOpen(newOpen);
    }}>
      {!openDialog && (
        <Button 
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
      <DialogContent className="z-[60]" onClick={preventPropagation} onPointerDownOutside={(e) => {
        // Prevent closing when clicking outside the dialog
        if (form.formState.isDirty) {
          e.preventDefault();
        }
      }}>
        <DialogHeader>
          <DialogTitle>
            {contact ? 'Editar Contato' : 'Novo Contato'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" onClick={preventPropagation}>
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
                  preventPropagation(e);
                  setIsOpen(false);
                }}
              >
                Cancelar
              </Button>
              {/* Remove preventPropagation from submit button to allow form submission */}
              <Button type="submit">
                {contact ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
