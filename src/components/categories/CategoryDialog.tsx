
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/category';

const categoryFormSchema = z.object({
  key: z
    .string()
    .min(2, 'A chave deve ter pelo menos 2 caracteres')
    .max(50, 'A chave deve ter no máximo 50 caracteres')
    .regex(/^[a-z0-9_]+$/, 'A chave deve conter apenas letras minúsculas, números e underscore'),
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (#000000)'),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormValues) => void;
  category?: Category | null;
}

// Paleta sem yellow/amber
const DEFAULT_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan (turquesa vibrante)
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#1e3a8a', // blue-deep (azul profundo)
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#7c3aed', // purple (roxo intenso)
  '#a855f7', // purple-2
  '#d946ef', // fuchsia
  '#ec4899', // pink
  '#db2777', // pink-accent (rosa de destaque)
  '#6b7280', // gray
];

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  onSave,
  category,
}) => {
  const isEditing = !!category;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      key: '',
      name: '',
      description: '',
      color: '#06b6d4', // Turquesa vibrante como padrão
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        key: category.key,
        name: category.name,
        description: category.description || '',
        color: category.color,
      });
    } else {
      form.reset({
        key: '',
        name: '',
        description: '',
        color: '#06b6d4', // Turquesa vibrante
      });
    }
  }, [category, form]);

  const onSubmit = (data: CategoryFormValues) => {
    onSave(data);
  };

  const generateKeyFromName = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  };

  const handleNameChange = (name: string) => {
    if (!isEditing && !form.getValues('key')) {
      const generatedKey = generateKeyFromName(name);
      form.setValue('key', generatedKey);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere as informações da categoria.'
              : 'Crie uma nova categoria para organizar seus tickets.'}
          </DialogDescription>
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
                    <Input
                      placeholder="Ex: Problema Técnico"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: problema_tecnico"
                      {...field}
                      disabled={isEditing}
                    />
                  </FormControl>
                  <FormDescription>
                    {isEditing
                      ? 'A chave não pode ser alterada após a criação.'
                      : 'Identificador único da categoria. Use apenas letras minúsculas, números e underscore.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva quando usar esta categoria..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input
                        type="color"
                        {...field}
                        className="w-20 h-10"
                      />
                      <div className="grid grid-cols-9 gap-2">
                        {DEFAULT_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className="w-6 h-6 rounded-full border-2 border-gray-200 hover:border-gray-400"
                            style={{ backgroundColor: color }}
                            onClick={() => form.setValue('color', color)}
                          />
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
