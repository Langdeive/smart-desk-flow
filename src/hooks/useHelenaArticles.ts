
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { helenaService } from '@/services/helenaService';
import { PendingArticle, ApproveArticleData } from '@/types/helena';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useHelenaArticles() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const companyId = user?.app_metadata?.company_id;

  // Query para buscar artigos pendentes
  const {
    data: pendingArticles,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['helena-pending-articles', companyId],
    queryFn: () => helenaService.getPendingArticles(companyId!),
    enabled: !!companyId,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  // Query para estatísticas da Helena
  const {
    data: helenaStats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['helena-stats', companyId],
    queryFn: () => helenaService.getHelenaStats(companyId!),
    enabled: !!companyId,
  });

  // Mutation para aprovar artigo
  const approveMutation = useMutation({
    mutationFn: ({ pendingArticleId, approvalData }: { 
      pendingArticleId: string; 
      approvalData: ApproveArticleData 
    }) => helenaService.approveArticle(pendingArticleId, user!.id, approvalData),
    onSuccess: (publishedArticleId) => {
      toast.success('Artigo aprovado e publicado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['helena-pending-articles'] });
      queryClient.invalidateQueries({ queryKey: ['helena-stats'] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-articles'] });
    },
    onError: (error) => {
      toast.error('Erro ao aprovar artigo', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  });

  // Mutation para rejeitar artigo
  const rejectMutation = useMutation({
    mutationFn: ({ pendingArticleId, reason }: { 
      pendingArticleId: string; 
      reason: string 
    }) => helenaService.rejectArticle(pendingArticleId, user!.id, reason),
    onSuccess: () => {
      toast.success('Artigo rejeitado');
      queryClient.invalidateQueries({ queryKey: ['helena-pending-articles'] });
      queryClient.invalidateQueries({ queryKey: ['helena-stats'] });
    },
    onError: (error) => {
      toast.error('Erro ao rejeitar artigo', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    }
  });

  const approveArticle = (pendingArticleId: string, approvalData: ApproveArticleData = {}) => {
    approveMutation.mutate({ pendingArticleId, approvalData });
  };

  const rejectArticle = (pendingArticleId: string, reason: string) => {
    rejectMutation.mutate({ pendingArticleId, reason });
  };

  return {
    pendingArticles: pendingArticles || [],
    helenaStats,
    isLoading,
    statsLoading,
    error,
    refetch,
    approveArticle,
    rejectArticle,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
}

export function usePendingArticle(articleId: string) {
  return useQuery({
    queryKey: ['pending-article', articleId],
    queryFn: () => helenaService.getPendingArticleById(articleId),
    enabled: !!articleId,
  });
}
