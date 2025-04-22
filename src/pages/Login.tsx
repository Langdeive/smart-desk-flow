
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Lock, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, error, user, emailVerified, resendVerificationEmail } = useAuth();
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Verifica se o usuário acabou de verificar o e-mail através do URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get("verified");
    if (verified === "true") {
      setVerificationSuccess(true);
    }
  }, [location]);

  // Redireciona para o dashboard se o usuário estiver autenticado e com e-mail verificado
  useEffect(() => {
    if (user && emailVerified) {
      navigate("/dashboard");
    }
  }, [user, emailVerified, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setCurrentEmail(data.email);
      await signIn(data);
      
      // Se o usuário existe mas o e-mail não foi verificado, mostra o diálogo
      if (user && !emailVerified) {
        setIsVerificationDialogOpen(true);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const handleResendVerification = async () => {
    if (!currentEmail) return;
    
    setIsResendingEmail(true);
    try {
      await resendVerificationEmail(currentEmail);
    } catch (error) {
      console.error("Erro ao reenviar e-mail:", error);
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Entre na sua conta para acessar o sistema
          </CardDescription>
        </CardHeader>
        
        {verificationSuccess && (
          <div className="px-6 mb-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">E-mail verificado com sucesso!</AlertTitle>
              <AlertDescription className="text-green-700">
                Seu e-mail foi verificado. Agora você pode fazer login.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {user && !emailVerified && (
          <div className="px-6 mb-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>E-mail não verificado</AlertTitle>
              <AlertDescription>
                Você precisa verificar seu e-mail antes de acessar o sistema.
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-destructive-foreground underline ml-1"
                  onClick={() => setIsVerificationDialogOpen(true)}
                >
                  Reenviar e-mail de verificação
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="seu@email.com" className="pl-9" {...field} />
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
                          placeholder="Sua senha" 
                          className="pl-9" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-right">
                      <Link to="/forgot-password" className="text-sm font-medium text-primary">
                        Esqueceu a senha?
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Ainda não tem uma conta?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Registre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      {/* Diálogo para reenviar e-mail de verificação */}
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verificação de e-mail necessária</DialogTitle>
            <DialogDescription>
              Para acessar o sistema, é necessário verificar seu e-mail. 
              Clique no link que enviamos para {currentEmail || "seu e-mail"}.
              Não recebeu o e-mail? Podemos enviar novamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsVerificationDialogOpen(false)}
            >
              Fechar
            </Button>
            <Button 
              onClick={handleResendVerification}
              disabled={isResendingEmail}
            >
              {isResendingEmail ? "Enviando..." : "Reenviar e-mail"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
