
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlanSelect } from '@/contexts/PlanSelectContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SelectedPlanCard } from '@/components/company/SelectedPlanCard';
import { CompanyFormSection } from '@/components/company/CompanyFormSection';
import { AdminFormSection } from '@/components/company/AdminFormSection';

const companyFormSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  companyEmail: z.string().email('E-mail inválido'),
  companyPhone: z.string().optional(),
  companyCnpj: z.string().optional(),
  adminName: z.string().min(2, 'Nome do administrador é obrigatório'),
  adminEmail: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function CompanyRegister() {
  const { selectedPlan } = usePlanSelect();
  const navigate = useNavigate();
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: '',
      companyEmail: '',
      companyPhone: '',
      companyCnpj: '',
      adminName: '',
      adminEmail: '',
      password: ''
    }
  });

  const { isSubmitting } = form.formState;

  React.useEffect(() => {
    if (!selectedPlan) {
      navigate('/selecionar-plano');
    }
  }, [selectedPlan, navigate]);

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      // 1. Primeiro criar a empresa na tabela public.companies usando o nome do plano (não o ID)
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.companyName,
          plan: selectedPlan?.nome || 'free' // Usando o nome do plano, não o ID
        })
        .select('id')
        .single();

      if (companyError) {
        throw new Error(companyError.message);
      }

      if (!companyData?.id) {
        throw new Error('Falha ao criar empresa: ID não retornado');
      }

      console.log("Empresa criada com sucesso:", companyData);

      // 2. Registrar o usuário administrador com o company_id correto nos metadados
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.adminEmail,
        password: data.password,
        options: {
          data: {
            full_name: data.adminName,
            company_id: companyData.id, // ID da empresa criada no passo anterior
            role: 'admin'
          },
          emailRedirectTo: window.location.origin + '/dashboard'
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      toast.success("Empresa cadastrada com sucesso!", {
        description: "Verifique seu e-mail para confirmar o cadastro."
      });

      navigate('/login');
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);
      toast.error("Erro ao cadastrar empresa", {
        description: error instanceof Error ? error.message : "Por favor, tente novamente."
      });
    }
  };

  if (!selectedPlan) {
    return null;
  }

  return (
    <div 
      className="min-h-screen py-12"
      style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        minHeight: '100vh'
      }}
    >
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Cadastro da Empresa</h1>
          <p className="text-muted-foreground mt-3">
            Complete o cadastro para criar sua conta e começar a usar o sistema.
          </p>
        </div>

        <SelectedPlanCard plan={selectedPlan} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CompanyFormSection control={form.control} />
            
            <Separator />
            
            <AdminFormSection control={form.control} />
            
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Criando conta..." : "Criar conta"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
