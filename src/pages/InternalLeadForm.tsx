import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";

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

const InternalLeadForm = () => {
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

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const webhookPayload = {
      lead: {
        company: formData.nomeEmpresa,
        segment: formData.segmento,
        name: formData.nomePessoa,
        role: formData.funcao,
        phone: formData.telefone,
        email: formData.email,
        city: formData.cidade,
        is_decision_maker: formData.decisor,
      },
      notes: formData.comentario,
      metadata: {
        source: "internal_form",
        submitted_at: new Date().toISOString(),
        page_url: window.location.href,
      },
    };

    try {
      const response = await fetch(
        "https://crm.solveflow.cloud/webhooks/workflows/157d0c3c-ffc4-466c-bf96-105e7723d0c2/84e246ed-fe53-4365-a350-bdb98bc7fcfb",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        }
      );

      if (response.ok) {
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
      } else {
        toast.error("Erro ao cadastrar lead. Tente novamente.");
      }
    } catch (error) {
      console.error("Webhook error:", error);
      toast.error("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="space-y-2">
            <Label htmlFor="nomeEmpresa">Nome empresa</Label>
            <Input
              id="nomeEmpresa"
              placeholder="Ex: Solveflow"
              value={formData.nomeEmpresa}
              onChange={(e) => handleChange("nomeEmpresa", e.target.value)}
              required
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="segmento">Segmento</Label>
            <Input
              id="segmento"
              placeholder="Ex: Academia, Varejo, Tecnologia..."
              value={formData.segmento}
              onChange={(e) => handleChange("segmento", e.target.value)}
              required
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomePessoa">Nome pessoa</Label>
            <Input
              id="nomePessoa"
              placeholder="Ex: João da Silva"
              value={formData.nomePessoa}
              onChange={(e) => handleChange("nomePessoa", e.target.value)}
              required
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
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              type="tel"
              placeholder="Ex: 47999304397"
              value={formData.telefone}
              onChange={(e) => handleChange("telefone", e.target.value)}
              required
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
