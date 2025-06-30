
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/hooks/useAuth';
import { useUserStatistics } from '@/hooks/useUserStatistics';
import { BarChart3, Clock, Target, TrendingUp, Users, Award } from 'lucide-react';

export function RoleStatisticsSection() {
  const { role } = useAuth();
  const { statistics, isLoading } = useUserStatistics();

  const roleLabels = {
    admin: 'Administrador',
    owner: 'Proprietário', 
    agent: 'Agente',
    client: 'Cliente',
    developer: 'Desenvolvedor'
  };

  if (isLoading) {
    return (
      <Card className="force-white-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-turquoise-vibrant" />
            <div>
              <CardTitle className="text-xl">Estatísticas por Função</CardTitle>
              <CardDescription>Performance baseada no seu papel na empresa</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!statistics) {
    return (
      <Card className="force-white-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-turquoise-vibrant" />
            <div>
              <CardTitle className="text-xl">Estatísticas por Função</CardTitle>
              <CardDescription>Performance baseada no seu papel na empresa</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Nenhuma estatística disponível no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="force-white-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-turquoise-vibrant" />
          <div>
            <CardTitle className="text-xl">Estatísticas por Função</CardTitle>
            <CardDescription>
              Performance como {roleLabels[role as keyof typeof roleLabels] || 'Usuário'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.total_tickets}
            </div>
            <div className="text-sm text-gray-600">Total de Tickets</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {statistics.resolved_tickets}
            </div>
            <div className="text-sm text-gray-600">Tickets Resolvidos</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(statistics.avg_resolution_time_hours)}h
            </div>
            <div className="text-sm text-gray-600">Tempo Médio</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {statistics.tickets_this_month}
            </div>
            <div className="text-sm text-gray-600">Este Mês</div>
          </div>
          
          <div className="text-center p-4 bg-teal-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="h-6 w-6 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-teal-600">
              {Math.round(statistics.response_rate)}%
            </div>
            <div className="text-sm text-gray-600">Taxa de Resposta</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {statistics.satisfaction_score.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Satisfação</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <Badge variant="outline" className="bg-blue-50">
              {role === 'agent' ? 'Agente Ativo' : 'Usuário do Sistema'}
            </Badge>
            {statistics.response_rate >= 80 && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Alta Performance
              </Badge>
            )}
            {statistics.tickets_this_month > 10 && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Muito Ativo
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
