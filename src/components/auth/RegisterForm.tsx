
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from 'sonner';
import { User, Mail, Building } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { registerFormSchema, RegisterFormValues } from "@/lib/validations/auth";
import { FormInput, PasswordInput } from "./FormFields";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      
      // 1. Primeiro criar a empresa na tabela public.companies
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.company,
          plan: 'free'  // Plano default
        })
        .select('id')
        .single();
      
      if (companyError) throw companyError;
      
      if (!companyData?.id) {
        throw new Error('Falha ao criar empresa: ID não retornado');
      }
      
      console.log("Empresa criada com sucesso:", companyData);
      
      // 2. Cadastrar usuário via Auth API com company_id nos metadados
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            company_id: companyData.id,  // Agora usando o ID real da empresa criada
            plan: 'free'                 // Default plan
          }
        }
      });
      
      if (error) throw error;
      
      // Verificar setup da empresa usando consulta direta à tabela
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          console.log("Usuário criado com sucesso:", userData.user);
          
          // Verificar se a empresa foi criada 
          const { data: companies } = await supabase
            .from('companies')
            .select('id, name')
            .eq('id', companyData.id)
            .single();
          
          console.log("Empresa verificada:", companies);
          
          // Verificar vínculo do usuário com empresa
          const { data: userCompanies } = await supabase
            .from('user_companies')
            .select('user_id, company_id, role')
            .eq('company_id', companyData.id)
            .eq('user_id', userData.user.id)
            .single();
          
          console.log("Vínculo usuário-empresa verificado:", userCompanies);
          
          // Se o vínculo não foi criado automaticamente pela trigger, criá-lo manualmente
          if (!userCompanies) {
            const { error: linkError } = await supabase
              .from('user_companies')
              .insert({
                user_id: userData.user.id,
                company_id: companyData.id,
                role: 'owner'
              });
              
            if (linkError) {
              console.warn("Erro ao criar vínculo usuário-empresa manualmente:", linkError);
            } else {
              console.log("Vínculo usuário-empresa criado manualmente com sucesso");
            }
          }
        }
      } catch (validationError) {
        console.warn("Verificação do setup da empresa falhou:", validationError);
        // Prosseguir mesmo com erro, pois pode ser apenas devido a permissões ou atraso na propagação
      }
      
      toast.success("Registro realizado com sucesso", {
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });
      
      // Redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao fazer registro:", error);
      toast.error("Erro ao criar conta", {
        description: error.message || "Ocorreu um erro ao criar sua conta. Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
        <CardDescription className="text-center">
          Preencha os dados abaixo para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={form.control}
              name="name"
              label="Nome Completo"
              placeholder="Seu nome"
              icon={<User size={16} />}
            />
            
            <FormInput
              control={form.control}
              name="email"
              label="E-mail"
              placeholder="seu@email.com"
              icon={<Mail size={16} />}
            />
            
            <FormInput
              control={form.control}
              name="company"
              label="Nome da Empresa"
              placeholder="Sua empresa"
              icon={<Building size={16} />}
            />
            
            <PasswordInput
              control={form.control}
              name="password"
              label="Senha"
              placeholder="Sua senha"
              description="Mínimo de 6 caracteres"
            />
            
            <PasswordInput
              control={form.control}
              name="confirmPassword"
              label="Confirmar Senha"
              placeholder="Confirme sua senha"
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processando..." : "Criar Conta"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Já tem uma conta?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Faça login
          </Link>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Ao criar uma conta, você concorda com nossos{" "}
          <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
            Política de Privacidade
          </Link>.
        </p>
      </CardFooter>
    </Card>
  );
};
