
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createTestTicket, checkCompanySettings, getRecentLogs } from "@/utils/debugTicketCreation";
import { AlertCircle, CheckCircle, Play, RefreshCw, Settings, Bug } from "lucide-react";

const N8nDebugPanel: React.FC = () => {
  const { companyId, user } = useAuth();
  const { toast } = useToast();
  const [isTestingTicket, setIsTestingTicket] = useState(false);
  const [isCheckingSettings, setIsCheckingSettings] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [settingsCheck, setSettingsCheck] = useState<any>(null);

  const handleTestTicketCreation = async () => {
    if (!companyId) {
      toast({
        title: "Erro",
        description: "ID da empresa não encontrado.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingTicket(true);
    try {
      const result = await createTestTicket(companyId, user.id);
      setTestResults(result);
      
      if (result.success) {
        toast({
          title: "Teste executado",
          description: `Ticket criado. ${result.hasLogs ? 'Logs encontrados!' : 'Nenhum log encontrado.'}`,
          variant: result.hasLogs ? "default" : "destructive",
        });
      } else {
        toast({
          title: "Erro no teste",
          description: "Falha ao criar ticket de teste.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      toast({
        title: "Erro no teste",
        description: "Ocorreu um erro durante o teste.",
        variant: "destructive",
      });
    } finally {
      setIsTestingTicket(false);
    }
  };

  const handleCheckSettings = async () => {
    if (!companyId) return;

    setIsCheckingSettings(true);
    try {
      const result = await checkCompanySettings(companyId);
      setSettingsCheck(result);
      
      if (result.success) {
        toast({
          title: "Verificação concluída",
          description: "Configurações verificadas com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro na verificação:', error);
    } finally {
      setIsCheckingSettings(false);
    }
  };

  const renderStatusBadge = (status: boolean, trueText: string, falseText: string) => (
    <Badge variant={status ? "default" : "destructive"}>
      {status ? (
        <>
          <CheckCircle className="h-3 w-3 mr-1" />
          {trueText}
        </>
      ) : (
        <>
          <AlertCircle className="h-3 w-3 mr-1" />
          {falseText}
        </>
      )}
    </Badge>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bug className="h-5 w-5 mr-2" />
            Painel de Debug N8N
          </CardTitle>
          <CardDescription>
            Teste e valide se a integração com n8n está funcionando corretamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleCheckSettings}
              disabled={isCheckingSettings}
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isCheckingSettings ? "Verificando..." : "Verificar Configurações"}
            </Button>
            
            <Button
              onClick={handleTestTicketCreation}
              disabled={isTestingTicket}
            >
              <Play className="h-4 w-4 mr-2" />
              {isTestingTicket ? "Testando..." : "Criar Ticket de Teste"}
            </Button>
          </div>

          {settingsCheck && settingsCheck.success && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold">Status das Configurações</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Webhook URL:</span>
                  {renderStatusBadge(settingsCheck.hasWebhookUrl, "Configurado", "Não configurado")}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Processamento IA:</span>
                  {renderStatusBadge(settingsCheck.isProcessingEnabled, "Ativado", "Desativado")}
                </div>
              </div>
              
              {settingsCheck.settings.n8n_webhook_url && (
                <div className="text-xs text-muted-foreground">
                  <strong>URL:</strong> {settingsCheck.settings.n8n_webhook_url}
                </div>
              )}
              
              {settingsCheck.eventsConfig && (
                <div className="text-xs text-muted-foreground">
                  <strong>Eventos configurados:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(settingsCheck.eventsConfig).map(([key, value]) => (
                      <Badge key={key} variant={value ? "default" : "secondary"} className="text-xs">
                        {key}: {value ? "✓" : "✗"}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {testResults && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold">Resultados do Teste</h4>
              
              {testResults.success ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ticket criado:</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Sucesso
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Logs gerados:</span>
                    {renderStatusBadge(testResults.hasLogs, "Sim", "Não")}
                  </div>
                  
                  {testResults.ticket && (
                    <div className="text-xs text-muted-foreground">
                      <strong>ID do Ticket:</strong> {testResults.ticket.id}
                    </div>
                  )}
                  
                  {testResults.logs && testResults.logs.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Logs encontrados:</div>
                      {testResults.logs.map((log: any, index: number) => (
                        <div key={index} className="text-xs bg-background p-2 rounded border">
                          <div><strong>Status:</strong> {log.status}</div>
                          <div><strong>Evento:</strong> {log.event_type}</div>
                          {log.error_message && (
                            <div className="text-red-600"><strong>Erro:</strong> {log.error_message}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-red-600">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Falha no teste: {testResults.error?.message || 'Erro desconhecido'}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default N8nDebugPanel;
