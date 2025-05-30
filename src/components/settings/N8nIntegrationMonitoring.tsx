
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { getN8nIntegrationLogs, getN8nIntegrationStats } from "@/utils/supabaseEvents";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

// Use os tipos exatos do Supabase
type IntegrationLog = Tables<'n8n_integration_logs'>;
type IntegrationStats = Tables<'n8n_integration_stats'>;

const N8nIntegrationMonitoring: React.FC = () => {
  const { companyId } = useAuth();
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [stats, setStats] = useState<IntegrationStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    try {
      const [logsResult, statsResult] = await Promise.all([
        getN8nIntegrationLogs(companyId),
        getN8nIntegrationStats(companyId)
      ]);
      
      if (logsResult.success) {
        setLogs(logsResult.data || []);
      }
      
      if (statsResult.success) {
        setStats(statsResult.data || []);
      }
    } catch (error) {
      console.error('Error loading integration data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'max_retries_reached':
        return <AlertCircle className="h-4 w-4 text-red-700" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      failed: "destructive",
      pending: "secondary",
      max_retries_reached: "destructive"
    } as const;
    
    const variant = variants[status as keyof typeof variants] || "secondary";
    
    return (
      <Badge variant={variant}>
        {status}
      </Badge>
    );
  };

  const calculateSuccessRate = (successful: number | null, total: number | null) => {
    if (!total || total === 0) return 0;
    return Math.round(((successful || 0) / total) * 100);
  };

  if (!companyId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monitoramento de Integração n8n</CardTitle>
          <CardDescription>
            ID da empresa não encontrado. Verifique sua autenticação.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Monitoramento de Integração n8n</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhe o status das integrações com n8n em tempo real
          </p>
        </div>
        <Button
          onClick={loadData}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="logs">Logs Detalhados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="space-y-4">
          {stats.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Nenhuma integração encontrada ainda.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <Card key={`${stat.event_type}-${index}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      {stat.event_type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="font-medium">{stat.total_requests || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Sucesso</span>
                        <span className="font-medium text-green-600">
                          {stat.successful_requests || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Falha</span>
                        <span className="font-medium text-red-600">
                          {(stat.failed_requests || 0) + (stat.max_retries_reached || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Taxa de Sucesso</span>
                        <Badge variant={calculateSuccessRate(stat.successful_requests, stat.total_requests) >= 90 ? "default" : "destructive"}>
                          {calculateSuccessRate(stat.successful_requests, stat.total_requests)}%
                        </Badge>
                      </div>
                      {stat.last_request_at && (
                        <div className="pt-2 border-t">
                          <span className="text-xs text-muted-foreground">
                            Última: {formatDistanceToNow(new Date(stat.last_request_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          {logs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Nenhum log de integração encontrado.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Logs Recentes</CardTitle>
                <CardDescription>
                  Últimas 50 tentativas de integração
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {getStatusIcon(log.status)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {log.event_type}
                          </span>
                          {getStatusBadge(log.status)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {log.resource_type}: {log.resource_id.substring(0, 8)}...
                        </div>
                        {log.error_message && (
                          <div className="text-xs text-red-600 mt-1">
                            {log.error_message}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.created_at), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                          {log.retry_count > 0 && (
                            <span className="ml-2">
                              • {log.retry_count} tentativas
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default N8nIntegrationMonitoring;
