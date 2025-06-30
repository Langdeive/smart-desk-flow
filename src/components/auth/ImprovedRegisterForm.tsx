
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, User, Mail, Building, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PasswordStrengthIndicator } from "@/components/security/PasswordStrengthIndicator";
import { validatePassword } from "@/utils/passwordValidation";
import { SecureLogger } from "@/utils/secureLogger";
import { useRateLimiter } from "@/hooks/useRateLimiter";
import { sanitizeText } from "@/utils/sanitization";

// Schema de validação aprimorado com validação de senha segura
const registerFormSchema = z.object({
  name: z.string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "O nome não pode ter mais de 100 caracteres" })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "O nome deve conter apenas letras e espaços" }),
  email: z.string()
    .email({ message: "Por favor, insira um e-mail válido" })
    .max(254, { message: "E-mail muito longo" }),
  company: z.string()
    .min(2, { message: "O nome da empresa deve ter pelo menos 2 caracteres" })
    .max(100, { message: "O nome da empresa não pode ter mais de 100 caracteres" }),
  password: z.string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
    .max(128, { message: "A senha não pode ter mais de 128 caracteres" })
    .refine((password) => {
      const validation = validatePassword(password);
      return validation.isValid;
    }, { message: "A senha não atende aos requisitos de segurança" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function ImprovedRegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Rate limiting para tentativas de registro
  const rateLimiter = useRateLimiter('register', {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutos
    blockDurationMs: 30 * 60 * 1000 // 30 minutos de bloqueio
  });

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

  const watchedPassword = form.watch("password");
  const watchedName = form.watch("name");
  const watchedEmail = form.watch("email");
  const watchedCompany = form.watch("company");

  const onSubmit = async (data: RegisterFormValues) => {
    if (rateLimiter.isBlocked) {
      toast.error('Muitas tentativas de registro', {
        description: `Tente novamente em ${Math.ceil(rateLimiter.blockTimeRemaining / 1000 / 60)} minutos`
      });
      return;
    }

    if (!rateLimiter.recordAttempt()) {
      toast.error('Limite de tentativas excedido', {
        description: 'Aguarde antes de tentar novamente'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Sanitizar dados de entrada
      const sanitizedData = {
        name: sanitizeText(data.name.trim()),
        email: data.email.toLowerCase().trim(),
        company: sanitizeText(data.company.trim()),
        password: data.password
      };

      // Validação adicional de senha
      const passwordValidation = validatePassword(sanitizedData.password, {
        name: sanitizedData.name,
        email: sanitizedData.email,
        company: sanitizedData.company
      });

      if (!passwordValidation.isValid) {
        setError('A senha não atende aos requisitos de segurança');
        return;
      }

      SecureLogger.info('Registration attempt started', {
        email: sanitizedData.email.replace(/(.{2}).*(@.*)/, '$1***$2') // Mascarar email nos logs
      });

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: sanitizedData.email,
        password: sanitizedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: sanitizedData.name,
            company_name: sanitizedData.company,
            plan: 'free'
          }
        }
      });

      if (authError) {
        SecureLogger.error('Registration failed', { error: authError.message });
        
        if (authError.message.includes('already registered')) {
          setError('Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.');
        } else if (authError.message.includes('invalid')) {
          setError('Dados inválidos. Verifique as informações e tente novamente.');
        } else {
          setError('Erro ao criar conta. Tente novamente em alguns minutos.');
        }
        return;
      }

      if (authData.user) {
        SecureLogger.info('Registration successful', {
          userId: authData.user.id,
          emailConfirmed: authData.user.email_confirmed_at ? 'yes' : 'no'
        });

        toast.success('Conta criada com sucesso!', {
          description: 'Verifique seu e-mail para confirmar sua conta.'
        });

        // Reset do rate limiter após sucesso
        rateLimiter.reset();
        
        navigate('/login', {
          state: { 
            email: sanitizedData.email,
            message: 'Conta criada! Verifique seu e-mail para ativar sua conta.'
          }
        });
      }

    } catch (error: any) {
      SecureLogger.error('Registration exception', undefined, error);
      setError('Erro interno. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  if (rateLimiter.isBlocked) {
    const minutesRemaining = Math.ceil(rateLimiter.blockTimeRemaining / 1000 / 60);
    
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Limite Excedido</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Muitas tentativas de registro. Tente novamente em {minutesRemaining} minutos.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Link to="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Voltar ao Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
        <CardDescription className="text-center">
          Preencha os dados para criar sua conta
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {rateLimiter.attemptsRemaining < 3 && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {rateLimiter.attemptsRemaining} tentativas restantes antes do bloqueio temporário.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Seu nome completo" 
                        className="pl-9" 
                        {...field}
                        maxLength={100}
                        autoComplete="name"
                      />
                    </div>
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
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="email"
                        placeholder="seu@email.com" 
                        className="pl-9" 
                        {...field}
                        maxLength={254}
                        autoComplete="email"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Nome da sua empresa" 
                        className="pl-9" 
                        {...field}
                        maxLength={100}
                        autoComplete="organization"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="Sua senha segura" 
                        className="pl-9" 
                        {...field}
                        maxLength={128}
                        autoComplete="new-password"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  
                  <PasswordStrengthIndicator 
                    password={watchedPassword}
                    userInfo={{
                      name: watchedName,
                      email: watchedEmail,
                      company: watchedCompany
                    }}
                    className="mt-2"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="Confirme sua senha" 
                        className="pl-9" 
                        {...field}
                        maxLength={128}
                        autoComplete="new-password"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
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
      </CardFooter>
    </Card>
  );
}
