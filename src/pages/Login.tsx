
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
import { AlertCircle, CheckCircle, Lock, Mail, Shield } from "lucide-react";
import { useAuth, SignInData } from "@/hooks/useAuth";
import { useRateLimiter } from "@/hooks/useRateLimiter";
import { SecureLogger } from "@/utils/secureLogger";
import { sanitizeText } from "@/utils/sanitization";
import { SecureCspHeaders } from "@/components/security/SecureCspHeaders";

const loginFormSchema = z.object({
  email: z.string()
    .email({ message: "Por favor, insira um e-mail válido" })
    .max(254, { message: "E-mail muito longo" }),
  password: z.string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
    .max(128, { message: "Senha muito longa" }),
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
  const [loginError, setLoginError] = useState<string | null>(null);

  // Rate limiting para tentativas de login
  const rateLimiter = useRateLimiter('login', {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    blockDurationMs: 30 * 60 * 1000 // 30 minutos de bloqueio
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get("verified");
    if (verified === "true") {
      setVerificationSuccess(true);
      SecureLogger.info('Email verification successful');
    }
  }, [location]);

  useEffect(() => {
    if (user && emailVerified) {
      SecureLogger.info('User authenticated and verified, redirecting to dashboard');
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
    if (rateLimiter.isBlocked) {
      const minutesRemaining = Math.ceil(rateLimiter.blockTimeRemaining / 1000 / 60);
      setLoginError(`Muitas tentativas de login. Tente novamente em ${minutesRemaining} minutos.`);
      return;
    }

    if (!rateLimiter.recordAttempt()) {
      setLoginError('Limite de tentativas excedido. Aguarde antes de tentar novamente.');
      return;
    }

    try {
      setCurrentEmail(data.email);
      setLoginError(null);
      
      // Sanitizar dados de entrada
      const sanitizedData = {
        email: data.email.toLowerCase().trim(),
        password: data.password
      };

      SecureLogger.info('Login attempt', {
        email: sanitizedData.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        timestamp: new Date().toISOString()
      });
      
      const loginData: SignInData = {
        email: sanitizedData.email,
        password: sanitizedData.password
      };
      
      await signIn(loginData);
      
      // Reset do rate limiter após sucesso
      rateLimiter.reset();
      
      if (user && !emailVerified) {
        setIsVerificationDialogOpen(true);
      }
    } catch (error: any) {
      SecureLogger.warn('Login failed', {
        email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        error: error.message
      });
      
      // Mapear erros para mensagens mais amigáveis
      if (error.message.includes('Invalid login credentials')) {
        setLoginError('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
      } else if (error.message.includes('Email not confirmed')) {
        setLoginError('E-mail não confirmado. Verifique sua caixa de entrada.');
        setIsVerificationDialogOpen(true);
      } else if (error.message.includes('Too many requests')) {
        setLoginError('Muitas tentativas de login. Aguarde alguns minutos e tente novamente.');
      } else {
        setLoginError('Erro ao fazer login. Tente novamente em alguns minutos.');
      }
    }
  };

  const handleResendVerification = async () => {
    if (!currentEmail) return;
    
    setIsResendingEmail(true);
    try {
      await resendVerificationEmail(currentEmail);
      SecureLogger.info('Verification email resent', {
        email: currentEmail.replace(/(.{2}).*(@.*)/, '$1***$2')
      });
    } catch (error) {
      SecureLogger.error('Failed to resend verification email', undefined, error);
    } finally {
      setIsResendingEmail(false);
    }
  };

  // Se o usuário está bloqueado pelo rate limiter
  if (rateLimiter.isBlocked) {
    const minutesRemaining = Math.ceil(rateLimiter.blockTimeRemaining / 1000 / 60);
    
    return (
      <>
        <SecureCspHeaders />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Acesso Bloqueado</CardTitle>
              <CardDescription className="text-center">
                Muitas tentativas de login falharam
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Segurança Ativada</AlertTitle>
                <AlertDescription>
                  Detectamos muitas tentativas de login falhadas. Por segurança, o acesso foi temporariamente bloqueado.
                  <br /><br />
                  Tente novamente em <strong>{minutesRemaining} minutos</strong>.
                </AlertDescription>
              </Alert>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Link to="/forgot-password" className="w-full">
                <Button variant="outline" className="w-full">
                  Esqueci minha senha
                </Button>
              </Link>
              <div className="text-center text-sm">
                Não tem uma conta?{" "}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Registre-se
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SecureCspHeaders />
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

          {loginError && (
            <div className="px-6 mb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            </div>
          )}

          {rateLimiter.attemptsRemaining < 5 && rateLimiter.attemptsRemaining > 0 && (
            <div className="px-6 mb-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  {rateLimiter.attemptsRemaining} tentativas restantes antes do bloqueio temporário.
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
                            maxLength={128}
                            autoComplete="current-password"
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
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={rateLimiter.isBlocked}
                >
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
        
        <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verificação de e-mail necessária</DialogTitle>
              <DialogDescription>
                Para acessar o sistema, é necessário verificar seu e-mail. 
                Clique no link que enviamos para {currentEmail ? sanitizeText(currentEmail) : "seu e-mail"}.
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
    </>
  );
};

export default Login;
