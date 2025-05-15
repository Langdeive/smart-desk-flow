
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '@/lib/validations/client';

interface ClientFormFieldsProps {
  form: UseFormReturn<ClientFormValues>;
  isEditing: boolean;
}

export function ClientFormFields({ form, isEditing }: ClientFormFieldsProps) {
  return (
    <div className="space-y-4">
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

      {isEditing && (
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
    </div>
  );
}
