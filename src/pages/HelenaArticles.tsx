
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useHelenaArticles } from '@/hooks/useHelenaArticles';
import { PendingArticleCard } from '@/components/helena/PendingArticleCard';
import { HelenaStatsCard } from '@/components/helena/HelenaStatsCard';
import { Bot, FileText, Clock, CheckCircle } from 'lucide-react';

export default function HelenaArticles() {
  const {
    pendingArticles,
    helenaStats,
    isLoading,
    statsLoading,
    error,
    approveArticle,
    rejectArticle,
    isApproving,
    isRejecting,
  } = useHelenaArticles();

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Erro ao carregar artigos da Helena. Tente novamente mais tarde.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Bot className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Helena - IA de Conhecimento</h1>
          <p className="text-muted-foreground">
            Artigos gerados automaticamente pela Helena para aprovação
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <HelenaStatsCard
          title="Pendentes"
          value={helenaStats?.total_pending || 0}
          icon={<Clock className="h-5 w-5" />}
          loading={statsLoading}
          variant="pending"
        />
        <HelenaStatsCard
          title="Aprovados"
          value={helenaStats?.total_approved || 0}
          icon={<CheckCircle className="h-5 w-5" />}
          loading={statsLoading}
          variant="approved"
        />
        <HelenaStatsCard
          title="Rejeitados"
          value={helenaStats?.total_rejected || 0}
          icon={<FileText className="h-5 w-5" />}
          loading={statsLoading}
          variant="rejected"
        />
        <HelenaStatsCard
          title="Confiança Média"
          value={helenaStats?.avg_confidence_score ? `${(helenaStats.avg_confidence_score * 100).toFixed(1)}%` : '0%'}
          icon={<Bot className="h-5 w-5" />}
          loading={statsLoading}
          variant="confidence"
        />
      </div>

      {/* Lista de Artigos Pendentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Artigos Pendentes de Aprovação
            {pendingArticles.length > 0 && (
              <Badge variant="secondary">{pendingArticles.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : pendingArticles.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum artigo pendente</h3>
              <p className="text-muted-foreground">
                A Helena criará automaticamente artigos quando tickets forem resolvidos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingArticles.map((article) => (
                <PendingArticleCard
                  key={article.id}
                  article={article}
                  onApprove={(approvalData) => approveArticle(article.id, approvalData)}
                  onReject={(reason) => rejectArticle(article.id, reason)}
                  isApproving={isApproving}
                  isRejecting={isRejecting}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
