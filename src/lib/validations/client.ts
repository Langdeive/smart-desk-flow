
import * as z from 'zod';

export const contactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('E-mail inválido').optional(),
  phone: z.string().optional(),
  is_primary: z.boolean().optional()
}).refine(data => data.email || data.phone, {
  message: 'Informe pelo menos um e-mail ou telefone'
});

export const clientSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  external_id: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().optional().default(true),
  contacts: z.array(contactSchema).min(1, 'Adicione pelo menos um contato')
});

export type ContactFormValues = z.infer<typeof contactSchema>;
export type ClientFormValues = z.infer<typeof clientSchema>;
