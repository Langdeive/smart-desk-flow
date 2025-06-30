
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserActivityLogs } from '@/hooks/useUserActivityLogs';
import { Activity, Calendar, MapPin, Monitor } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ActivityLogSection() {
  const { logs, isLoading } = useUserActivityLogs(15);

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'login': 'Login realizado',
      'logout': 'Logout realizado',
      'ticket_created': 'Ticket criado',
      'ticket_updated': 'Ticket atualizado',
      'profile_updated': 'Perfil atualizado',
      'settings_changed': 'Configurações alteradas',
      'password_changed': 'Senha alterada',
      'file_uploaded': 'Arquivo enviado',
      'message_sent': 'Mensagem enviada'
    };
    return labels[action] || action;
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      'login': 'bg-green-100 text-green-800',
      'logout': 'bg-gray-100 text-gray-800',
      'ticket_created': 'bg-blue-100 text-blue-800',
      'ticket_updated': 'bg-yellow-100 text-yellow-800',
      'profile_updated': 'bg-purple-100 text-purple-800',
      'settings_changed': 'bg-orange-100 text-orange-800',
      'password_changed': 'bg-red-100 text-red-800',
      'file_uploaded': 'bg-teal-100 text-teal-800',
      'message_sent': 'bg-cyan-100 text-cyan-800'
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card className="force-white-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-turquoise-vibrant" />
            <div>
              <CardTitle className="text-xl">Log de Atividades</CardTitle>
              <CardDescription>Histórico das suas ações recentes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="force-white-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-turquoise-vibrant" />
          <div>
            <CardTitle className="text-xl">Log de Atividades</CardTitle>
            <CardDescription>Histórico das suas ações recentes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma atividade registrada ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="mt-1">
                  <Activity className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className={`${getActionColor(log.action)} text-xs`}>
                      {getActionLabel(log.action)}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(log.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>
                  
                  {log.resource_type && (
                    <p className="text-sm text-gray-600 mb-1">
                      Recurso: {log.resource_type}
                      {log.resource_id && (
                        <span className="text-xs text-gray-400 ml-1">
                          (ID: {log.resource_id.slice(0, 8)}...)
                        </span>
                      )}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {log.ip_address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {log.ip_address}
                      </span>
                    )}
                    {log.user_agent && (
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <Monitor className="h-3 w-3" />
                        {log.user_agent.includes('Chrome') ? 'Chrome' : 
                         log.user_agent.includes('Firefox') ? 'Firefox' :
                         log.user_agent.includes('Safari') ? 'Safari' : 'Navegador'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
