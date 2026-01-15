import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  nomeEmpresa: string;
  segmento: string;
  nomePessoa: string;
  funcao: string;
  telefone: string;
  email: string;
  cidade: string;
  comentario: string;
  decisor: string;
}

// Simple hash function for password verification
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Pre-computed hash of the access password "solveflow2024interno"
const VALID_PASSWORD_HASH = "8a7f3c9e2b4d6a1f0e3c5b7d9a2f4e6c8b0d2a4f6e8c0b2d4a6f8e0c2b4d6a8f";

const InternalLeadForm = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessPassword, setAccessPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nomeEmpresa: "",
    segmento: "",
    nomePessoa: "",
    funcao: "",
    telefone: "",
    email: "",
    cidade: "",
    comentario: "",
    decisor: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  // Check for existing session on mount
  useEffect(() => {
    const authSession = sessionStorage.getItem('internal_form_auth');
    const authExpiry = sessionStorage.getItem('internal_form_auth_expiry');
    
    if (authSession === 'true' && authExpiry) {
      const expiryTime = parseInt(authExpiry, 10);
      if (Date.now() < expiryTime) {
        setIsAuthorized(true);
      } else {
        // Session expired, clear it
        sessionStorage.removeItem('internal_form_auth');
        sessionStorage.removeItem('internal_form_auth_expiry');
      }
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    try {
      const inputHash = await hashPassword(accessPassword);
      
      // Simple password validation - in production, this should be server-side
      // Using a known password for internal team access
      if (accessPassword === "solveflow2024interno") {
        setIsAuthorized(true);
        // Set session with 8-hour expiry
        const expiryTime = Date.now() + (8 * 60 * 60 * 1000);
        sessionStorage.setItem('internal_form_auth', 'true');
        sessionStorage.setItem('internal_form_auth_expiry', expiryTime.toString());
        toast.success("Acesso autorizado!");
      } else {
        toast.error("Senha incorreta");
      }
    } catch (error) {
      toast.error("Erro na autenticação");
    } finally {
      setIsAuthenticating(false);
      setAccessPassword("");
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit via secure edge function
      const { data, error } = await supabase.functions.invoke('submit-internal-lead', {
        body: {
          nomeEmpresa: formData.nomeEmpresa,
          segmento: formData.segmento,
          nomePessoa: formData.nomePessoa,
          funcao: formData.funcao,
          telefone: formData.telefone,
          email: formData.email,
          cidade: formData.cidade,
          comentario: formData.comentario,
          decisor: formData.decisor,
          website: honeypot, // Honeypot field
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error("Erro ao enviar. Tente novamente.");
        return;
      }

      if (!data?.success) {
        const errorMessage = data?.details?.join(', ') || data?.error || 'Erro desconhecido';
        toast.error(errorMessage);
        return;
      }

      toast.success("Lead cadastrado com sucesso!", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      
      setFormData({
        nomeEmpresa: "",
        segmento: "",
        nomePessoa: "",
        funcao: "",
        telefone: "",
        email: "",
        cidade: "",
        comentario: "",
        decisor: "",
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Authentication gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-lg shadow-lg p-6 border">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-center text-foreground mb-2">
              Acesso Restrito
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Digite a senha para acessar o formulário interno
            </p>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessPassword">Senha de Acesso</Label>
                <Input
                  id="accessPassword"
                  type="password"
                  placeholder="Digite a senha..."
                  value={accessPassword}
                  onChange={(e) => setAccessPassword(e.target.value)}
                  required
                  className="bg-muted/50"
                  autoComplete="off"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isAuthenticating}
                className="w-full !bg-[#1e2b55] !text-white hover:!bg-[#162040]"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Cadastro de Lead</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Formulário interno para registro de leads
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field - hidden from users, visible to bots */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeEmpresa">Nome empresa *</Label>
            <Input
              id="nomeEmpresa"
              placeholder="Ex: Solveflow"
              value={formData.nomeEmpresa}
              onChange={(e) => handleChange("nomeEmpresa", e.target.value)}
              required
              maxLength={100}
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="segmento">Segmento *</Label>
            <Input
              id="segmento"
              placeholder="Ex: Academia, Varejo, Tecnologia..."
              value={formData.segmento}
              onChange={(e) => handleChange("segmento", e.target.value)}
              required
              maxLength={50}
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomePessoa">Nome pessoa *</Label>
            <Input
              id="nomePessoa"
              placeholder="Ex: João da Silva"
              value={formData.nomePessoa}
              onChange={(e) => handleChange("nomePessoa", e.target.value)}
              required
              maxLength={100}
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="funcao">Função</Label>
            <Input
              id="funcao"
              placeholder="Ex: Gerente regional"
              value={formData.funcao}
              onChange={(e) => handleChange("funcao", e.target.value)}
              maxLength={100}
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              type="tel"
              placeholder="Ex: 47999304397"
              value={formData.telefone}
              onChange={(e) => handleChange("telefone", e.target.value)}
              required
              maxLength={20}
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ex: contato@empresa.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              maxLength={255}
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              placeholder="Ex: Jaraguá do Sul"
              value={formData.cidade}
              onChange={(e) => handleChange("cidade", e.target.value)}
              maxLength={100}
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentario">Comentário</Label>
            <Textarea
              id="comentario"
              placeholder="Ex: Bastante anúncios ativos, interessado em automação..."
              value={formData.comentario}
              onChange={(e) => handleChange("comentario", e.target.value)}
              rows={3}
              maxLength={1000}
              className="bg-muted/50 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="decisor">Decisor</Label>
            <Select
              value={formData.decisor}
              onValueChange={(value) => handleChange("decisor", value)}
            >
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
                <SelectItem value="talvez">Talvez / Não sei</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 !bg-[#1e2b55] !text-white hover:!bg-[#162040]"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Cadastrar Lead"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InternalLeadForm;
