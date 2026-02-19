import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function WhatsAppSend() {
  const [templateName, setTemplateName] = useState("confirmacao_acesso_solveflow");
  const [phoneNumberId, setPhoneNumberId] = useState("927322533808023");
  const [destinatario, setDestinatario] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ data: unknown; ok: boolean } | null>(null);

  const EDGE_FN_URL = `https://jqtuzbldregwglevlhrw.supabase.co/functions/v1/whatsapp-proxy`;
  const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdHV6YmxkcmVnd2dsZXZsaHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MTI5NjIsImV4cCI6MjA1NzQ4ODk2Mn0.bhd499qbEtWuRUSqVW5nXoguZaB3EuFop5ucVhXkmhQ";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(EDGE_FN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": ANON_KEY,
          "Authorization": `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({
          phone_number_id: phoneNumberId,
          template_name: templateName,
          destinatario,
        }),
      });

      let data: unknown;
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse({ data, ok: res.ok });
    } catch (err) {
      setResponse({ data: { error: String(err) }, ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Envio de Mensagem WhatsApp</h1>
            <p className="text-sm text-muted-foreground">Disparar template via API do n8n</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">Configuração do Envio</CardTitle>
            <CardDescription>Preencha os campos abaixo e clique em enviar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="templateName">Nome do Template</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                <Input
                  id="phoneNumberId"
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="destinatario">Número do Destinatário</Label>
                <Input
                  id="destinatario"
                  value={destinatario}
                  onChange={(e) => setDestinatario(e.target.value)}
                  placeholder="5547999999999"
                  required
                />
                <p className="text-xs text-muted-foreground">Formato internacional, sem + ou espaços.</p>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Response Area */}
        {(loading || response) && (
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                {response?.ok === true && <CheckCircle2 className="w-4 h-4 text-primary" />}
                {response?.ok === false && <XCircle className="w-4 h-4 text-destructive" />}
                <CardTitle className="text-base font-medium">
                  {loading ? "Aguardando resposta..." : response?.ok ? "Sucesso" : "Erro na requisição"}
                </CardTitle>
              </div>
            </CardHeader>
            {response && (
              <CardContent>
                <pre className="bg-muted rounded-lg p-4 text-xs text-foreground overflow-x-auto whitespace-pre-wrap break-words">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
