
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlanSelect } from '@/contexts/PlanSelectContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <div className="container max-w-3xl mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cadastro da Empresa</h1>
        <p className="text-muted-foreground mt-3">
          Complete o cadastro para criar sua conta e começar a usar o sistema.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Plano selecionado: {selectedPlan.nome}</CardTitle>
          <CardDescription>
            {selectedPlan.monthlyPrice === 0 
              ? "Plano gratuito" 
              : `R$ ${selectedPlan.monthlyPrice.toFixed(2)}/mês`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            <li>Até {selectedPlan.maxUsers} usuários</li>
            <li>Até {selectedPlan.maxTickets} tickets por mês</li>
            {selectedPlan.hasAiFeatures && <li>Recursos de IA inclusos</li>}
            {selectedPlan.hasPremiumSupport && <li>Suporte premium</li>}
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" onClick={() => navigate('/selecionar-plano')}>
            Alterar plano
          </Button>
        </CardFooter>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Dados da Empresa</h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome da empresa" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail da Empresa*</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="email@empresa.com" />
                    </FormControl>
                    <FormDescription>
                      Este será o e-mail de suporte principal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(00) 00000-0000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="companyCnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ (opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="00.000.000/0000-00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Dados do Administrador</h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="adminName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do administrador" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail*</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="admin@email.com" />
                    </FormControl>
                    <FormDescription>
                      Este será seu e-mail de acesso ao sistema
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha*</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="******" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
