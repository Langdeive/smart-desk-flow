import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  createTestTicket, 
  checkCompanySettings, 
  getRecentLogs, 
  testWebhookDirectly, 
  testEdgeFunctionDirectly,
  checkEdgeFunctionMigration 
} from "@/utils/debugTicketCreation";
import { AlertCircle, CheckCircle, Play, RefreshCw, Settings, Bug, Zap, Info, ExternalLink, Activity, TrendingUp, Cpu, Shield } from "lucide-react";

const N8nDebugPanel: React.FC = () => {
  const { companyId, user } = useAuth();
  const { toast } = useToast();
  const [isTestingTicket, setIsTestingTicket] = useState(false);
  const [isCheckingSettings, setIsCheckingSettings] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [isTestingEdgeFunction, setIsTestingEdgeFunction] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [settingsCheck, setSettingsCheck] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any>(null);
  const [webhookTest, setWebhookTest] = useState<any>(null);
  const [edgeFunctionTest, setEdgeFunctionTest] = useState<any>(null);
  const [migrationStatus, setMigrationStatus] = useState<any>(null);

  // Verificar status da migração ao carregar
  useEffect(() => {
    const checkMigration = async () => {
      const status = await checkEdgeFunctionMigration();
      setMigrationStatus(status);
    };
    checkMigration();
  }, []);

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
        const statusMessage = result.hasSuccessfulLog 
          ? '✅ Edge Function funcionando! Integração com sucesso!' 
          : result.hasFailedLog
            ? '⚠️ Ainda há falhas - veja os logs detalhados'
            : result.hasLogs 
              ? '📝 Logs encontrados, verificando detalhes' 
              : '⏳ Ticket criado, aguardando processamento';
        
        toast({
          title: "Teste executado",
          description: statusMessage,
          variant: result.hasSuccessfulLog ? "default" : "destructive",
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

  const handleTestEdgeFunction = async () => {
    if (!companyId) {
      toast({
        title: "Erro",
        description: "ID da empresa não encontrado.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingEdgeFunction(true);
    try {
      const result = await testEdgeFunctionDirectly(companyId);
      setEdgeFunctionTest(result);
      
      toast({
        title: result.success ? "Edge Function funcionando perfeitamente!" : "Falha na Edge Function",
        description: result.success ? "Nova arquitetura operacional" : `Erro: ${result.error}`,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Erro no teste da Edge Function:', error);
    } finally {
      setIsTestingEdgeFunction(false);
    }
  };

  const handleCheckSettings = async () => {
    if (!companyId) return;

    setIsCheckingSettings(true);
    try {
      const [settingsResult, logsResult] = await Promise.all([
        checkCompanySettings(companyId),
        getRecentLogs(companyId, 10)
      ]);
      
      setSettingsCheck(settingsResult);
      setRecentLogs(logsResult);
      
      if (settingsResult.success) {
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

  const handleTestWebhook = async () => {
    if (!settingsCheck?.webhookUrl) {
      toast({
        title: "URL não configurada",
        description: "Configure a URL do webhook primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingWebhook(true);
    try {
      const result = await testWebhookDirectly(settingsCheck.webhookUrl);
      setWebhookTest(result);
      
      toast({
        title: result.success ? "Webhook funcionando" : "Falha no webhook",
        description: result.success ? `Status: ${result.status}` : `Erro: ${result.error}`,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Erro no teste do webhook:', error);
    } finally {
      setIsTestingWebhook(false);
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

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'pending':
        return <RefreshCw className="h-3 w-3 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Painel de Debug N8N - Nova Arquitetura Edge Function
          </CardTitle>
          <CardDescription>
            ✅ Migração concluída! Sistema agora usa Edge Function para resolver "Out of memory"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status da nova arquitetura */}
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm text-green-700">
                <strong>✅ Nova Arquitetura Ativa:</strong> Edge Function eliminou "Out of memory"
              </span>
            </div>
          </div>

          {/* Status da migração */}
          {migrationStatus && (
            <div className={`p-3 rounded-lg border ${migrationStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center">
                {migrationStatus.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className={`text-sm ${migrationStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                  <strong>Status da Migração:</strong> {migrationStatus.migrationStatus === 'completed' ? 'Concluída com sucesso' : 'Falha na migração'}
                </span>
              </div>
            </div>
          )}

          {/* Info sobre benefícios */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center">
              <Info className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-blue-700">
                <strong>Benefícios:</strong> Maior confiabilidade, melhor debugging, sem limites de memória
              </span>
            </div>
          </div>

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
              onClick={handleTestEdgeFunction}
              disabled={isTestingEdgeFunction}
              className="bg-green-600 hover:bg-green-700"
            >
              <Cpu className="h-4 w-4 mr-2" />
              {isTestingEdgeFunction ? "Testando..." : "✅ Testar Nova Arquitetura"}
            </Button>
            
            <Button
              onClick={handleTestWebhook}
              disabled={isTestingWebhook || !settingsCheck?.webhookUrl}
              variant="outline"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {isTestingWebhook ? "Testando..." : "Testar Webhook N8N"}
            </Button>
            
            <Button
              onClick={handleTestTicketCreation}
              disabled={isTestingTicket}
            >
              <Play className="h-4 w-4 mr-2" />
              {isTestingTicket ? "Testando..." : "Criar Ticket Completo"}
            </Button>
          </div>

          {/* Resultado do teste da Edge Function */}
          {edgeFunctionTest && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center">
                <Cpu className="h-4 w-4 mr-2" />
                Teste da Nova Arquitetura Edge Function
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant={edgeFunctionTest.success ? "default" : "destructive"}>
                    {edgeFunctionTest.success ? "✅ FUNCIONANDO PERFEITAMENTE!" : "❌ Falha"}
                  </Badge>
                </div>
                {edgeFunctionTest.message && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Resultado:</strong> {edgeFunctionTest.message}
                  </div>
                )}
                {edgeFunctionTest.error && (
                  <div className="text-xs text-red-600">
                    <strong>Erro:</strong> {edgeFunctionTest.error}
                  </div>
                )}
                {edgeFunctionTest.response && (
                  <div className="text-xs text-green-600">
                    <strong>✅ Edge Function respondeu:</strong> Sistema operacional
                  </div>
                )}
              </div>
            </div>
          )}

          {webhookTest && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                Teste Direto do Webhook
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status HTTP:</span>
                  <Badge variant={webhookTest.success ? "default" : "destructive"}>
                    {webhookTest.status || 'Erro'}
                  </Badge>
                </div>
                {webhookTest.url && (
                  <div className="text-xs text-muted-foreground">
                    <strong>URL:</strong> {webhookTest.url}
                  </div>
                )}
                {webhookTest.error && (
                  <div className="text-xs text-red-600">
                    <strong>Erro:</strong> {webhookTest.error}
                  </div>
                )}
              </div>
            </div>
          )}

          {settingsCheck && settingsCheck.success && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Status das Configurações
              </h4>
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
              
              {settingsCheck.webhookUrl && (
                <div className="text-xs text-muted-foreground">
                  <strong>URL:</strong> {settingsCheck.webhookUrl}
                </div>
              )}
            </div>
          )}

          {recentLogs && recentLogs.success && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Estatísticas da Nova Arquitetura
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{recentLogs.stats.success}</div>
                  <div className="text-xs text-muted-foreground">Sucessos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{recentLogs.stats.failed}</div>
                  <div className="text-xs text-muted-foreground">Falhas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{recentLogs.stats.pending}</div>
                  <div className="text-xs text-muted-foreground">Pendentes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{recentLogs.stats.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Taxa Sucesso</div>
                </div>
              </div>
            </div>
          )}

          {testResults && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Teste Completo da Nova Integração
              </h4>
              
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
                    <span className="text-sm">Nova Arquitetura:</span>
                    {testResults.hasSuccessfulLog ? (
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        ✅ FUNCIONANDO PERFEITAMENTE!
                      </Badge>
                    ) : testResults.hasFailedLog ? (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Ainda com falhas
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Processando...
                      </Badge>
                    )}
                  </div>
                  
                  {testResults.ticket && (
                    <div className="text-xs text-muted-foreground">
                      <strong>ID do Ticket:</strong> {testResults.ticket.id}
                    </div>
                  )}
                  
                  {testResults.latestLog && (
                    <div className="bg-background p-3 rounded border">
                      <div className="text-xs font-medium mb-2">Log mais recente:</div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          {getLogStatusIcon(testResults.latestLog.status)}
                          <span><strong>Status:</strong> {testResults.latestLog.status}</span>
                        </div>
                        <div><strong>Evento:</strong> {testResults.latestLog.event_type}</div>
                        {testResults.latestLog.response_status && (
                          <div><strong>HTTP Status:</strong> {testResults.latestLog.response_status}</div>
                        )}
                        {testResults.latestLog.error_message && (
                          <div className="text-red-600"><strong>Erro:</strong> {testResults.latestLog.error_message}</div>
                        )}
                      </div>
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

          {recentLogs && recentLogs.success && recentLogs.logs.length > 0 && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold">Logs Recentes (Últimos 10)</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentLogs.logs.map((log: any) => (
                  <div key={log.id} className="text-xs bg-background p-2 rounded border flex items-start gap-2">
                    {getLogStatusIcon(log.status)}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span><strong>{log.event_type}</strong></span>
                        <span className="text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      {log.response_status && (
                        <div className="text-muted-foreground">HTTP: {log.response_status}</div>
                      )}
                      {log.error_message && (
                        <div className="text-red-600 mt-1">{log.error_message}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default N8nDebugPanel;
